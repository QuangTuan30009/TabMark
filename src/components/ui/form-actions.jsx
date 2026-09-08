export function FormActions({ onClose, submitLabel }) {
  return (
    <div className="flex justify-end gap-3 border-t border-border pt-4">
      <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
        Cancel
      </button>
      <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        {submitLabel}
      </button>
    </div>
  )
}
