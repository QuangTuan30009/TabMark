import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { TextField } from '@/components/ui/text-field'
import { FormActions } from '@/components/ui/form-actions'
import { isSupabaseConfigured } from '@/src/lib/bookmarksApi'

const emptyLink = {
  title: '',
  url: '',
  icon: '',
  tags: '',
  note: '',
  status: 'todo',
  time: '5 min',
}

export function LinkModal({ mode, initialValues, onClose, onSave }) {
  const [form, setForm] = useState(initialValues ?? emptyLink)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const title = form.title.trim()
    const url = form.url.trim()
    if (!title || !url) return

    onSave({
      title,
      url,
      icon: form.icon.trim() || title.slice(0, 2).toUpperCase(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      note: form.note.trim(),
    })
  }

  return (
    <Modal title={mode === 'edit' ? 'Edit link' : 'Add link'} subtitle={isSupabaseConfigured ? 'Lưu vào Supabase database.' : 'Chưa cấu hình Supabase, tạm lưu localStorage.'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Title" value={form.title} onChange={(value) => updateField('title', value)} placeholder="React Docs" autoFocus />
        <TextField label="URL" value={form.url} onChange={(value) => updateField('url', value)} placeholder="https://react.dev" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Icon" value={form.icon} onChange={(value) => updateField('icon', value)} placeholder="RE" />
          <TextField label="Tags" value={form.tags} onChange={(value) => updateField('tags', value)} placeholder="react, docs" />
        </div>
        <TextField label="Note" value={form.note} onChange={(value) => updateField('note', value)} placeholder="Ghi chú ngắn về link này" />
        <FormActions onClose={onClose} submitLabel={mode === 'edit' ? 'Save changes' : 'Add link'} />
      </form>
    </Modal>
  )
}
