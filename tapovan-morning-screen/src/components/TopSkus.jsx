export default function TopSkus({ skus }) {
  return (
    <div className="card h-full">
      <p className="label mb-3">Top 5 SKUs · Margin this wk</p>
      <ul>
        {skus.map((s, i) => (
          <li
            key={s.sku}
            className={`flex justify-between items-baseline py-2 ${
              i < skus.length - 1 ? 'border-b border-dotted border-rule' : ''
            }`}
          >
            <span className="font-serif text-[14px] text-ink">{s.sku}</span>
            <span className="font-mono text-[13px] text-gain tabular-nums">
              {s.margin_pct.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
