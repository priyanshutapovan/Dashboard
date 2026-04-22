# Tapovan · Morning Screen

Editorial-style 8am briefing dashboard. One screen, one chai.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Works immediately with mock data matching the screenshot.

## Connect Supabase

1. Create a project at supabase.com → Settings → API → copy `Project URL` and `anon public` key.
2. Open Supabase SQL Editor → paste everything from `supabase/schema.sql` → Run.
   This creates 6 tables, 6 views, read-only RLS policies, and seeds the screenshot's data.
3. Create `.env` in the project root (copy from `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
4. Restart `npm run dev`. The hook auto-switches from mock → live.

## How the data flows

The app reads only from **views** (`v_dashboard_kpis`, `v_revenue_14d`, etc.), not raw tables. When you're ready to wire this to real Tapovan data, replace each view with a query that pulls from your actual `shipments`, `bank_balances`, `orders`, etc. — the frontend doesn't change.

## Structure

```
src/
├── App.jsx                    composes all sections
├── index.css                  tailwind + paper-grain background
├── lib/
│   ├── supabase.js            client (null if env missing)
│   └── format.js              ₹Cr / ₹L / ₹k helpers
├── hooks/
│   └── useDashboardData.js    mock ↔ supabase switch
└── components/
    ├── Header.jsx
    ├── KpiGrid.jsx            4 top cards
    ├── AlertBar.jsx           red bar
    ├── RevenueChart.jsx       recharts area chart
    ├── TopSkus.jsx
    ├── DispatchList.jsx
    └── D2CPanel.jsx

supabase/
└── schema.sql                 paste into SQL Editor
```

## Design

- Paper background `#f6f2e8`, subtle dot grain
- IBM Plex Serif for numbers, Mono for labels, Sans for body
- Accent orange `#c2611a`, gain green `#6b8e23`, alert red `#a1241f`
- Hairline rules, dotted dividers, tabular-nums throughout
