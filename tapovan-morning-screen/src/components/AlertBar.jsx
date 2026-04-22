export default function AlertBar({ alerts }) {
  if (!alerts?.length) return null
  return (
    <div className="bg-alertBg border-l-[3px] border-alertText px-4 py-2.5 rounded-sm">
      <p className="text-[13px] text-alertText">
        <span className="font-medium">
          {alerts.length} alert{alerts.length > 1 ? 's' : ''} need your call today:
        </span>{' '}
        {alerts.map((a, i) => (
          <span key={a.id ?? i}>
            {a.text}
            {i < alerts.length - 1 && (
              <span className="mx-1.5 text-alertText/50">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  )
}
