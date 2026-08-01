const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Create a basic HTTP server for health checks (Cloudflare might ping this)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Dummy WS Server is running.');
});

// Initialize WebSocket server
// CRITICAL: perMessageDeflate MUST be false. 
// If enabled, Node uses ~2MB per connection. If disabled, it uses ~20KB per connection.
// This allows a 1GB RAM $5 VPS to comfortably hold 50,000+ connections!
const wss = new WebSocketServer({ 
    server,
    perMessageDeflate: false 
});

wss.on('connection', (ws, req) => {
    // Only accept connections meant for the exact analytics path
    const path = (req.url || '').split('?')[0];
    if (path !== '/post/ws') {
        ws.close(1008, 'Invalid path');
        return;
    }

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // When the Roblox script attempts to authenticate, immediately say OK.
            // This satisfies the client and stops the 3-second reconnect loop.
            if (data.type === 'auth') {
                ws.send(JSON.stringify({ type: 'auth_ok' }));
            }
            
            // Note: We silently ignore 'execution' and 'heartbeat' events.
            // By doing nothing, we save massive amounts of CPU.
        } catch (e) {
            // Silently ignore invalid JSON
        }
    });

    // Suppress error crashing
    ws.on('error', () => {
        // Silently catch socket closures/errors
    });
});

server.listen(PORT, () => {
    console.log(`[Dummy Server] Listening on port ${PORT}`);
    console.log(`Optimized for extreme concurrency (perMessageDeflate: false)`);
});
