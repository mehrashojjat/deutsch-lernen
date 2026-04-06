#!/bin/zsh
# Start a simple HTTP server and print the local LAN IP + port.
# Double-clicking this `.command` file in macOS Terminal will open a Terminal window
# and run this script. Close the Terminal window to stop the server.

cd "$(dirname "$0")" || exit 1

# Pick a random free port in 8100–9000 on every run.
# A new port = new origin = mobile browser fetches everything fresh (no SW cache bleed).
while true; do
	PORT=$(( RANDOM % 901 + 8100 ))
	lsof -nP -iTCP:$PORT -sTCP:LISTEN -t &>/dev/null 2>&1 || break
done

# Try common macOS interfaces first, then fall back to parsing ifconfig
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || \
		 ifconfig | awk '/inet / && $2 != "127.0.0.1" {print $2; exit}')

echo "Starting HTTP server for: $(pwd)"
echo "Port: $PORT"
echo "Local: http://localhost:$PORT/"
if [ -n "$IP" ]; then
	echo "LAN:   http://$IP:$PORT/"
else
	echo "LAN:   (no LAN IP detected)"
fi

echo "Press Ctrl+C to stop the server."

# Ensure the server process is terminated when this shell exits.
cleanup() {
	if [ -n "$SERVER_PID" ]; then
		if kill -0 "$SERVER_PID" 2>/dev/null; then
			echo "Stopping server (pid $SERVER_PID)..."
			kill "$SERVER_PID" 2>/dev/null || true
			sleep 0.2
			if kill -0 "$SERVER_PID" 2>/dev/null; then
				kill -9 "$SERVER_PID" 2>/dev/null || true
			fi
		fi
	fi
}
trap cleanup EXIT INT TERM

# Start server in background so we can trap and clean it up on shell exit.
python3 -m http.server $PORT --bind 0.0.0.0 &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID"

# Wait for the server process; when this shell exits the trap will run and stop it.
wait $SERVER_PID
