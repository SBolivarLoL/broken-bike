# Hirth's Broken Bike Counter

A tiny public counter for the number of days since Hirth's bike last broke. Everyone can view the current record; only people with the shared admin password can reset it and add the incident note.

## Deploy to Vercel

1. Import this GitHub repository in [Vercel](https://vercel.com/new).
2. Create a free Redis database at [Upstash](https://upstash.com/), then copy its REST URL and token.
3. Add these environment variables to the Vercel project:

   - `ADMIN_PASSWORD` — share this only with the three admins.
   - `SESSION_SECRET` — generate one with `openssl rand -base64 32`.
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

4. Deploy. The first admin to sign in can log the initial incident and begin the counter.

The current record is stored in Redis. The password and signed session cookie never reach the browser source code. The public endpoint only exposes the date and note meant for the page.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

For a fully working local reset flow, fill in the same Upstash values in `.env.local`.
