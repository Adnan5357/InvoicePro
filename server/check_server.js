import http from 'http';

const checkRoute = (path) => {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:5000${path}`, (res) => {
            console.log(`Path: ${path} | Status: ${res.statusCode}`);
            res.resume(); // consume response data
            if (res.statusCode === 404) {
                console.log(`❌ Route ${path} NOT FOUND (404).`);
            } else if (res.statusCode === 401) {
                console.log(`✅ Route ${path} EXISTS (Authorized Only - 401).`);
            } else if (res.statusCode === 200) {
                console.log(`✅ Route ${path} IS ACCESSIBLE (200).`);
            } else {
                console.log(`⚠️ Route ${path} returned status ${res.statusCode}.`);
            }
            resolve(res.statusCode);
        });

        req.on('error', (e) => {
            console.error(`❌ Connection Error: ${e.message}`);
            resolve('error');
        });
    });
};

console.log('--- Server Diagnostics ---');
await checkRoute('/api/health');
await checkRoute('/api/invoices');
