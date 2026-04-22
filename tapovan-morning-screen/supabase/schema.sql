-- =====================================================================
-- Tapovan Morning Screen · Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- =====================================================================

-- ---------- TABLES ---------------------------------------------------

create table if not exists dashboard_kpis (
  id int primary key default 1,
  cash_across_banks numeric,
  cash_delta numeric,
  cash_delta_label text,
  receivables_over_90d numeric,
  receivables_buyer_count int,
  order_book_unshipped numeric,
  order_book_orders int,
  order_book_lots int,
  dispatches_today int,
  dispatches_today_ids text[],
  updated_at timestamptz default now()
);

create table if not exists dashboard_alerts (
  id bigserial primary key,
  kind text,
  text text not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists revenue_daily (
  date date primary key,
  value numeric not null
);

create table if not exists top_skus_week (
  sku text primary key,
  margin_pct numeric not null,
  week_start date
);

create table if not exists dispatches_today (
  ti text primary key,
  buyer text,
  ref text,
  origin text,
  dest text,
  line text,
  dispatch_date date default current_date
);

create table if not exists d2c_yesterday (
  brand text primary key,
  orders int,
  revenue numeric,
  note text,
  note_kind text,
  as_of date default current_date - 1
);

-- ---------- VIEWS (the app reads these) ------------------------------

create or replace view v_dashboard_kpis as
  select * from dashboard_kpis where id = 1;

create or replace view v_dashboard_alerts as
  select * from dashboard_alerts where active = true order by id;

create or replace view v_revenue_14d as
  select to_char(date, 'DD Mon') as date, value
  from revenue_daily
  where date >= current_date - 14
  order by date;

create or replace view v_top_skus_week as
  select sku, margin_pct from top_skus_week
  order by margin_pct desc
  limit 5;

create or replace view v_dispatches_today as
  select ti, buyer, ref, origin, dest, line
  from dispatches_today
  where dispatch_date = current_date
  order by ti;

create or replace view v_d2c_yesterday as
  select brand, orders, revenue, note, note_kind
  from d2c_yesterday
  order by revenue desc;

-- ---------- ROW-LEVEL SECURITY (read-only anon) ---------------------

alter table dashboard_kpis     enable row level security;
alter table dashboard_alerts   enable row level security;
alter table revenue_daily      enable row level security;
alter table top_skus_week      enable row level security;
alter table dispatches_today   enable row level security;
alter table d2c_yesterday      enable row level security;

do $$ begin
  create policy "anon read kpis"    on dashboard_kpis    for select using (true);
  create policy "anon read alerts"  on dashboard_alerts  for select using (true);
  create policy "anon read rev"     on revenue_daily     for select using (true);
  create policy "anon read sku"     on top_skus_week     for select using (true);
  create policy "anon read disp"    on dispatches_today  for select using (true);
  create policy "anon read d2c"     on d2c_yesterday     for select using (true);
exception when duplicate_object then null;
end $$;

-- ---------- SEED DATA (matches the screenshot) -----------------------

insert into dashboard_kpis (
  id, cash_across_banks, cash_delta, cash_delta_label,
  receivables_over_90d, receivables_buyer_count,
  order_book_unshipped, order_book_orders, order_book_lots,
  dispatches_today, dispatches_today_ids
) values (
  1, 32400000, 8400000, 'Friday',
  7280000, 4,
  61200000, 18, 11,
  4, array['TI82','TI83','TI84','TI85']
) on conflict (id) do update set
  cash_across_banks = excluded.cash_across_banks,
  cash_delta = excluded.cash_delta,
  cash_delta_label = excluded.cash_delta_label,
  receivables_over_90d = excluded.receivables_over_90d,
  receivables_buyer_count = excluded.receivables_buyer_count,
  order_book_unshipped = excluded.order_book_unshipped,
  order_book_orders = excluded.order_book_orders,
  order_book_lots = excluded.order_book_lots,
  dispatches_today = excluded.dispatches_today,
  dispatches_today_ids = excluded.dispatches_today_ids,
  updated_at = now();

insert into dashboard_alerts (kind, text, active) values
  ('lc',       'LC IRDOBU256071 expires in 24d',      true),
  ('drawback', 'Drawback SB 4189421 expires in 6d',   true),
  ('overdue',  'Little India invoice 98d overdue',    true)
on conflict do nothing;

insert into revenue_daily (date, value) values
  (current_date - 13, 18),
  (current_date - 12, 22),
  (current_date - 11, 19),
  (current_date - 10, 28),
  (current_date - 9,  24),
  (current_date - 8,  31),
  (current_date - 7,  27),
  (current_date - 6,  33),
  (current_date - 5,  30),
  (current_date - 4,  36),
  (current_date - 3,  34),
  (current_date - 2,  39),
  (current_date - 1,  37),
  (current_date,      41)
on conflict (date) do update set value = excluded.value;

insert into top_skus_week (sku, margin_pct) values
  ('Basmati 1121',   18.2),
  ('Turmeric Erode', 14.1),
  ('Cumin sortex',   11.8),
  ('Chilli Teja S17', 9.4),
  ('Coriander seed',  8.1)
on conflict (sku) do update set margin_pct = excluded.margin_pct;

insert into dispatches_today (ti, buyer, ref, origin, dest, line) values
  ('TI82', 'ATC',      'lot 59', 'MUN', 'DXB', 'Maersk'),
  ('TI83', 'VDYAS',    '219',    'MUN', 'HAM', 'MSC'),
  ('TI84', 'IRELAND',  '18',     'MUN', 'DUB', 'Hapag'),
  ('TI85', 'DASHMESH', '21',     'MUN', 'LGB', 'ONE Line')
on conflict (ti) do update set
  buyer = excluded.buyer, ref = excluded.ref,
  origin = excluded.origin, dest = excluded.dest, line = excluded.line;

insert into d2c_yesterday (brand, orders, revenue, note, note_kind) values
  ('Bharat Bazaar', 284, 312000, '2 stockouts', 'warn'),
  ('Thela Style',   156, 168000, 'clean',       'ok'),
  ('Bhakti Rass',    89,  94000, '1 stockout',  'warn')
on conflict (brand) do update set
  orders = excluded.orders, revenue = excluded.revenue,
  note = excluded.note, note_kind = excluded.note_kind;
