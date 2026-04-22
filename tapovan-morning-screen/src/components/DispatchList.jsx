export default function DispatchList({ dispatches }) {
  return (
    <div className="card h-full">
      <p className="label mb-3">Today's dispatches</p>
      <ul>
        {dispatches.map((d, i) => (
          <li
            key={d.ti}
            className={`grid grid-cols-[auto_1fr_auto] items-baseline gap-3 py-2 ${
              i < dispatches.length - 1 ? 'border-b border-dotted border-rule' : ''
            }`}
          >
            <span className="font-mono text-[12px] text-accent tracking-wide">
              {d.ti}
            </span>
            <span className="font-mono text-[12px] text-ink">
              {d.buyer} <span className="text-muted">·</span> {d.ref}{' '}
              <span className="text-muted">·</span> {d.origin}{' '}
              <span className="text-muted">→</span> {d.dest}
            </span>
            <span className="font-mono text-[11.5px] text-muted">{d.line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
