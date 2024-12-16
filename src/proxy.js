import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Buffer } from 'buffer';

const app = express();

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use('/api', createProxyMiddleware({
    target: 'https://opensky-network.org',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api',
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from('Joa_Pa:Klinoff123').toString('base64'));
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxying request to: ${req.url}`);
        console.log(`Response status code: ${proxyRes.statusCode}`);
    }
}));

app.listen(5179, () => {
    console.log('Proxy server is running on http://localhost:5179');
});