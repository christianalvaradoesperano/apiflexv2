const http = require('http');
const fs = require('fs');
const path = require('path');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/flex/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, v-c-merchant-id');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    delete req.headers['origin'];
    delete req.headers['referer'];
    delete req.headers['host'];

    proxy.web(req, res, {
      target: 'https://testflex.cybersource.com',
      changeOrigin: true
    });
    return;
  }

  let filename = req.url === '/' || req.url === '/flexv2' ? 'flexv2.html' : req.url;
  let filePath = path.join(__dirname, filename);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Archivo no encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});