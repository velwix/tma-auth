import { validateTmaData } from './index.js';

export function tmaMiddleware(options = {}) {
  const token = options.botToken;
  const expiresIn = options.expiresIn || 86400;

  return async (req, next) => {
    let initData = req.headers.get('X-TMA-Init-Data');

    if (!initData && req.method === 'POST') {
      try {
        const clonedReq = req.clone();
        const body = await clonedReq.json();
        initData = body.initData;
      } catch {}
    }

    if (!initData || !token) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      req.tmaUser = await validateTmaData(initData, token, { expiresIn });
      return next();
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
