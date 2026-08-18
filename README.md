# 8-Ball H2H

A tiny, fully open web app for tracking head-to-head 8-ball pool results between
**Thomas, Cody, Neo and Lynn**. Record a match, browse the history, and see the
leaderboard ranked by wins.

There is **no authentication** — anyone with the link can record matches and view
the leaderboard.

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui and Prisma.

## 1. Create a hosted database and set `DATABASE_URL`

The app needs a hosted Postgres database (a local SQLite file would be ephemeral
on a serverless host):

1. Create a free project at [Neon](https://neon.tech) or
   [Supabase](https://supabase.com).
2. Copy the connection string (Neon: the *pooled* connection string).
3. Copy `.env.example` to `.env` and set it:

   ```bash
   cp .env.example .env
   # then edit .env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ```

## 2. Create the schema

```bash
npm install
npx prisma db push
```

This creates the `matches` table from `prisma/schema.prisma`.

## 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` — record a match and view the match history
- `/leaderboard` — wins, losses, games played and win rate per player

## 4. Deploy to Vercel

1. Push this repository (`litomli/8-Ball`) to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository. The defaults for a
   Next.js project are correct — no build overrides needed
   (`prisma generate` runs automatically via the `postinstall` script).
3. Add the environment variable `DATABASE_URL` (same value as your `.env`) for
   the Production, Preview and Development environments.
4. Deploy, then share the resulting public URL with all four players.

If you change `prisma/schema.prisma` later, run `npx prisma db push` again
against the hosted database.

## Players

The four players are hardcoded in `lib/players.ts`. Edit that list to change them.

## API

A JSON route is available if you want to script results:

```bash
# list matches, most recent first
curl https://<your-app>/api/matches

# record a match
curl -X POST https://<your-app>/api/matches \
  -H "content-type: application/json" \
  -d '{"winner":"Thomas","loser":"Cody"}'
```
