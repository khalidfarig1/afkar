# أفكار · Afkar

Arabic-first alternative to ideabrowser.com — a daily AI-generated startup idea targeting the MENA market, with full RTL UI.

🚀 **Live:** https://afkar-khalidfarig1s-projects.vercel.app

## Stack
- Next.js 15 (App Router) + Tailwind
- Supabase (Postgres) for idea storage — optional, falls back to sample data
- Claude (Anthropic SDK) for idea generation

## Setup

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

The site runs without Supabase — it uses `src/lib/sample-ideas.ts` as fallback.

## Generate a new idea

```bash
npm run generate                       # generic prompt
npm run generate "ركّز على فنتك للمؤسسات الصغيرة في مصر"
```

Saves to Supabase if env vars are set, otherwise prints the JSON.

## Supabase setup
1. Create a project at supabase.com
2. SQL editor → run `supabase/schema.sql`
3. Project Settings → API → copy URL + anon + service role into `.env.local`

## Daily automation
Cron the generator with GitHub Actions, Vercel Cron, or any scheduler:

```yaml
# .github/workflows/daily.yml
on:
  schedule: [{ cron: "0 5 * * *" }]
jobs:
  gen:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci && npm run generate
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```
