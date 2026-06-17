#!/bin/bash
# Restart the local npm dev server (port 3000 + optional Cloudflare tunnel).
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=3000
PID_FILE="/tmp/wortschatz_dev.pid"
LOG_FILE="/tmp/wortschatz_dev.log"

cd "$ROOT"

echo "Existing listeners on :$PORT:"
lsof -nP -iTCP:$PORT -sTCP:LISTEN || true

echo "Stopping npm dev / dev.mjs / serve on :$PORT"
pkill -f "scripts/dev.mjs" 2>/dev/null || true
pkill -f "node.*serve.*$PORT" 2>/dev/null || true
pids=$(lsof -tiTCP:$PORT -sTCP:LISTEN || true)
if [ -n "$pids" ]; then
  echo "Killing: $pids"
  kill $pids 2>/dev/null || true
fi

sleep 0.25

echo "Listeners now:"
lsof -nP -iTCP:$PORT -sTCP:LISTEN || echo "none"

echo "Starting npm run dev (nohup)..."
nohup npm run dev >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
sleep 1.2

echo "Started PID: $(cat "$PID_FILE")"
echo "Open: http://localhost:$PORT/"
echo "Log: $LOG_FILE"
echo "Listener now:"
lsof -nP -iTCP:$PORT -sTCP:LISTEN || true

ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "")
echo "LAN_IP=$ip"

echo "Last log lines:"
tail -n 20 "$LOG_FILE" || true
