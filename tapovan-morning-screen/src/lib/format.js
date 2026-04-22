export const inrShort = (n) => {
  if (n == null || isNaN(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`
  return `₹${n}`
}

export const signedInrShort = (n) => {
  if (n == null || isNaN(n)) return '—'
  const sign = n >= 0 ? '+' : '−'
  return sign + inrShort(Math.abs(n)).replace('₹', '₹')
}

export const formatHeaderDate = (d = new Date()) => {
  const day = d.toLocaleDateString('en-IN', { weekday: 'long' })
  const date = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
  const time = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  })
  return `${day} · ${date} · ${time} IST`
}
