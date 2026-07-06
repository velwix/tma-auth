# @velwix/tma-auth

An ultra-lightweight, zero-dependency, and isomorphic JavaScript library for validating Telegram Mini App `initData`. Engineered by **Velwix** to run flawlessly across any environment—including Cloudflare Workers, Vercel Edge Runtime, Bun, Deno, and standard Node.js.

Built entirely on the web-standard **Web Crypto API**, ensuring maximum security and execution speed.

## Features

- **Edge-Ready:** Zero Node.js-specific dependencies (`crypto` or `Buffer` free).
- **Universal Middleware:** Easily integrates with Hono.js, Cloudflare Workers, and Next.js.
- **Auto-Parsing:** Automatically converts `user` and other stringified parameters into ready-to-use JSON objects.

## Installation

```bash
npm install @velwix/tma-auth
```

## Usage

### Direct Functional Validation

```javascript
import { validateTmaData } from '@velwix/tma-auth';

const initData = "query_id=AAHdJuowAAAAAN0m6jD0...&user=%7B%22id%22%3A123456%7D&auth_date=1690000000&hash=...";
const botToken = "YOUR_TELEGRAM_BOT_TOKEN";

try {
  const result = await validateTmaData(initData, botToken, {
    expiresIn: 3600 // Optional: validate if data is older than 1 hour (in seconds)
  });
  
  console.log("Authenticated User:", result.user.id);
} catch (error) {
  console.error("Auth Failed:", error.message);
}
```

### Integration Test Example (Hono.js / Cloudflare Workers)

You can use this sample snippet to verify the integration inside your development setup:

```javascript
import { Hono } from 'hono';
import { validateTmaData, tmaMiddleware } from '@velwix/tma-auth';

const app = new Hono();
const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";

// Example 1: Direct function verification inside a POST route
app.post('/api/auth-test', async (c) => {
  try {
    const { initData } = await c.req.json();
    const userData = await validateTmaData(initData, BOT_TOKEN);
    
    return c.json({ success: true, user: userData.user });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 401);
  }
});

// Example 2: Protecting routes via global/pattern middleware
app.use('/api/protected/*', async (c, next) => {
  const middlewareInstance = tmaMiddleware({
    botToken: BOT_TOKEN,
    expiresIn: 86400
  });
  
  return middlewareInstance(c.req.raw, next);
});

app.get('/api/protected/profile', (c) => {
  // Access pre-verified user context injected by the middleware
  const tmaUser = c.req.raw.tmaUser;
  return c.json({ profile: tmaUser });
});

export default app;
```

## License

MIT © [Velwix](https://github.com/velwix/tma-auth)
