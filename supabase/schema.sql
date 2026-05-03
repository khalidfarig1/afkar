create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  hook text not null,
  problem text not null,
  solution text not null,
  target_market text not null,
  business_model text not null,
  why_now text not null,
  competitors jsonb not null default '[]'::jsonb,
  market_size text not null,
  scores jsonb not null,
  category text not null,
  region_focus jsonb not null default '[]'::jsonb,
  published_at timestamptz not null default now()
);

create index if not exists ideas_published_at_idx on ideas (published_at desc);
create index if not exists ideas_category_idx on ideas (category);

alter table ideas enable row level security;
create policy "public read" on ideas for select using (true);
