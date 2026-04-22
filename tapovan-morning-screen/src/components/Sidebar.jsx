import { NavLink, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Morning screen', match: (p) => !p.startsWith('/carrier-tracker') },
  { to: '/carrier-tracker', label: 'Carrier tracker', match: (p) => p.startsWith('/carrier-tracker') }
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-[200px] shrink-0 border-r hairline bg-paper px-6 py-7 sticky top-0 h-screen flex flex-col">
      <div>
        <p className="font-serif text-[18px] font-medium leading-none text-ink tracking-tight">
          Tapovan
        </p>
        <p className="font-mono text-[10px] tracking-widest2 uppercase text-muted mt-1.5">
          Impex · Briefing
        </p>
      </div>

      <nav className="mt-9 flex flex-col">
        {NAV.map((item) => {
          const active = item.match(pathname)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`font-mono text-[11px] tracking-wider uppercase py-2 px-2 -mx-2 transition-colors border-l-2 ${
                active
                  ? 'text-ink border-accent bg-rule/15'
                  : 'text-muted border-transparent hover:text-ink hover:border-rule'
              }`}
            >
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t hairline">
        <p className="font-mono text-[10px] tracking-widest2 uppercase text-muted">
          n8n sync
        </p>
        <p className="font-mono text-[11px] text-ink mt-1.5">08:15 IST</p>
        <p className="font-mono text-[10.5px] text-gain mt-1">
          ● 4 of 5 carriers
        </p>
      </div>
    </aside>
  )
}
