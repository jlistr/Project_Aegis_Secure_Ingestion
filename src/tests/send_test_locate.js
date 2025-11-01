import http from 'http';
import crypto from 'crypto';

const payload = {
  ticketNumber: 'TX811-POC-001',
  excavator: 'Acme Excavation Co',
  address: '123 Main St, Austin, TX',
  coordinates: { lat: 30.2672, lng: -97.7431 }
};

const raw = JSON.stringify(payload);
const secret = process.env.WEBHOOK_SECRET || 'dev_secret';

function sign(secret, body) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  return 'sha256=' + hmac.digest('hex');
}

const options = {
  hostname: process.env.AEGIS_HOST || 'localhost',
  port: process.env.AEGIS_PORT || 3000,
  path: '/api/locate-request',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(raw),
    'x-aegis-signature': sign(secret, raw)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, '\nResponse:', data));
});

req.on('error', (e) => console.error('Request error', e));
req.write(raw);
req.end();
