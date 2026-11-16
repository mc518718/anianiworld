# Anianiworld

Vietnamese-language index of licensed Japanese anime, embedded from official YouTube channels
(Muse Việt Nam, Ani-One Vietnam, POPS Anime). The site stores no video files.

- Live: https://anianiworld.vercel.app
- Stack: Next.js 15 (App Router) on Vercel, Supabase Postgres
- Data: synced inside the database with `pg_cron` + the `http` extension from the YouTube Data API v3
  (the API key lives in the database, not in this repo)

## Develop

```bash
npm install
npm run dev
```

The site reads public, row-level-security-protected data from Supabase using the publishable key in `lib/db.js`
(override with `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_KEY`).

## Pages

`/` · `/channel/[id]` · `/series/[id]` · `/watch/[videoId]?list=` · `/search?q=`
