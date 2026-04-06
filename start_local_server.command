#!/bin/zsh
# Start a simple HTTP server and print the local LAN IP + port.
# Double-clicking this `.command` file in macOS Terminal will open a Terminal window
# and run this script. Close the Terminal window to stop the server.

cd "$(dirname "$0")" || exit 1

PORT=8000

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

python3 -m http.server $PORT --bind 0.0.0.0
