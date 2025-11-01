import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import pino from 'pino';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
app.use(express.json({ limit: '100kb' }));
app.use(helmet());
app.set('trust proxy', 1);
app.use(rateLimit({ windowMs: 60 * 1000, max: parseInt(process.env.RATE_LIMIT || '60') }));

function verifySignature(secret, payload, signatureHeader) {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expected = 'sha256=' + hmac.digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader)); }
  catch { return false; }
}

const LocatePayload = z.object({
  ticketNumber: z.string(),
  excavator: z.string(),
  address: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  receivedAt: z.string().optional()
});

app.post('/api/locate-request', (req, res) => {
  try {
    const raw = JSON.stringify(req.body);
    const sigHeader = req.get('x-aegis-signature');
    const secret = process.env.WEBHOOK_SECRET || 'dev_secret';

    if (!verifySignature(secret, raw, sigHeader)) {
      logger.warn({url: req.url, ip: req.ip}, 'Signature verification failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const parsed = LocatePayload.parse(req.body);
    parsed.receivedAt = new Date().toISOString();

    logger.info({ ticket: parsed.ticketNumber, excavator: parsed.excavator }, 'Locate request validated');
    return res.status(200).json({ success: true, ticket: parsed.ticketNumber });
  } catch (err) {
    logger.error({ err: err?.message || err }, 'Validation or processing failed');
    return res.status(400).json({ error: 'Invalid payload' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Aegis Locate Ingest API listening on port ${port}`));
