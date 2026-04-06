#!/bin/zsh
# Start local dev server and expose a trusted HTTPS URL for mobile testing.
# Uses Cloudflare Quick Tunnel (valid cert) so secure-only APIs like Web Share
# can work without trusting self-signed certificates on iOS/Android.
# Any downloaded helper binary is placed in /tmp and removed on exit.

cd "$(dirname "$0")" || exit 1

if ! command -v python3 >/dev/null 2>&1; then
	echo "Error: python3 is required but was not found."
	exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
	echo "Error: curl is required but was not found."
	exit 1
fi

if ! command -v tar >/dev/null 2>&1; then
	echo "Error: tar is required but was not found."
	exit 1
fi

# Pick a random free port in 8100-9000 on every run.
while true; do
	PORT=$(( RANDOM % 901 + 8100 ))
	lsof -nP -iTCP:$PORT -sTCP:LISTEN -t >/dev/null 2>&1 || break
done

# Try common macOS interfaces first, then fall back to parsing ifconfig.
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || \
	ifconfig | awk '/inet / && $2 != "127.0.0.1" {print $2; exit}')

TMP_DIR=$(mktemp -d /tmp/wortschatz-dev-XXXXXX)
SERVER_LOG="$TMP_DIR/server.log"
TUNNEL_LOG="$TMP_DIR/tunnel.log"
SERVER_PID=""
TUNNEL_PID=""
TUNNEL_URL=""

cleanup() {
	if [ -n "$TUNNEL_PID" ] && kill -0 "$TUNNEL_PID" 2>/dev/null; then
		echo "Stopping tunnel (pid $TUNNEL_PID)..."
		kill "$TUNNEL_PID" 2>/dev/null || true
	fi
	if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
		echo "Stopping server (pid $SERVER_PID)..."
		kill "$SERVER_PID" 2>/dev/null || true
	fi
	if [ -d "$TMP_DIR" ]; then
		rm -rf "$TMP_DIR"
	fi
}
trap cleanup EXIT INT TERM

ensure_cloudflared() {
	if command -v cloudflared >/dev/null 2>&1; then
		command -v cloudflared
		return 0
	fi

	local arch package url tgz bin
	arch=$(uname -m)
	case "$arch" in
		arm64|aarch64)
			package="cloudflared-darwin-arm64.tgz"
			;;
		x86_64|amd64)
			package="cloudflared-darwin-amd64.tgz"
			;;
		*)
			echo "Unsupported CPU architecture: $arch" >&2
			return 1
			;;
	esac

	url="https://github.com/cloudflare/cloudflared/releases/latest/download/$package"
	tgz="$TMP_DIR/cloudflared.tgz"
	bin="$TMP_DIR/cloudflared"

	echo "cloudflared not found; downloading temporary binary..." >&2
	if ! curl -fsSL "$url" -o "$tgz"; then
		echo "Failed to download cloudflared." >&2
		return 1
	fi
	if ! tar -xzf "$tgz" -C "$TMP_DIR"; then
		echo "Failed to extract cloudflared." >&2
		return 1
	fi
	if [ ! -f "$bin" ]; then
		echo "cloudflared binary not found after extraction." >&2
		return 1
	fi
	chmod +x "$bin" >/dev/null 2>&1 || true
	echo "$bin"
}

echo "Starting local server for: $(pwd)"
echo "Port: $PORT"
echo "Local only: http://localhost:$PORT/"
if [ -n "$IP" ]; then
	echo "LAN (insecure): http://$IP:$PORT/"
else
	echo "LAN (insecure): (no LAN IP detected)"
fi

python3 -m http.server "$PORT" --bind 0.0.0.0 >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

if ! kill -0 "$SERVER_PID" 2>/dev/null; then
	echo "Error: failed to start local server."
	exit 1
fi

if ! CLOUDFLARED_BIN=$(ensure_cloudflared); then
	echo ""
	echo "Could not start trusted tunnel (cloudflared unavailable)."
	echo "Web Share may still fail on mobile over insecure/LAN URLs."
	echo "Press Ctrl+C to stop the server."
	wait "$SERVER_PID"
	exit $?
fi

if [ ! -x "$CLOUDFLARED_BIN" ]; then
	echo ""
	echo "cloudflared resolved to a non-executable path: $CLOUDFLARED_BIN"
	echo "Press Ctrl+C to stop the server."
	wait "$SERVER_PID"
	exit $?
fi

echo ""
echo "Starting trusted HTTPS tunnel..."
"$CLOUDFLARED_BIN" tunnel --no-autoupdate --url "http://127.0.0.1:$PORT" >"$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!

# Wait up to ~25s for a trycloudflare URL.
for _ in {1..100}; do
	TUNNEL_URL=$(grep -Eo 'https://[-a-z0-9]+\.trycloudflare\.com' "$TUNNEL_LOG" | head -n 1)
	if [ -n "$TUNNEL_URL" ]; then
		break
	fi
	if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
		break
	fi
	read -r -t 0.25 _unused || true
done

echo ""
if [ -n "$TUNNEL_URL" ]; then
	echo "Trusted HTTPS URL (use this on mobile):"
	echo "$TUNNEL_URL"
	echo ""
	echo "Open the URL above on your phone; Web Share should work there."
else
	echo "Tunnel started, but no public URL was detected yet."
	echo "Recent tunnel log:"
	tail -n 12 "$TUNNEL_LOG"
fi

echo ""
echo "Press Ctrl+C to stop server and tunnel."

# Keep script alive while either process is running.
while true; do
	if ! kill -0 "$SERVER_PID" 2>/dev/null; then
		echo "Local server exited."
		break
	fi
	if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
		echo "Tunnel exited."
		echo "Recent tunnel log:"
		tail -n 12 "$TUNNEL_LOG"
		break
	fi
	read -r -t 1 _unused || true
done
