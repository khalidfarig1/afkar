create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  polar_customer_id text,
  polar_subscription_id text unique,
  product_id text not null,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_email_idx on subscriptions (email);
create index if not exists subscriptions_status_idx on subscriptions (status);

alter table subscriptions enable row level security;

create policy "users read own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- Webhook handler runs as anon (publishable key); bypassed by signature verification.
create policy "anon insert subs" on subscriptions for insert to anon with check (true);
create policy "anon update subs" on subscriptions for update to anon using (true) with check (true);
