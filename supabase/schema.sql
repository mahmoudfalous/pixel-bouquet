-- ==============================================================================
-- Supabase Schema Migration: Create Deliveries Table for WhatsApp Surprises
-- ==============================================================================

-- 1. Create deliveries table
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  bouquet_id text not null,
  recipient_name text,
  phone_number text not null,
  sender_ip text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed')),
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sent_at timestamp with time zone
);

-- 2. Create indexes for quick lookups
create index if not exists idx_deliveries_bouquet_id on public.deliveries(bouquet_id);
create index if not exists idx_deliveries_status on public.deliveries(status);
create index if not exists idx_deliveries_sender_ip on public.deliveries(sender_ip);
create index if not exists idx_deliveries_created_at on public.deliveries(created_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.deliveries enable row level security;

-- 4. Set RLS policies for anonymous/public access
-- Allow creating delivery records
create policy "Allow anonymous insert into deliveries"
  on public.deliveries
  for insert
  with check (true);

-- Allow reading delivery status
create policy "Allow anonymous select from deliveries"
  on public.deliveries
  for select
  using (true);

-- Allow updating delivery status (for backend status transitions)
create policy "Allow anonymous update on deliveries"
  on public.deliveries
  for update
  using (true);
