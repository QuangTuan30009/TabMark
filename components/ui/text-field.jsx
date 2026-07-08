export function TextField({ label, value, onChange, placeholder, autoFocus = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </label>
  )
}
