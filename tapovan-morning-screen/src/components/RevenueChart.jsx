import { useState, useEffect, useRef } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const RANGES = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' }
]

function RangeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = RANGES.find((r) => r.value === value)?.label ?? ''

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-mono text-[10.5px] tracking-widest2 uppercase text-muted hover:text-ink transition-colors inline-flex items-center gap-1.5"
      >
        {current}
        <svg
          width="7"
          height="7"
          viewBox="0 0 8 8"
          fill="currentColor"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L0 2h8z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-paper border border-rule shadow-sm z-20 min-w-[120px]">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                onChange(r.value)
                setOpen(false)
              }}
              className={`block w-full text-right px-3 py-1.5 font-mono text-[10.5px] tracking-widest2 uppercase transition-colors hover:bg-rule/40 ${
                r.value === value ? 'text-ink bg-rule/25' : 'text-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RevenueChart({ data }) {
  const [rangeDays, setRangeDays] = useState(14)
  const filtered = data.slice(-rangeDays)

  const firstLabel = filtered[0]?.date ?? ''
  const midLabel = filtered[Math.floor(filtered.length / 2)]?.date ?? ''
  const lastLabel = filtered[filtered.length - 1]?.date ?? ''

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="label">Revenue</p>
        <RangeDropdown value={rangeDays} onChange={setRangeDays} />
      </div>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c2611a" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#c2611a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#dcd6c5" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['dataMin - 4', 'dataMax + 4']} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#c2611a"
              strokeWidth={1.6}
              fill="url(#fillRev)"
              dot={false}
              activeDot={{ r: 3, fill: '#c2611a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between font-mono text-[10.5px] text-muted pt-2">
        <span>{firstLabel}</span>
        <span>{midLabel}</span>
        <span>{lastLabel}</span>
      </div>
    </div>
  )
}
