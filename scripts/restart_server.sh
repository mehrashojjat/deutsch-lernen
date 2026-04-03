#!/bin/bash
set -e

echo "Existing listeners:"
lsof -nP -iTCP:8000 -sTCP:LISTEN || true

echo "Killing known PID 78950 (if exists)"
kill -9 78950 2>/dev/null || true

echo "Killing any listeners on :8000"
pids=$(lsof -tiTCP:8000 -sTCP:LISTEN || true)
if [ -n "$pids" ]; then
  echo "Killing: $pids"
  kill -9 $pids || true
fi

echo "Killing any http.server processes and start scripts"
pkill -9 -f "python3 -m http.server" 2>/dev/null || true
pkill -9 -f "python -m http.server" 2>/dev/null || true
pkill -9 -f start_local_server.command 2>/dev/null || true

sleep 0.25

echo "Listeners now:"
lsof -nP -iTCP:8000 -sTCP:LISTEN || echo "none"

echo "Starting fresh server (nohup)..."
nohup python3 -m http.server 8000 --bind 0.0.0.0 > /tmp/wortschatz_http.log 2>&1 &
echo $! > /tmp/wortschatz_server.pid
sleep 0.6

echo "Started PID: $(cat /tmp/wortschatz_server.pid)"
echo "Listener now:"
lsof -nP -iTCP:8000 -sTCP:LISTEN || true

ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "")
echo "LAN_IP=$ip"

echo "Last server log lines:"
tail -n 20 /tmp/wortschatz_http.log || true
