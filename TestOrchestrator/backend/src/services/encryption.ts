import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// The secret key MUST be exactly 32 bytes for aes-256-cbc.
// It MUST be stable across restarts — a random fallback generates a new key
// on every cold start, making all previously-encrypted data permanently unreadable.
if (!process.env.ENCRYPTION_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY environment variable is required in production. Set it in your Vercel project settings.');
  } else {
    console.error(
      '⚠️  [encryption] ENCRYPTION_KEY is NOT set in .env — credentials saved now will be UNREADABLE after restart.\n' +
      '    Add: ENCRYPTION_KEY=<exactly 32 hex chars> to backend/.env'
    );
  }
}

// Ensure exactly 32 bytes regardless of key length (pad or slice)
const rawKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ENCRYPTION_KEY = Buffer.alloc(32);
Buffer.from(rawKey).copy(ENCRYPTION_KEY);

const IV_LENGTH = 16;

export const encrypt = (text: string): string => {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  if (!text) return '';
  const textParts = text.split(':');
  if (textParts.length < 2) throw new Error('Invalid encrypted payload — missing IV separator.');
  const ivHex = textParts.shift()!;
  const iv = Buffer.from(ivHex, 'hex');
  if (iv.length !== IV_LENGTH) throw new Error(`Invalid IV length: expected ${IV_LENGTH}, got ${iv.length}`);
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
