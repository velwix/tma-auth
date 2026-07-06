export function parseInitData(initData) {
  if (!initData) throw new Error("Missing initData");
  
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) throw new Error("Missing hash in initData");

  const keys = Array.from(params.keys()).filter(k => k !== 'hash').sort();
  const dataCheckString = keys.map(k => `${k}=${params.get(k)}`).join('\n');

  const payload = {};
  for (const [key, value] of params.entries()) {
    if (key === 'hash') continue;
    try {
      payload[key] = JSON.parse(value);
    } catch {
      payload[key] = value;
    }
  }

  return { hash, dataCheckString, payload };
}

export function verifyTimestamp(authDateStr, expiresIn) {
  if (!expiresIn || expiresIn <= 0) return;
  
  const authDate = parseInt(authDateStr, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if ((currentTime - authDate) > expiresIn) {
    throw new Error("InitData has expired");
  }
}
