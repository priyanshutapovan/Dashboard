import { inrShort } from '../lib/format'

export default function D2CPanel({ brands }) {
  return (
    <div className="card h-full">
      <p className="label mb-3">D2C yesterday</p>
      <ul>
        {brands.map((b, i) => (
          <li
            key={b.brand}
            className={`flex justify-between items-start py-2.5 ${
              i < brands.length - 1 ? 'border-b border-dotted border-rule' : ''
            }`}
          >
            <div>
              <p className="font-serif text-[15px] text-ink leading-tight">
                {b.brand}
              </p>
              <p className="font-mono text-[11px] text-muted mt-0.5">
                {b.orders} orders{' '}
                <span className="text-rule">·</span>{' '}
                <span className={b.note_kind === 'warn' ? 'text-accent' : 'text-gain'}>
                  {b.note}
                </span>
              </p>
            </div>
            <span className="font-serif text-[16px] text-ink tabular-nums">
              {inrShort(b.revenue)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
