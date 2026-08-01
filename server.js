const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Redirect ALL human visitors to www.foxname.top (GitHub Pages)
const server = http.createServer((req, res) => {
    res.writeHead(301, { 'Location': `https://www.foxname.top${req.url}` });
    res.end();
});

const wss = new WebSocketServer({ 
    server,
    perMessageDeflate: false 
});

wss.on('connection', (ws, req) => {
    const path = (req.url || '').split('?')[0];
    if (path !== '/post/ws') {
        ws.close(1008, 'Invalid path');
        return;
    }

    const ip = req.headers['cf-connecting-ip'] || 
               (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null) || 
               req.socket.remoteAddress || 
               'Unknown IP';
    const ua = req.headers['user-agent'] || 'Unknown User-Agent';

    console.log(`[${new Date().toISOString()}] [+] Connection | IP: ${ip} | UA: ${ua}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'auth') {
                ws.send(JSON.stringify({ type: 'auth_ok' }));
            }
        } catch (e) {}
    });

    ws.on('error', () => {});
});

server.listen(PORT, () => {
    console.log(`[Foxname Dummy Server] Listening on port ${PORT}`);
    console.log(`Optimized for extreme concurrency (perMessageDeflate: false)`);
});
