import { formatHeaderDate } from '../lib/format'

export default function Header() {
  return (
    <header className="flex items-start justify-between pb-4">
      <div>
        <h1 className="font-serif text-[15px] font-medium tracking-tight text-ink">
          Vikas sir · 8am screen
        </h1>
        <p className="font-mono text-[11px] text-muted mt-0.5">
          {formatHeaderDate()}
        </p>
      </div>
      <p className="font-mono text-[10.5px] tracking-widest2 uppercase text-muted pt-1">
        One Screen <span className="text-rule mx-1">·</span> One Chai
      </p>
    </header>
  )
}
