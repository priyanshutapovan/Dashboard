-- =====================================================================
-- Migration 03: Carrier tracker (n8n daily sync status)
-- Run in Supabase SQL Editor
-- =====================================================================

-- ---------- TABLES ---------------------------------------------------

create table if not exists carrier_tracking_status (
  id bigserial primary key,
  name text not null unique,
  code text,
  shipments_tracked int default 0,
  shipments_total int default 0,
  last_sync_at timestamptz,
  next_run_at timestamptz,
  status text,            -- 'success' | 'partial' | 'stale' | 'inactive'
  note text,
  updated_at timestamptz default now()
);

create table if not exists carrier_tracking_events (
  id bigserial primary key,
  occurred_at timestamptz default now(),
  ti_id text,
  container_no text,
  carrier text,
  event_text text
);

-- ---------- VIEWS ----------------------------------------------------

create or replace view v_carrier_tracking as
  select name, code,
    shipments_tracked as tracked,
    shipments_total   as total,
    to_char(last_sync_at at time zone 'Asia/Kolkata', 'HH24:MI') as last_sync,
    to_char(next_run_at at time zone 'Asia/Kolkata', 'HH24:MI') as next_run,
    status, note
  from carrier_tracking_status
  order by name;

create or replace view v_tracking_events as
  select to_char(occurred_at at time zone 'Asia/Kolkata', 'HH24:MI') as time,
    ti_id        as ti,
    container_no as container,
    carrier,
    event_text   as event
  from carrier_tracking_events
  order by occurred_at desc
  limit 20;

-- ---------- RLS ------------------------------------------------------

alter table carrier_tracking_status enable row level security;
alter table carrier_tracking_events enable row level security;

do $$ begin
  create policy "anon read carriers" on carrier_tracking_status for select using (true);
  create policy "anon read events"   on carrier_tracking_events for select using (true);
exception when duplicate_object then null;
end $$;

-- ---------- SEED -----------------------------------------------------

insert into carrier_tracking_status (name, code, shipments_tracked, shipments_total, last_sync_at, next_run_at, status, note) values
  ('Maersk',      'MAEU', 12, 12, now() - interval '5 minutes',  now() + interval '4 hours', 'success',  null),
  ('MSC',         'MEDU',  8,  8, now() - interval '6 minutes',  now() + interval '4 hours', 'success',  null),
  ('Hapag-Lloyd', 'HLCU',  4,  5, now() - interval '7 minutes',  now() + interval '4 hours', 'partial',  'HLXU8829011 not found in carrier API'),
  ('ONE Line',    'ONEY',  3,  3, now() - interval '48 minutes', now() + interval '4 hours', 'stale',    'Last sync >30 min ago'),
  ('CMA CGM',     'CMAU',  0,  2, null,                          null,                       'inactive', 'No active n8n workflow')
on conflict (name) do update set
  shipments_tracked = excluded.shipments_tracked,
  shipments_total   = excluded.shipments_total,
  last_sync_at      = excluded.last_sync_at,
  next_run_at       = excluded.next_run_at,
  status            = excluded.status,
  note              = excluded.note,
  updated_at        = now();

insert into carrier_tracking_events (occurred_at, ti_id, container_no, carrier, event_text) values
  (now() - interval '5 minutes',   'TI82', 'MSKU7723451', 'Maersk',      'Vessel departed Mundra'),
  (now() - interval '6 minutes',   'TI83', 'MEDU8821094', 'MSC',         'Container loaded onto vessel'),
  (now() - interval '7 minutes',   'TI84', 'HLXU4490127', 'Hapag-Lloyd', 'Customs cleared'),
  (now() - interval '32 minutes',  'TI78', 'MSKU2891124', 'Maersk',      'Arrived at Jebel Ali'),
  (now() - interval '48 minutes',  'TI85', 'ONEU6612847', 'ONE Line',    'Loaded onto vessel'),
  (now() - interval '85 minutes',  'TI80', 'MEDU3318277', 'MSC',         'In transit, Suez approach'),
  (now() - interval '126 minutes', 'TI79', 'HLXU2204538', 'Hapag-Lloyd', 'Departed Hamburg'),
  (now() - interval '158 minutes', 'TI77', 'MSKU8847221', 'Maersk',      'Discharged at Singapore');
