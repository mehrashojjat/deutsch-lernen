#!/usr/bin/env node
/**
 * Start local dev server and expose a trusted HTTPS URL for mobile testing.
 * Uses Cloudflare Quick Tunnel (valid cert) so secure-only APIs like Web Share
 * can work without trusting self-signed certificates on iOS/Android.
 * Any downloaded helper binary is placed in /tmp and removed on exit.
 */

import { spawn, execSync } from "node:child_process";
import { createWriteStream, existsSync, chmodSync, rmSync } from "node:fs";
import { mkdtemp, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const PORT = 3000;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

let tmpDir = "";
let serverProc = null;
let tunnelProc = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once("error", () => resolve(true));
    tester.once("listening", () => tester.close(() => resolve(false)));
    tester.listen(port, "0.0.0.0");
  });
}

function getLanIp() {
  if (process.platform === "darwin") {
    for (const iface of ["en0", "en1"]) {
      try {
        const ip = execSync(`ipconfig getifaddr ${iface}`, {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }).trim();
        if (ip) return ip;
      } catch {
        // try next interface
      }
    }
  }

  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const entry of entries ?? []) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return "";
}

async function downloadCloudflared(destDir) {
  const arch = os.arch();
  let packageName;

  if (process.platform === "darwin") {
    packageName =
      arch === "arm64" || arch === "aarch64"
        ? "cloudflared-darwin-arm64.tgz"
        : arch === "x64" || arch === "x86_64" || arch === "amd64"
          ? "cloudflared-darwin-amd64.tgz"
          : null;
  } else if (process.platform === "linux") {
    packageName =
      arch === "arm64" || arch === "aarch64"
        ? "cloudflared-linux-arm64.tgz"
        : arch === "x64" || arch === "x86_64" || arch === "amd64"
          ? "cloudflared-linux-amd64.tgz"
          : null;
  }

  if (!packageName) {
    throw new Error(`Unsupported platform: ${process.platform} ${arch}`);
  }

  const url = `https://github.com/cloudflare/cloudflared/releases/latest/download/${packageName}`;
  const tgzPath = path.join(destDir, "cloudflared.tgz");
  const binPath = path.join(destDir, "cloudflared");

  console.error("cloudflared not found; downloading temporary binary...");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download cloudflared (${response.status})`);
  }

  await pipeline(response.body, createWriteStream(tgzPath));
  execSync(`tar -xzf "${tgzPath}" -C "${destDir}"`, { stdio: "ignore" });

  if (!existsSync(binPath)) {
    throw new Error("cloudflared binary not found after extraction");
  }

  chmodSync(binPath, 0o755);
  return binPath;
}

async function ensureCloudflared() {
  try {
    return execSync("command -v cloudflared", {
      encoding: "utf8",
      shell: "/bin/zsh",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return downloadCloudflared(tmpDir);
  }
}

function serveBin() {
  return path.join(path.dirname(require.resolve("serve/package.json")), "build", "main.js");
}

async function waitForTunnelUrl(logPath, tunnelPid, timeoutMs = 25000) {
  const deadline = Date.now() + timeoutMs;
  const urlPattern = /https:\/\/[-a-z0-9]+\.trycloudflare\.com/;

  while (Date.now() < deadline) {
    try {
      const log = await readFile(logPath, "utf8");
      const match = log.match(urlPattern);
      if (match) return match[0];
    } catch {
      // log not written yet
    }

    if (!isProcessAlive(tunnelPid)) break;
    await sleep(250);
  }

  return "";
}

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function cleanup() {
  if (tunnelProc && isProcessAlive(tunnelProc.pid)) {
    console.log(`Stopping tunnel (pid ${tunnelProc.pid})...`);
    tunnelProc.kill("SIGTERM");
  }
  if (serverProc && isProcessAlive(serverProc.pid)) {
    console.log(`Stopping server (pid ${serverProc.pid})...`);
    serverProc.kill("SIGTERM");
  }
  if (tmpDir) {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function tailLog(logPath, lines = 12) {
  try {
    const content = await readFile(logPath, "utf8");
    const tail = content.trim().split("\n").slice(-lines).join("\n");
    if (tail) console.log(tail);
  } catch {
    // ignore
  }
}

async function main() {
  if (await isPortInUse(PORT)) {
    console.error(`Error: port ${PORT} is already in use.`);
    console.error(`Stop the other process or run: lsof -ti tcp:${PORT} | xargs kill`);
    process.exit(1);
  }

  tmpDir = await mkdtemp(path.join(os.tmpdir(), "wortschatz-dev-"));
  const serverLog = path.join(tmpDir, "server.log");
  const tunnelLog = path.join(tmpDir, "tunnel.log");

  const lanIp = getLanIp();

  console.log(`Starting local server for: ${ROOT}`);
  console.log(`Port: ${PORT}`);
  console.log(`Local only: http://localhost:${PORT}/`);
  if (lanIp) {
    console.log(`LAN (insecure): http://${lanIp}:${PORT}/`);
  } else {
    console.log("LAN (insecure): (no LAN IP detected)");
  }

  const serverLogStream = createWriteStream(serverLog);
  serverProc = spawn(
    process.execPath,
    [serveBin(), "-l", `tcp://0.0.0.0:${PORT}`, ROOT],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
  );
  serverProc.stdout.pipe(serverLogStream, { end: false });
  serverProc.stderr.pipe(serverLogStream, { end: false });

  await sleep(300);
  if (!isProcessAlive(serverProc.pid)) {
    console.error("Error: failed to start local server.");
    await tailLog(serverLog);
    cleanup();
    process.exit(1);
  }

  let cloudflaredBin;
  try {
    cloudflaredBin = await ensureCloudflared();
  } catch (err) {
    console.log("");
    console.log("Could not start trusted tunnel (cloudflared unavailable).");
    console.log("Web Share may still fail on mobile over insecure/LAN URLs.");
    console.log("Press Ctrl+C to stop the server.");
    await waitForProcess(serverProc);
    cleanup();
    process.exit(0);
  }

  console.log("");
  console.log("Starting trusted HTTPS tunnel...");
  const tunnelLogStream = createWriteStream(tunnelLog);
  tunnelProc = spawn(
    cloudflaredBin,
    ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${PORT}`],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  tunnelProc.stdout.pipe(tunnelLogStream, { end: false });
  tunnelProc.stderr.pipe(tunnelLogStream, { end: false });

  const tunnelUrl = await waitForTunnelUrl(tunnelLog, tunnelProc.pid);

  console.log("");
  if (tunnelUrl) {
    console.log("Trusted HTTPS URL (use this on mobile):");
    console.log(tunnelUrl);
    console.log("");
    console.log("Open the URL above on your phone; Web Share should work there.");
  } else {
    console.log("Tunnel started, but no public URL was detected yet.");
    console.log("Recent tunnel log:");
    await tailLog(tunnelLog);
  }

  console.log("");
  console.log("Press Ctrl+C to stop server and tunnel.");

  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });

  while (true) {
    if (!isProcessAlive(serverProc.pid)) {
      console.log("Local server exited.");
      break;
    }
    if (!isProcessAlive(tunnelProc.pid)) {
      console.log("Tunnel exited.");
      console.log("Recent tunnel log:");
      await tailLog(tunnelLog);
      break;
    }
    await sleep(1000);
  }

  cleanup();
}

function waitForProcess(proc) {
  return new Promise((resolve) => {
    proc.on("exit", resolve);
  });
}

main().catch((err) => {
  console.error(err.message || err);
  cleanup();
  process.exit(1);
});
