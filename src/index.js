import { parseInitData, verifyTimestamp } from './parse.js';
import { calculateTmaHash } from './crypto.js';
import { tmaMiddleware } from './middleware.js';

export async function validateTmaData(initData, botToken, options = {}) {
  const expiresIn = options.expiresIn || 86400;

  const { hash, dataCheckString, payload } = parseInitData(initData);
  verifyTimestamp(payload.auth_date, expiresIn);

  const calculatedHash = await calculateTmaHash(dataCheckString, botToken);
  if (calculatedHash !== hash) {
    throw new Error("Invalid hash / Signature mismatch");
  }

  return payload;
}

export { tmaMiddleware };
