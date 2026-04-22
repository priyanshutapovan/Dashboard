import { Link } from 'react-router-dom'
import { inrShort, signedInrShort } from '../lib/format'

function KpiCard({ label, value, footer, to }) {
  return (
    <Link
      to={to}
      className="card block hover:bg-rule/15 transition-colors group"
    >
      <p className="label mb-2.5">{label}</p>
      <p className="font-serif text-[30px] leading-none font-medium text-ink">
        {value}
      </p>
      <p className="font-mono text-[11px] text-link mt-2.5 group-hover:underline">
        {footer}
      </p>
    </Link>
  )
}

export default function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        to="/cash"
        label="Cash across banks"
        value={inrShort(kpis.cash_across_banks)}
        footer={
          <>
            {signedInrShort(kpis.cash_delta)} <span className="text-muted mx-0.5">·</span>{' '}
            {kpis.cash_delta_label} →
          </>
        }
      />
      <KpiCard
        to="/receivables"
        label="Receivables > 90d"
        value={inrShort(kpis.receivables_over_90d)}
        footer={
          <>
            {kpis.receivables_buyer_count} buyers{' '}
            <span className="text-muted mx-0.5">·</span> act today →
          </>
        }
      />
      <KpiCard
        to="/orders"
        label="Order book · unshipped"
        value={inrShort(kpis.order_book_unshipped)}
        footer={
          <>
            {kpis.order_book_orders} orders{' '}
            <span className="text-muted mx-0.5">·</span> {kpis.order_book_lots} lots →
          </>
        }
      />
      <KpiCard
        to="/dispatches"
        label="Today's dispatches"
        value={kpis.dispatches_today}
        footer={<>{kpis.dispatches_today_ids?.join(' · ')} →</>}
      />
    </div>
  )
}
