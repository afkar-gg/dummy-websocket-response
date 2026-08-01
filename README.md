# Foxname Dummy WebSocket Server

This is an ultra-lightweight Node.js WebSocket server designed specifically to run on a $5 Linux VPS (like DigitalOcean, Hetzner, or Linode) to absorb 50,000+ "zombie" connections from outdated Roblox scripts.

Because `perMessageDeflate` (compression) is explicitly disabled in this script, Node.js memory footprint drops from ~2MB per connection to ~20KB per connection. This allows a tiny 1GB RAM server to hold over 50k connections effortlessly without crashing.

## How to set this up on your $5 VPS

1. **Install Node.js & NPM** on your VPS (Ubuntu/Debian):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Upload these files** (`server.js` and `package.json`) to a folder on your VPS.

3. **Install Dependencies**:
   ```bash
   cd /path/to/dummy-vps-server
   npm install
   ```

4. **Install PM2 to keep it running forever (even after server reboots)**:
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "foxname-ws"
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx as a Reverse Proxy (Optional but Recommended)**:
   Point your subdomain (e.g., `ws.foxname.top`) to this VPS IP.
   Configure Nginx to proxy port 80/443 to port `8080` (which this script uses by default).

6. **Cloudflare Routing**:
   In Cloudflare, go to **Rules -> Origin Rules**.
   Create a rule where if `URI Path` equals `/post/ws`, it routes traffic to `ws.foxname.top` (your VPS) instead of your GitHub Pages configuration.
