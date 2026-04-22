import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

function generateMockRevenue() {
  const data = []
  const today = new Date()
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const n = 89 - i
    const trend = 18 + n * 0.3
    const cycle = Math.sin(n / 3) * 4
    const noise = Math.sin(n * 7.13) * 2
    data.push({ date: dateStr, value: Math.round((trend + cycle + noise) * 10) / 10 })
  }
  return data
}

const mock = {
  kpis: {
    cash_across_banks: 32400000,
    cash_delta: 8400000,
    cash_delta_label: 'Friday',
    receivables_over_90d: 7280000,
    receivables_buyer_count: 4,
    order_book_unshipped: 61200000,
    order_book_orders: 18,
    order_book_lots: 11,
    dispatches_today: 4,
    dispatches_today_ids: ['TI82', 'TI83', 'TI84', 'TI85']
  },
  alerts: [
    { id: 1, kind: 'lc', text: 'LC IRDOBU256071 expires in 24d' },
    { id: 2, kind: 'drawback', text: 'Drawback SB 4189421 expires in 6d' },
    { id: 3, kind: 'overdue', text: 'Little India invoice 98d overdue' }
  ],
  revenue_daily: generateMockRevenue(),
  top_skus: [
    { sku: 'Basmati 1121', margin_pct: 18.2 },
    { sku: 'Turmeric Erode', margin_pct: 14.1 },
    { sku: 'Cumin sortex', margin_pct: 11.8 },
    { sku: 'Chilli Teja S17', margin_pct: 9.4 },
    { sku: 'Coriander seed', margin_pct: 8.1 }
  ],
  dispatches: [
    { ti: 'TI82', buyer: 'ATC', ref: 'lot 59', origin: 'MUN', dest: 'DXB', line: 'Maersk', container: 'MSKU7723451', vessel: 'Maersk Halifax', eta: '02 May', status: 'Loaded', value: 6230000 },
    { ti: 'TI83', buyer: 'VDYAS', ref: '219', origin: 'MUN', dest: 'HAM', line: 'MSC', container: 'MEDU8821094', vessel: 'MSC Oscar', eta: '18 May', status: 'In transit to port', value: 8950000 },
    { ti: 'TI84', buyer: 'IRELAND', ref: '18', origin: 'MUN', dest: 'DUB', line: 'Hapag', container: 'HLXU4490127', vessel: 'Hapag Brussels', eta: '14 May', status: 'Customs cleared', value: 4720000 },
    { ti: 'TI85', buyer: 'DASHMESH', ref: '21', origin: 'MUN', dest: 'LGB', line: 'ONE Line', container: 'ONEU6612847', vessel: 'ONE Innovation', eta: '22 May', status: 'Loaded', value: 5280000 }
  ],
  d2c_yesterday: [
    { brand: 'Bharat Bazaar', orders: 284, revenue: 312000, note: '2 stockouts', note_kind: 'warn' },
    { brand: 'Thela Style', orders: 156, revenue: 168000, note: 'clean', note_kind: 'ok' },
    { brand: 'Bhakti Rass', orders: 89, revenue: 94000, note: '1 stockout', note_kind: 'warn' }
  ],
  cash_breakdown: [
    { bank_name: 'HDFC Bank', account_label: 'Current', account_number_masked: 'XXXX4521', balance: 14200000, last_synced: '08:12' },
    { bank_name: 'ICICI Bank', account_label: 'Current', account_number_masked: 'XXXX8839', balance: 9850000, last_synced: '08:11' },
    { bank_name: 'SBI', account_label: 'Current', account_number_masked: 'XXXX2107', balance: 5420000, last_synced: '08:14' },
    { bank_name: 'Yes Bank', account_label: 'Current', account_number_masked: 'XXXX6643', balance: 2930000, last_synced: '08:10' }
  ],
  receivables_detail: [
    { buyer_name: 'Punjab Imports UK', invoice_number: 'TPV/24-25/0779', amount: 1740000, days_overdue: 137, last_contact: '28 Mar' },
    { buyer_name: 'Desi Mart Ltd', invoice_number: 'TPV/24-25/0801', amount: 1490000, days_overdue: 124, last_contact: '02 Apr' },
    { buyer_name: 'Saffron Spice Co', invoice_number: 'TPV/24-25/0834', amount: 2210000, days_overdue: 112, last_contact: '08 Apr' },
    { buyer_name: 'Little India Foods', invoice_number: 'TPV/24-25/0892', amount: 1840000, days_overdue: 98, last_contact: '12 Apr' }
  ],
  orders_unshipped: [
    { order_id: 'TPV-26-042', buyer: 'ATC Dubai', sku: 'Basmati 1121 · 5kg', quantity: 2400, unit: 'bags', value_inr: 14400000, promised: '24 Apr', status: 'Production' },
    { order_id: 'TPV-26-043', buyer: 'VDYAS Hamburg', sku: 'Turmeric Erode powder', quantity: 18000, unit: 'kg', value_inr: 9800000, promised: '26 Apr', status: 'QC' },
    { order_id: 'TPV-26-044', buyer: 'Ireland Spice', sku: 'Cumin sortex', quantity: 12000, unit: 'kg', value_inr: 7200000, promised: '25 Apr', status: 'Packing' },
    { order_id: 'TPV-26-045', buyer: 'Dashmesh LGB', sku: 'Coriander seed', quantity: 25000, unit: 'kg', value_inr: 6250000, promised: '28 Apr', status: 'Production' },
    { order_id: 'TPV-26-046', buyer: 'Bharat Bazaar', sku: 'Chilli Teja S17', quantity: 8000, unit: 'kg', value_inr: 5600000, promised: '30 Apr', status: 'Ready' },
    { order_id: 'TPV-26-047', buyer: 'Saffron Co', sku: 'Pusa basmati', quantity: 1500, unit: 'bags', value_inr: 8400000, promised: '02 May', status: 'Production' },
    { order_id: 'TPV-26-048', buyer: 'Little India', sku: 'Mixed spices · 200g', quantity: 35000, unit: 'cases', value_inr: 9550000, promised: '05 May', status: 'QC' }
  ],
  carrier_tracking: [
    { name: 'Maersk', code: 'MAEU', tracked: 12, total: 12, last_sync: '08:15', next_run: '12:00', status: 'success', note: null },
    { name: 'MSC', code: 'MEDU', tracked: 8, total: 8, last_sync: '08:14', next_run: '12:00', status: 'success', note: null },
    { name: 'Hapag-Lloyd', code: 'HLCU', tracked: 4, total: 5, last_sync: '08:13', next_run: '12:00', status: 'partial', note: 'HLXU8829011 not found in carrier API' },
    { name: 'ONE Line', code: 'ONEY', tracked: 3, total: 3, last_sync: '07:32', next_run: '12:00', status: 'stale', note: 'Last sync >30 min ago' },
    { name: 'CMA CGM', code: 'CMAU', tracked: 0, total: 2, last_sync: null, next_run: null, status: 'inactive', note: 'No active n8n workflow' }
  ],
  tracking_events: [
    { time: '08:15', ti: 'TI82', container: 'MSKU7723451', carrier: 'Maersk', event: 'Vessel departed Mundra' },
    { time: '08:14', ti: 'TI83', container: 'MEDU8821094', carrier: 'MSC', event: 'Container loaded onto vessel' },
    { time: '08:13', ti: 'TI84', container: 'HLXU4490127', carrier: 'Hapag-Lloyd', event: 'Customs cleared' },
    { time: '07:48', ti: 'TI78', container: 'MSKU2891124', carrier: 'Maersk', event: 'Arrived at Jebel Ali' },
    { time: '07:32', ti: 'TI85', container: 'ONEU6612847', carrier: 'ONE Line', event: 'Loaded onto vessel' },
    { time: '06:55', ti: 'TI80', container: 'MEDU3318277', carrier: 'MSC', event: 'In transit, Suez approach' },
    { time: '06:14', ti: 'TI79', container: 'HLXU2204538', carrier: 'Hapag-Lloyd', event: 'Departed Hamburg' },
    { time: '05:42', ti: 'TI77', container: 'MSKU8847221', carrier: 'Maersk', event: 'Discharged at Singapore' }
  ]
}

export function useDashboardData() {
  const [data, setData] = useState(mock)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    async function load() {
      try {
        const [
          kpisRes, alertsRes, revRes, skuRes, dispRes, d2cRes,
          cashRes, recvRes, ordRes, carriersRes, eventsRes
        ] = await Promise.all([
          supabase.from('v_dashboard_kpis').select('*').single(),
          supabase.from('v_dashboard_alerts').select('*').eq('active', true),
          supabase.from('v_revenue_daily').select('*').order('date'),
          supabase.from('v_top_skus_week').select('*').order('margin_pct', { ascending: false }).limit(5),
          supabase.from('v_dispatches_today').select('*').order('ti'),
          supabase.from('v_d2c_yesterday').select('*'),
          supabase.from('v_cash_breakdown').select('*'),
          supabase.from('v_receivables_detail').select('*'),
          supabase.from('v_orders_unshipped').select('*'),
          supabase.from('v_carrier_tracking').select('*'),
          supabase.from('v_tracking_events').select('*')
        ])

        if (cancelled) return

        setData({
          kpis: kpisRes.data ?? mock.kpis,
          alerts: alertsRes.data ?? mock.alerts,
          revenue_daily: revRes.data ?? mock.revenue_daily,
          top_skus: skuRes.data ?? mock.top_skus,
          dispatches: dispRes.data ?? mock.dispatches,
          d2c_yesterday: d2cRes.data ?? mock.d2c_yesterday,
          cash_breakdown: cashRes.data ?? mock.cash_breakdown,
          receivables_detail: recvRes.data ?? mock.receivables_detail,
          orders_unshipped: ordRes.data ?? mock.orders_unshipped,
          carrier_tracking: carriersRes.data ?? mock.carrier_tracking,
          tracking_events: eventsRes.data ?? mock.tracking_events
        })
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
