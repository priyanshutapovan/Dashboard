import { Link } from 'react-router-dom'
import { inrShort } from '../lib/format'
import { useDashboardData } from '../hooks/useDashboardData'

// ============================================================
// Shared layout
// ============================================================

function PageShell({ label, title, meta, children, backTo = '/' }) {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-6">
      <header className="pb-5 border-b hairline mb-5">
        <Link
          to={backTo}
          className="font-mono text-[10.5px] tracking-widest2 uppercase text-muted hover:text-ink inline-flex items-center gap-1.5 mb-4 transition-colors"
        >
          <span>←</span> Back
        </Link>
        <p className="label mb-2">{label}</p>
        <h1 className="font-serif text-[40px] leading-none font-medium text-ink">
          {title}
        </h1>
        {meta && (
          <p className="font-mono text-[12px] text-muted mt-2.5">{meta}</p>
        )}
      </header>
      {children}
    </div>
  )
}

function Th({ children, align = 'left' }) {
  return (
    <th className={`label py-2.5 px-3 font-normal text-${align} border-b hairline`}>
      {children}
    </th>
  )
}

function Td({ children, mono = false, align = 'left', className = '' }) {
  return (
    <td
      className={`py-3 px-3 text-${align} ${
        mono ? 'font-mono text-[12px]' : 'font-serif text-[14px]'
      } text-ink ${className}`}
    >
      {children}
    </td>
  )
}

function StatusPill({ status }) {
  const styles = {
    Production: 'bg-rule/40 text-muted',
    QC: 'bg-amber-100/60 text-amber-900',
    Packing: 'bg-blue-100/50 text-blue-900',
    Ready: 'bg-green-100/60 text-green-900',
    Loaded: 'bg-green-100/60 text-green-900',
    'In transit to port': 'bg-amber-100/60 text-amber-900',
    'Customs cleared': 'bg-blue-100/50 text-blue-900',
    success: 'bg-green-100/60 text-green-900',
    partial: 'bg-amber-100/60 text-amber-900',
    stale: 'bg-orange-100/60 text-orange-900',
    inactive: 'bg-rule/40 text-muted'
  }
  const labels = {
    success: 'Success',
    partial: 'Partial',
    stale: 'Stale',
    inactive: 'Not configured'
  }
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${
        styles[status] || 'bg-rule/30 text-muted'
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}

// ============================================================
// 1. Cash Across Banks
// ============================================================

export function CashPage() {
  const { data } = useDashboardData()
  const rows = data.cash_breakdown ?? []
  const total = rows.reduce((s, r) => s + Number(r.balance || 0), 0)

  return (
    <PageShell
      label="Cash across banks"
      title={inrShort(total)}
      meta={`${rows.length} accounts · last synced this morning`}
    >
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <Th>Bank</Th>
              <Th>Account</Th>
              <Th align="right">Balance</Th>
              <Th align="right">Synced</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.bank_name + i}
                className={i < rows.length - 1 ? 'border-b border-dotted border-rule' : ''}
              >
                <Td>{r.bank_name}</Td>
                <Td mono className="text-muted">
                  {r.account_label} · {r.account_number_masked}
                </Td>
                <Td align="right" className="tabular-nums">{inrShort(r.balance)}</Td>
                <Td align="right" mono className="text-muted">{r.last_synced} IST</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
}

// ============================================================
// 2. Receivables > 90 days
// ============================================================

export function ReceivablesPage() {
  const { data } = useDashboardData()
  const rows = data.receivables_detail ?? []
  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0)

  return (
    <PageShell
      label="Receivables > 90 days"
      title={inrShort(total)}
      meta={`${rows.length} buyers · sorted by days overdue`}
    >
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <Th>Buyer</Th>
              <Th>Invoice</Th>
              <Th align="right">Amount</Th>
              <Th align="right">Days overdue</Th>
              <Th align="right">Last contact</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.invoice_number + i}
                className={i < rows.length - 1 ? 'border-b border-dotted border-rule' : ''}
              >
                <Td>{r.buyer_name}</Td>
                <Td mono className="text-muted">{r.invoice_number}</Td>
                <Td align="right" className="tabular-nums">{inrShort(r.amount)}</Td>
                <Td
                  align="right"
                  mono
                  className={r.days_overdue > 120 ? 'text-alertText' : 'text-accent'}
                >
                  {r.days_overdue}d
                </Td>
                <Td align="right" mono className="text-muted">{r.last_contact}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
}

// ============================================================
// 3. Order Book · Unshipped
// ============================================================

export function OrdersPage() {
  const { data } = useDashboardData()
  const rows = data.orders_unshipped ?? []
  const total = rows.reduce((s, r) => s + Number(r.value_inr || 0), 0)

  return (
    <PageShell
      label="Order book · unshipped"
      title={inrShort(total)}
      meta={`${rows.length} orders · sorted by promised ship date`}
    >
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Buyer</Th>
              <Th>SKU</Th>
              <Th align="right">Qty</Th>
              <Th align="right">Value</Th>
              <Th align="right">Promised</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.order_id}
                className={i < rows.length - 1 ? 'border-b border-dotted border-rule' : ''}
              >
                <Td mono className="text-accent">{r.order_id}</Td>
                <Td>{r.buyer}</Td>
                <Td mono className="text-muted">{r.sku}</Td>
                <Td align="right" mono className="tabular-nums">
                  {Number(r.quantity).toLocaleString('en-IN')} {r.unit}
                </Td>
                <Td align="right" className="tabular-nums">{inrShort(r.value_inr)}</Td>
                <Td align="right" mono className="text-muted">{r.promised}</Td>
                <Td align="right"><StatusPill status={r.status} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
}

// ============================================================
// 4. Today's Dispatches
// ============================================================

export function DispatchesPage() {
  const { data } = useDashboardData()
  const rows = data.dispatches ?? []
  const total = rows.reduce((s, r) => s + Number(r.value || 0), 0)

  return (
    <PageShell
      label="Today's dispatches"
      title={rows.length}
      meta={`${inrShort(total)} value · all leaving Mundra`}
    >
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <Th>TI</Th>
              <Th>Buyer</Th>
              <Th>Route</Th>
              <Th>Line</Th>
              <Th>Container</Th>
              <Th>Vessel</Th>
              <Th align="right">ETA</Th>
              <Th align="right">Value</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.ti}
                className={i < rows.length - 1 ? 'border-b border-dotted border-rule' : ''}
              >
                <Td mono className="text-accent">{r.ti}</Td>
                <Td>{r.buyer}</Td>
                <Td mono className="text-muted">{r.origin} → {r.dest}</Td>
                <Td mono className="text-muted">{r.line}</Td>
                <Td mono className="text-muted">{r.container}</Td>
                <Td>{r.vessel}</Td>
                <Td align="right" mono className="text-muted">{r.eta}</Td>
                <Td align="right" className="tabular-nums">{inrShort(r.value)}</Td>
                <Td align="right"><StatusPill status={r.status} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
}

// ============================================================
// 5. Carrier Tracker (n8n sync status)
// ============================================================

export function CarrierTrackerPage() {
  const { data } = useDashboardData()
  const carriers = data.carrier_tracking ?? []
  const events = data.tracking_events ?? []

  const totalTracked = carriers.reduce((s, c) => s + Number(c.tracked || 0), 0)
  const totalShipments = carriers.reduce((s, c) => s + Number(c.total || 0), 0)
  const healthy = carriers.filter((c) => c.status === 'success').length

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-6">
      <header className="pb-5 border-b hairline mb-5">
        <p className="label mb-2">Carrier tracker · n8n daily sync</p>
        <h1 className="font-serif text-[40px] leading-none font-medium text-ink">
          {totalTracked}
          <span className="text-muted text-[28px]"> / {totalShipments} shipments</span>
        </h1>
        <p className="font-mono text-[12px] text-muted mt-2.5">
          {healthy} of {carriers.length} carriers healthy ·
          {' '}last n8n run 08:15 IST · next run 12:00 IST
        </p>
      </header>

      {/* Carrier sync table */}
      <div className="card p-0 overflow-hidden mb-5">
        <table className="w-full">
          <thead>
            <tr>
              <Th>Carrier</Th>
              <Th>Code</Th>
              <Th align="right">Tracked</Th>
              <Th align="right">Last sync</Th>
              <Th align="right">Next run</Th>
              <Th align="right">Status</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {carriers.map((c, i) => (
              <tr
                key={c.name}
                className={i < carriers.length - 1 ? 'border-b border-dotted border-rule' : ''}
              >
                <Td>{c.name}</Td>
                <Td mono className="text-muted">{c.code}</Td>
                <Td
                  align="right"
                  mono
                  className={`tabular-nums ${
                    c.tracked === c.total ? 'text-ink' : 'text-accent'
                  }`}
                >
                  {c.tracked} / {c.total}
                </Td>
                <Td align="right" mono className="text-muted">
                  {c.last_sync ? `${c.last_sync} IST` : '—'}
                </Td>
                <Td align="right" mono className="text-muted">
                  {c.next_run ? `${c.next_run} IST` : '—'}
                </Td>
                <Td align="right"><StatusPill status={c.status} /></Td>
                <Td mono className="text-muted text-[11px]">{c.note ?? '—'}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent events feed */}
      <div className="card">
        <p className="label mb-3">Recent tracking events</p>
        <ul>
          {events.map((e, i) => (
            <li
              key={i}
              className={`grid grid-cols-[60px_60px_120px_140px_1fr] items-baseline gap-3 py-2 ${
                i < events.length - 1 ? 'border-b border-dotted border-rule' : ''
              }`}
            >
              <span className="font-mono text-[11px] text-muted">{e.time}</span>
              <span className="font-mono text-[11.5px] text-accent tracking-wide">{e.ti}</span>
              <span className="font-mono text-[11px] text-muted">{e.container}</span>
              <span className="font-mono text-[11px] text-ink">{e.carrier}</span>
              <span className="font-serif text-[13px] text-ink">{e.event}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
