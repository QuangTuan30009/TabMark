import { useState, useEffect } from 'react'
import {
  Sparkles,
  Globe,
  Link2,
  Tag,
  FileText,
  Layers,
  Clock,
  Check,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react'
import { extractLinkMetadataWithAI } from '@/lib/geminiApi'
import { isSupabaseConfigured } from '@/lib/bookmarksApi'
import { getAiQuota, consumeAiQuota, showQuotaExceededAlert } from '@/lib/quotaManager'

const QUICK_TAGS = ['dev', 'design', 'ai', 'tools', 'docs', 'learning', 'reading', 'work', 'tutorial']

export function LinkModal({
  mode = 'add',
  initialValues,
  collections = [],
  activeCollectionId,
  user,
  onUpgrade,
  onClose,
  onSave,
}) {
  const [url, setUrl] = useState(initialValues?.url || '')
  const [title, setTitle] = useState(initialValues?.title || '')
  const [icon, setIcon] = useState(initialValues?.icon || '')
  const [tags, setTags] = useState(
    Array.isArray(initialValues?.tags)
      ? initialValues.tags.join(', ')
      : initialValues?.tags || ''
  )
  const [note, setNote] = useState(initialValues?.note || '')
  const [status, setStatus] = useState(initialValues?.status || 'todo')
  const [time, setTime] = useState(initialValues?.time || '5 min')
  const [targetCollectionId, setTargetCollectionId] = useState(
    initialValues?.collectionId || activeCollectionId || collections[0]?.id || 'default'
  )

  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiSuccessMessage, setAiSuccessMessage] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')
  const [faviconError, setFaviconError] = useState(false)
  const [isIconManuallyEdited, setIsIconManuallyEdited] = useState(Boolean(initialValues?.icon))

  // Auto-resolve favicon when URL changes
  useEffect(() => {
    if (!url.trim()) {
      setFaviconUrl('')
      return
    }

    try {
      let cleanUrl = url.trim()
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl
      }
      const parsed = new URL(cleanUrl)
      const domain = parsed.hostname
      if (domain && domain.includes('.')) {
        setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`)
        setFaviconError(false)
        // Chỉ tự gợi ý icon viết tắt nếu người dùng CHƯA tự chỉnh sửa
        if (!isIconManuallyEdited && !icon) {
          const name = domain.replace(/^www\./i, '').split('.')[0]
          setIcon(name.slice(0, 2).toUpperCase())
        }
      }
    } catch {
      // Invalid URL format while typing
    }
  }, [url])

  // Handle AI Auto-Fill
  async function handleAiAutoFill() {
    if (!url.trim()) {
      alert('Vui lòng nhập đường dẫn URL trước khi dùng AI!')
      return
    }

    // 1. Kiểm tra và trừ Quota
    const quotaResult = consumeAiQuota(user)
    if (!quotaResult.success) {
      showQuotaExceededAlert(onUpgrade, getAiQuota(user))
      return
    }

    setIsAiLoading(true)
    setAiSuccessMessage('')

    try {
      const metadata = await extractLinkMetadataWithAI({ url, title })
      if (metadata) {
        if (metadata.title) setTitle(metadata.title)
        if (metadata.tags && metadata.tags.length > 0) {
          setTags(metadata.tags.join(', '))
        }
        if (metadata.note) setNote(metadata.note)
        if (metadata.icon) setIcon(metadata.icon)
        if (metadata.time) setTime(metadata.time)

        const quotaInfo = getAiQuota(user)
        const remainingNote = quotaInfo.isUnlimited ? '' : ` (Còn ${quotaInfo.remaining} lượt hôm nay)`
        setAiSuccessMessage(`✦ AI đã tự động điền thông tin!${remainingNote}`)
        setTimeout(() => setAiSuccessMessage(''), 4000)
      }
    } catch (err) {
      console.error('AI Auto-Fill error:', err)
    } finally {
      setIsAiLoading(false)
    }
  }

  // Toggle quick tag chip
  function toggleQuickTag(tagToAdd) {
    const currentTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (currentTags.includes(tagToAdd)) {
      setTags(currentTags.filter((t) => t !== tagToAdd).join(', '))
    } else {
      setTags([...currentTags, tagToAdd].join(', '))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const cleanTitle = title.trim() || (url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'Untitled')
    const cleanUrl = url.trim()
    if (!cleanUrl) return

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean)

    onSave({
      title: cleanTitle,
      url: cleanUrl,
      icon: icon.trim() || cleanTitle.slice(0, 2).toUpperCase(),
      tags: parsedTags,
      note: note.trim(),
      status,
      time,
      collectionId: targetCollectionId,
    })
  }

  const parsedTagList = tags
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#0d121f]/95 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] text-white"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400" />

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {mode === 'edit' ? 'Chỉnh sửa Bookmark' : 'Thêm Bookmark Mới'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isSupabaseConfigured
                  ? '☁️ Đồng bộ Supabase Cloud & Local'
                  : '💾 Đang lưu trữ cục bộ LocalStorage'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* 1. URL Input + AI Auto-Fill Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Đường dẫn URL</span>
                <span className="text-rose-400">*</span>
              </label>

              {/* AI Auto-Fill Action */}
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiLoading || !url.trim()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isAiLoading
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30 animate-pulse'
                    : url.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:scale-[1.02]'
                    : 'bg-white/[0.05] text-slate-500 border border-white/[0.05] cursor-not-allowed'
                }`}
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini AI đang nghĩ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>✦ AI Auto-Fill</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative group">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/tai-lieu-hay"
                className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.1] focus:border-cyan-500/60 focus:bg-white/[0.07] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                autoFocus
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                {faviconUrl && !faviconError ? (
                  <img
                    src={faviconUrl}
                    alt="Favicon"
                    className="w-4 h-4 rounded-sm object-contain"
                    onError={() => setFaviconError(true)}
                  />
                ) : (
                  <Link2 className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
                )}
              </div>
              {url && (
                <a
                  href={url.startsWith('http') ? url : `https://${url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Mở tab thử nghiệm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {aiSuccessMessage && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium animate-fade-in">
                <Check className="w-3.5 h-3.5" /> {aiSuccessMessage}
              </p>
            )}
          </div>

          {/* 2. Target Collection & Title */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Tiêu đề</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Hướng dẫn React 19 mới nhất"
                className="w-full px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.1] focus:border-blue-500/60 focus:bg-white/[0.07] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>

            {/* Target Collection Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Lưu vào nhóm (Collection)</span>
              </label>
              <select
                value={targetCollectionId}
                onChange={(e) => setTargetCollectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#141b2d] border border-white/[0.1] focus:border-purple-500/60 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all cursor-pointer"
              >
                {collections.length === 0 ? (
                  <option value="default">Default</option>
                ) : (
                  collections.map((col) => (
                    <option key={col.id} value={col.id} className="bg-[#101420] text-white">
                      📁 {col.name} ({col.links?.length || 0} links)
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* 3. Icon, Reading Time & Status */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Icon / Ký tự viết tắt</label>
                {url && (
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const cleanUrl = url.startsWith('http') ? url : `https://${url}`
                        const domain = new URL(cleanUrl).hostname.replace(/^www\./i, '').split('.')[0]
                        setIcon(domain.slice(0, 2).toUpperCase())
                        setIsIconManuallyEdited(false)
                      } catch {}
                    }}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                    title="Lấy lại chữ viết tắt tự động từ tên miền"
                  >
                    Tự động
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={10}
                  value={icon}
                  onChange={(e) => {
                    setIsIconManuallyEdited(true)
                    setIcon(e.target.value)
                  }}
                  placeholder="VD: AI, 🚀"
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none font-bold text-center"
                />
                <div 
                  className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600/40 via-purple-600/30 to-cyan-500/30 border border-cyan-400/40 flex items-center justify-center font-black text-xs text-cyan-200 shadow-sm select-none"
                  title="Xem trước icon trên thẻ Kanban"
                >
                  {icon || (title ? title.slice(0, 2).toUpperCase() : '🔗')}
                </div>
              </div>
              {/* Gợi ý icon emoji nhanh */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                {['🚀', '💡', '💻', '📚', '🛠️', '🎨', '⚡', '🔍', '📝', '🎯', '🌐', '🔥'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setIcon(emoji)
                      setIsIconManuallyEdited(true)
                    }}
                    className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      icon === emoji ? 'bg-cyan-500/30 border border-cyan-400' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Thời gian đọc</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="5 min"
                className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] focus:border-amber-500/60 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Trạng thái (Kanban)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#141b2d] border border-white/[0.1] focus:border-blue-500/60 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="todo" className="bg-[#101420]">To Do (Cần xem)</option>
                <option value="in_progress" className="bg-[#101420]">In Progress (Đang đọc)</option>
                <option value="done" className="bg-[#101420]">Done (Đã xong)</option>
              </select>
            </div>
          </div>

          {/* 4. Tags + Quick Tag Picks */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tags (Cách nhau bằng dấu phẩy)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {parsedTagList.length} tags
              </span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, frontend, docs, tutorial"
              className="w-full px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.1] focus:border-emerald-500/60 focus:bg-white/[0.07] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />

            {/* Quick Pick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 mr-1">Gợi ý nhanh:</span>
              {QUICK_TAGS.map((qTag) => {
                const isSelected = parsedTagList.includes(qTag)
                return (
                  <button
                    key={qTag}
                    type="button"
                    onClick={() => toggleQuickTag(qTag)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-0.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                        : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}#{qTag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5. AI Note / Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Ghi chú / Tóm tắt AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {note.length}/150 ký tự
              </span>
            </label>
            <textarea
              rows={2}
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tóm tắt ngắn gọn hoặc ghi chú lý do lưu link này..."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.1] focus:border-purple-500/60 focus:bg-white/[0.07] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
            />
          </div>

          {/* 6. Live Card Preview */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Xem trước thẻ Kanban
              </span>
              <span className="text-[10px] text-slate-500">Live Preview</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111625]/80 border border-white/[0.08] shadow-lg flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {/* Icon box */}
                <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-xs text-cyan-300 shadow-sm">
                  {faviconUrl && !faviconError ? (
                    <img
                      src={faviconUrl}
                      alt="icon"
                      className="w-4 h-4 rounded-sm object-contain"
                      onError={() => setFaviconError(true)}
                    />
                  ) : (
                    icon || (title ? title.slice(0, 2).toUpperCase() : '🔗')
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {title.trim() || 'Tiêu đề Bookmark'}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {url.trim() || 'https://example.com'}
                  </p>

                  {note.trim() && (
                    <p className="text-[10px] text-slate-400/90 line-clamp-2 mt-1.5 bg-white/[0.02] p-1.5 rounded-md border border-white/[0.04]">
                      💡 {note}
                    </p>
                  )}

                  {/* Tags Preview */}
                  {parsedTagList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {parsedTagList.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-medium text-cyan-300"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {status.toUpperCase()}
                </span>
                <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> {time || '5 min'}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Check className="w-4 h-4" />
            <span>{mode === 'edit' ? 'Lưu thay đổi' : 'Thêm Bookmark'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

