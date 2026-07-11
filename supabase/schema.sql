-- Sarada Netralaya — Supabase Postgres schema + Row Level Security
-- Run this in the Supabase SQL Editor.
--
-- Policies:
--   * Anonymous (public) role can INSERT only (for new bookings).
--   * Authenticated owner can SELECT + UPDATE.
--   * No public reads.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type appointment_department as enum ('eye_care', 'optical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum ('pending', 'confirmed', 'done', 'cancelled');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null unique,
  name            text not null,
  phone           text not null,
  age             integer,
  department      appointment_department not null,
  preferred_date  date not null,
  time_slot       text not null,
  note            text,
  status          appointment_status not null default 'pending',
  ip_hash         text,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists appointments_preferred_date_idx
  on public.appointments (preferred_date);
create index if not exists appointments_status_idx
  on public.appointments (status);
create index if not exists appointments_phone_idx
  on public.appointments (phone);
create index if not exists appointments_created_at_idx
  on public.appointments (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.appointments enable row level security;

-- Anonymous users can INSERT (create bookings), but nothing else.
drop policy if exists "anon can insert appointments" on public.appointments;
create policy "anon can insert appointments"
  on public.appointments
  for insert
  to anon
  with check (true);

-- Authenticated owner can SELECT all appointments.
drop policy if exists "auth can select appointments" on public.appointments;
create policy "auth can select appointments"
  on public.appointments
  for select
  to authenticated
  using (true);

-- Authenticated owner can UPDATE appointments (e.g. change status).
drop policy if exists "auth can update appointments" on public.appointments;
create policy "auth can update appointments"
  on public.appointments
  for update
  to authenticated
  using (true)
  with check (true);

-- No DELETE policy is granted by default. Add one only if you need it.

-- ---------------------------------------------------------------------------
-- Seed the owner account (Supabase Auth)
-- ---------------------------------------------------------------------------
-- 1. In Supabase Dashboard → Authentication → Users → "Add user".
--    Email: owner@saradanetralaya.in   Password: (your strong password)
-- 2. Confirm the user (or disable email confirmation for the owner).
-- 3. That authenticated user will satisfy the RLS policies above.

-- ---------------------------------------------------------------------------
-- Helper: generate a 6-digit ref on insert (optional, if not set by app)
-- ---------------------------------------------------------------------------
create or replace function public.appointments_set_ref()
returns trigger as $$
declare
  new_ref text;
begin
  if new.ref is null or new.ref = '' then
    loop
      new_ref := lpad(floor(random() * 900000 + 100000)::text, 6, '0');
      exit when not exists (select 1 from public.appointments where ref = new_ref);
    end loop;
    new.ref := new_ref;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists appointments_set_ref_trigger on public.appointments;
create trigger appointments_set_ref_trigger
  before insert on public.appointments
  for each row execute function public.appointments_set_ref();
