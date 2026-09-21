import { useState, useMemo } from 'react'
import { 
  X, 
  Copy, 
  Check, 
  Shield, 
  Globe, 
  Lock, 
  Layers, 
  Folder, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Download, 
  Search,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react'

// Helper to encode shared bundle into compact base64 URL safe string
function encodeBundle(data) {
  try {
    const json = JSON.stringify(data)
    const bytes = new TextEncoder().encode(json)
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
    return btoa(binString)
  } catch (err) {
    console.error('Lỗi mã hóa bundle:', err)
    return ''
  }
}

export function ShareModal({ 
  onClose, 
  collection, 
  collections = [], 
  initialSelectedCard = null,
  onUpdateShareMode,
  user 
}) {
  // Determine initial scope
  const initialScope = initialSelectedCard ? 'custom' : 'collection'
  const [shareScope, setShareScope] = useState(initialScope) // 'all' | 'collection' | 'custom'

  // Selected collection for 'collection' scope
  const [selectedColId, setSelectedColId] = useState(() => collection?.id || collections[0]?.id || '')

  // Selected bookmark IDs for 'custom' scope
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState(() => {
    if (initialSelectedCard?.id) {
      return [initialSelectedCard.id]
    }
    // Default select links in current collection
    const currentLinks = collection?.links || collections[0]?.links || []
    return currentLinks.map(l => l.id)
  })

  // Search filter for custom bookmark list
  const [filterQuery, setFilterQuery] = useState('')

  // Permission mode
  const currentSelectedCol = collections.find(c => c.id === selectedColId) || collection || collections[0]
  const [shareMode, setShareMode] = useState(currentSelectedCol?.shareMode || 'view')
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Calculate total links across all collections
  const totalAllLinksCount = useMemo(() => {
    return collections.reduce((sum, c) => sum + (c.links?.length || 0), 0)
  }, [collections])

  // All bookmarks flat list
  const allBookmarksList = useMemo(() => {
    const list = []
    collections.forEach(col => {
      (col.links || []).forEach(link => {
        list.push({ ...link, collectionName: col.name, collectionId: col.id })
      })
    })
    return list
  }, [collections])

  // Filtered bookmarks for custom selection tab
  const filteredBookmarks = useMemo(() => {
    if (!filterQuery.trim()) return allBookmarksList
    const q = filterQuery.toLowerCase()
    return allBookmarksList.filter(b => 
      b.title?.toLowerCase().includes(q) ||
      b.url?.toLowerCase().includes(q) ||
      b.tags?.some(t => t.toLowerCase().includes(q))
    )
  }, [allBookmarksList, filterQuery])

  // Toggle single bookmark
  const toggleBookmark = (id) => {
    setSelectedBookmarkIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Select/Deselect All
  const handleSelectAll = () => {
    if (selectedBookmarkIds.length === allBookmarksList.length) {
      setSelectedBookmarkIds([])
    } else {
      setSelectedBookmarkIds(allBookmarksList.map(b => b.id))
    }
  }

  // Generate Share URL based on active scope
  const shareUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    
    // 1. Share ALL collections
    if (shareScope === 'all') {
      const payload = {
        type: 'all',
        title: 'Toàn bộ Bookmarks TabMark',
        author: user?.full_name || user?.email || 'Người dùng TabMark',
        createdAt: new Date().toISOString(),
        collections: collections.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          links: (c.links || []).map(l => ({
            id: l.id,
            title: l.title,
            url: l.url,
            icon: l.icon || '',
            tags: l.tags || [],
            note: l.note || ''
          }))
        }))
      }
      return `${origin}/#shared/bundle:${encodeBundle(payload)}`
    }

    // 2. Share CUSTOM selected bookmarks
    if (shareScope === 'custom') {
      const chosenCols = collections.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        links: (c.links || []).filter(l => selectedBookmarkIds.includes(l.id)).map(l => ({
          id: l.id,
          title: l.title,
          url: l.url,
          icon: l.icon || '',
          tags: l.tags || [],
          note: l.note || ''
        }))
      })).filter(c => c.links.length > 0)

      const payload = {
        type: 'custom',
        title: `Bộ sưu tập chọn lọc (${selectedBookmarkIds.length} bookmarks)`,
        author: user?.full_name || user?.email || 'Người dùng TabMark',
        createdAt: new Date().toISOString(),
        collections: chosenCols.length > 0 ? chosenCols : [{
          id: 'custom-pack',
          name: 'Bookmarks đã chọn',
          description: 'Danh sách các bookmark được chia sẻ riêng',
          links: []
        }]
      }
      return `${origin}/#shared/bundle:${encodeBundle(payload)}`
    }

    // 3. Share SINGLE collection
    const targetCol = collections.find(c => c.id === selectedColId) || collection
    if (!targetCol) return `${origin}/#shared/empty`

    // If UUID (from Supabase cloud)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCol.id)
    if (isUUID) {
      return `${origin}/#shared/${targetCol.id}`
    }

    // Fallback: offline bundle for single collection
    const payload = {
      type: 'collection',
      title: targetCol.name,
      author: user?.full_name || user?.email || 'Người dùng TabMark',
      createdAt: new Date().toISOString(),
      collections: [{
        id: targetCol.id,
        name: targetCol.name,
        description: targetCol.description || '',
        links: (targetCol.links || []).map(l => ({
          id: l.id,
          title: l.title,
          url: l.url,
          icon: l.icon || '',
          tags: l.tags || [],
          note: l.note || ''
        }))
      }]
    }
    return `${origin}/#shared/bundle:${encodeBundle(payload)}`
  }, [shareScope, selectedColId, selectedBookmarkIds, collections, collection, user])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link: ', err)
    }
  }

  const handleDownloadJson = () => {
    try {
      let dataToExport = []
      if (shareScope === 'all') {
        dataToExport = collections
      } else if (shareScope === 'custom') {
        dataToExport = collections.map(c => ({
          ...c,
          links: (c.links || []).filter(l => selectedBookmarkIds.includes(l.id))
        })).filter(c => c.links.length > 0)
      } else {
        const targetCol = collections.find(c => c.id === selectedColId) || collection
        dataToExport = targetCol ? [targetCol] : []
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `tabmark_share_${shareScope}_${new Date().toISOString().slice(0, 10)}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (shareScope === 'collection' && currentSelectedCol?.id && onUpdateShareMode) {
        await onUpdateShareMode(currentSelectedCol.id, shareMode)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0c101a] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh] animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2Icon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Chia sẻ Bookmark
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chia sẻ toàn bộ, theo nhóm hoặc chọn lọc các bookmark mong muốn
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. CHOOSE SHARE SCOPE (3 TABS) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Phạm vi chia sẻ
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
              {/* Option 1: Share All */}
              <button
                type="button"
                onClick={() => setShareScope('all')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  shareScope === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Toàn bộ ({totalAllLinksCount})</span>
              </button>

              {/* Option 2: Share By Collection */}
              <button
                type="button"
                onClick={() => setShareScope('collection')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  shareScope === 'collection'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Theo Nhóm</span>
              </button>

              {/* Option 3: Custom Selection */}
              <button
                type="button"
                onClick={() => setShareScope('custom')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  shareScope === 'custom'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Chọn lọc ({selectedBookmarkIds.length})</span>
              </button>
            </div>
          </div>

          {/* 2. DYNAMIC SCOPE DETAILS */}
          {/* Scope = COLLECTION: Pick which collection to share */}
          {shareScope === 'collection' && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 animate-fade-in-up">
              <label className="block text-xs font-semibold text-slate-300">
                Chọn bộ sưu tập muốn chia sẻ:
              </label>
              <select
                value={selectedColId}
                onChange={(e) => setSelectedColId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0e1320] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
              >
                {collections.map(col => (
                  <option key={col.id} value={col.id} className="bg-[#0e1320] text-white">
                    {col.name} ({col.links?.length || 0} links)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Bạn có thể chọn bất kỳ nhóm nào ở đây mà không cần phải chuyển tab trước.
              </p>
            </div>
          )}

          {/* Scope = CUSTOM: Interactive Bookmark Checkboxes */}
          {shareScope === 'custom' && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Tìm bookmark để chọn..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {selectedBookmarkIds.length === allBookmarksList.length ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                </button>
              </div>

              {/* Scrollable list of bookmarks with checkboxes */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar border border-white/5 rounded-xl p-2 bg-white/[0.01]">
                {filteredBookmarks.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500">Không tìm thấy bookmark phù hợp</p>
                ) : (
                  filteredBookmarks.map(b => {
                    const isChecked = selectedBookmarkIds.includes(b.id)
                    return (
                      <div
                        key={b.id}
                        onClick={() => toggleBookmark(b.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-blue-600/10 border-blue-500/30 text-white' 
                            : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                          <div className="text-blue-400 shrink-0">
                            {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate text-slate-200">
                              {b.title || b.url}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {b.collectionName} • {b.url}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Đã chọn <strong>{selectedBookmarkIds.length}</strong> / {allBookmarksList.length} bookmarks để tạo link chia sẻ.
              </p>
            </div>
          )}

          {/* 3. ACCESS RIGHTS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quyền truy cập</label>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${shareMode === 'view' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                <input type="radio" name="shareMode" value="view" checked={shareMode === 'view'} onChange={() => setShareMode('view')} className="mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Chỉ xem (View Only)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Bất kỳ ai có link đều có thể xem và mở các bookmark.</p>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${shareMode === 'private' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                <input type="radio" name="shareMode" value="private" checked={shareMode === 'private'} onChange={() => setShareMode('private')} className="mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-white">Riêng tư (Tắt share)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Chỉ riêng bạn mới có quyền truy cập nhóm này.</p>
                </div>
              </label>
            </div>
          </div>

          {/* 4. SHARE LINK INPUT & COPY */}
          {shareMode !== 'private' && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Link chia sẻ trực tiếp
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải file JSON</span>
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Xem thử link</span>
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] flex items-center justify-between bg-black/20">
          <p className="text-[11px] text-slate-500 truncate mr-2">
            💡 Người nhận có thể xem trực quan trên giao diện Kanban TabMark.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button 
              type="button"
              onClick={handleSave} 
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Xong'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Share2Icon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
