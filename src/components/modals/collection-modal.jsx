import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { TextField } from '@/components/ui/text-field'
import { FormActions } from '@/components/ui/form-actions'

const emptyCollection = {
  name: '',
  description: '',
}

export function CollectionModal({ onClose, onSave }) {
  const [form, setForm] = useState(emptyCollection)

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <Modal title="Create collection" subtitle="Tạo một bộ bookmark mới." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="EXE201 Research" autoFocus />
        <TextField label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} placeholder="Link tham khảo cho môn học" />
        <FormActions onClose={onClose} submitLabel="Create collection" />
      </form>
    </Modal>
  )
}
