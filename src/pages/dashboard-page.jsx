import { useMemo, useState, useRef, useEffect } from 'react'
import { X, Sparkles, Send } from 'lucide-react'
import Swal from 'sweetalert2'
import 'animate.css'
import Sidebar from '@/components/dashboard/sidebar'
import DashboardHeader from '@/components/dashboard/header'
import KanbanBoard from '@/components/dashboard/kanban-board'
import { CollectionModal } from '@/components/modals/collection-modal'
import { LinkModal } from '@/components/modals/link-modal'
import { ShareModal } from '@/components/modals/share-modal'
import { useCollections } from '@/src/hooks/use-collections'
import { isSupabaseConfigured } from '@/src/lib/bookmarksApi'
import { chatWithGemini, isGeminiConfigured, generateLinkSummary } from '@/src/lib/geminiApi'

const animatedSwal = Swal.mixin({
  background: '#10141f',
  color: '#fff',
  customClass: {
    popup: 'border border-white/10 rounded-2xl',
    confirmButton: 'px-5 py-2 rounded-xl font-semibold',
    cancelButton: 'px-5 py-2 rounded-xl font-semibold'
  },
  showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
})

export function DashboardPage({ onBackHome, user, onLogout, sharedCollectionId }) {
  const {
    collections,
    activeCollection,
    activeCollectionId,
    setActiveCollectionId,
    syncStatus,
    toast,
    setToast,
    recentlyDeletedCollection,
    setRecentlyDeletedCollection,
    handleCreateCollection,
    handleEditGroup,
    handleDeleteGroup,
    handleUndoDelete,
    handleDuplicateGroup,
    handleSaveLink,
    handleDeleteLink,
    handleDuplicateLink,
    handleDrop,
    handleReorderCollections,
    handleExport,
    handleImport,
    handleSync,
    handleUpdateShareMode
  } = useCollections({ animatedSwal, user, sharedCollectionId })

  const [highlightedColumnId, setHighlightedColumnId] = useState(null)
  const [query, setQuery] = useState('')
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('')
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [linkEditor, setLinkEditor] = useState(null)

  // AI Chat states
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: 'Xin chào! Tôi là Tabmark AI. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể yêu cầu tôi tóm tắt các bookmark trong nhóm này hoặc tìm kiếm bookmark bất kỳ!' }
  ])
  const [aiChatInput, setAiChatInput] = useState('')
  const [isAiResponding, setIsAiResponding] = useState(false)
  const chatEndRef = useRef(null)

  // Auto dismiss Toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
      setRecentlyDeletedCollection(null)
    }, 8000)
    return () => clearTimeout(timer)
  }, [toast])

  // Listen for Ctrl+Z / Cmd+Z
  useEffect(() => {
    function handleKeyDown(e) {
      const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'z' && !isInputActive) {
        e.preventDefault()
        handleUndoDelete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recentlyDeletedCollection, handleUndoDelete])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [aiChatMessages, aiChatOpen])

  // Filter links in each collection column dynamically based on search keyword
  const filteredCollections = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return collections

    return collections.map((col) => {
      const filtered = (col.links || []).filter((link) => {
        const searchable = `${link.title} ${link.url} ${(link.tags || []).join(' ')} ${link.note}`.toLowerCase()
        return searchable.includes(keyword)
      })
      return { ...col, links: filtered }
    })
  }, [collections, query])

  // Count total links for description
  const totalFilteredLinksCount = useMemo(() => {
    return filteredCollections.reduce((acc, col) => acc + (col.links?.length || 0), 0)
  }, [filteredCollections])

  const handleSelectCollection = (id) => {
    setActiveCollectionId(id)
    setHighlightedColumnId(id)
    // Clear highlight after 2.5 seconds
    setTimeout(() => {
      setHighlightedColumnId(prev => prev === id ? null : prev)
    }, 2500)
  }

  function handleOpenAddLinkModal(colId = null) {
    setLinkEditor({
      mode: 'add',
      link: null,
      collectionId: colId || activeCollectionId
    })
  }

  // AI Chat Submission
  async function handleSendAiMessage(e) {
    e.preventDefault()
    if (!aiChatInput.trim()) return

    const userQuery = aiChatInput.trim()
    const newMessages = [...aiChatMessages, { sender: 'user', text: userQuery }]
    setAiChatMessages(newMessages)
    setAiChatInput('')
    setIsAiResponding(true)

    if (!isGeminiConfigured) {
      setTimeout(() => {
        let responseText = ''
        const queryLower = userQuery.toLowerCase()

        if (queryLower.includes('tóm tắt') || queryLower.includes('summarize')) {
          const linksCount = activeCollection?.links?.length || 0
          if (linksCount === 0) {
            responseText = `Bộ sưu tập "${activeCollection?.name}" hiện tại chưa có bookmark nào để tóm tắt.`
          } else {
            responseText = `Dưới đây là tóm tắt nhanh các bookmark trong nhóm **${activeCollection.name}**:\n\n`
            activeCollection.links.slice(0, 5).forEach((link, idx) => {
              responseText += `${idx + 1}. **${link.title}** (${link.url})\n   👉 *${link.note || 'Không có mô tả.'}*\n\n`
            })
            if (linksCount > 5) {
              responseText += `*Và ${linksCount - 5} bookmark khác...*`
            }
          }
        } else if (queryLower.includes('tìm') || queryLower.includes('search') || queryLower.includes('find')) {
          const searchTerm = queryLower.replace(/tìm kiếm|tìm|search|find/g, '').trim()
          if (!searchTerm) {
            responseText = 'Bạn muốn tìm kiếm từ khóa nào? Hãy nhập ví dụ: "Tìm React".'
          } else {
            const found = []
            collections.forEach(col => {
              (col.links || []).forEach(link => {
                if (link.title.toLowerCase().includes(searchTerm) || link.url.toLowerCase().includes(searchTerm)) {
                  found.push({ ...link, colName: col.name })
                }
              })
            })
            if (found.length === 0) {
              responseText = `Không tìm thấy bookmark nào liên quan đến từ khóa **"${searchTerm}"**.`
            } else {
              responseText = `Tìm thấy **${found.length}** liên kết liên quan đến **"${searchTerm}"**:\n\n`
              found.forEach((link, idx) => {
                responseText += `${idx + 1}. **${link.title}** (${link.url}) - trong nhóm *${link.colName}*\n`
              })
            }
          }
        } else if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('chào')) {
          responseText = 'Xin chào! Tôi có thể giúp gì cho bạn? Hãy thử gõ: **"Tóm tắt các link"** hoặc **"Tìm React"**.'
        } else {
          responseText = 'Tôi là Tabmark AI (Chế độ giả lập). Tôi có thể:\n- 📝 **Tóm tắt** các bookmark hiện tại (gõ "tóm tắt")\n- 🔍 **Tìm kiếm** link trong hệ thống (gõ "tìm [từ khóa]")\n- 🤖 Giải đáp thắc mắc của bạn về bộ sưu tập link.\n\n*(Lưu ý: Để bật AI thực tế, hãy cấu hình VITE_GEMINI_API_KEY trong file .env)*'
        }

        setAiChatMessages(prev => [...prev, { sender: 'ai', text: responseText }])
        setIsAiResponding(false)
      }, 1000)
      return
    }

    try {
      const response = await chatWithGemini(newMessages, activeCollection?.links || [])
      setAiChatMessages(prev => [...prev, { sender: 'ai', text: response }])
    } catch (error) {
      console.error('Gemini error:', error)
      const errorMsg = `❌ **Đã xảy ra lỗi khi gọi Gemini AI:**\n${error.message || 'Lỗi không xác định.'}`
      setAiChatMessages(prev => [...prev, { sender: 'ai', text: errorMsg }])
    } finally {
      setIsAiResponding(false)
    }
  }

  // AI Note Generator for Kanban Card
  async function handleGenerateSummary(card) {
    if (!isGeminiConfigured) {
      const mockSummaries = [
        "Tài liệu hữu ích phục vụ cho việc học tập và nghiên cứu công nghệ liên quan.",
        "Trang web chính thức cung cấp công cụ, thư viện và hướng dẫn sử dụng chi tiết.",
        "Kho lưu trữ mã nguồn và tài nguyên chia sẻ của dự án.",
        "Bảng tính trực tuyến theo dõi tiến độ công việc và kế hoạch hành động."
      ]
      const summary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)]
      
      const containingCol = collections.find(c => c.links.some(l => l.id === card.id))
      if (containingCol) {
        handleSaveLink(
          { ...card, note: summary },
          'edit',
          card.id,
          containingCol.id
        )
      }
      return
    }

    try {
      const summary = await generateLinkSummary(card.title, card.url, card.tags || [])
      const containingCol = collections.find(c => c.links.some(l => l.id === card.id))
      if (containingCol) {
        await handleSaveLink(
          { ...card, note: summary },
          'edit',
          card.id,
          containingCol.id
        )
      }
    } catch (error) {
      console.error('Failed to generate summary:', error)
      Swal.fire({
        title: 'Lỗi tạo tóm tắt',
        text: error.message || 'Không thể tạo tóm tắt bằng Gemini.',
        icon: 'error',
        background: '#10141f',
        color: '#fff'
      })
      throw error
    }
  }

  function handleDragStart(e, cardId, fromCollectionId) {
    e.dataTransfer.setData('cardId', cardId)
    e.dataTransfer.setData('fromCollectionId', fromCollectionId)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  const isSharedView = !!sharedCollectionId
  const canEditLinks = !isSharedView || activeCollection?.shareMode === 'edit'
  const canEditGroup = !isSharedView

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        collections={collections}
        activeCollectionId={activeCollection?.id}
        onSelectCollection={handleSelectCollection}
        searchQuery={sidebarSearchQuery}
        onSearchChange={setSidebarSearchQuery}
        onAIChatToggle={() => setAiChatOpen(!aiChatOpen)}
        user={user}
        onSettingsClick={() => animatedSwal.fire({
          title: 'Coming Soon',
          text: 'Settings and configuration interface is being updated!',
          icon: 'info'
        })}
        onLogout={onLogout}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Component */}
        <DashboardHeader
          query={query}
          onQueryChange={setQuery}
          onAddGroup={canEditGroup ? () => setCollectionModalOpen(true) : undefined}
          onAddLink={canEditLinks ? () => handleOpenAddLinkModal() : undefined}
          onExport={handleExport}
          onImport={handleImport}
          onSync={handleSync}
          onShare={() => setShareModalOpen(true)}
          syncStatus={syncStatus}
          isCloudEnabled={isSupabaseConfigured}
          isSharedView={isSharedView}
        />

        {/* Kanban Area */}
        <main className="flex-1 flex flex-col overflow-hidden kanban-board-bg">
          {/* Active Group Description Header */}
          <div className="px-6 pt-5 pb-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">{activeCollection?.name ?? 'No group'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{activeCollection?.description || 'Thêm link vào bảng Kanban này.'}</p>
            </div>
            <div className="text-[10px] font-bold text-slate-500 bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full">
              {totalFilteredLinksCount} links
            </div>
          </div>

          {/* Kanban Board Component */}
          <KanbanBoard
            collections={filteredCollections}
            activeCollectionId={activeCollection?.id}
            highlightedColumnId={highlightedColumnId}
            onDragStart={canEditLinks ? handleDragStart : undefined}
            onDragOver={canEditLinks ? handleDragOver : undefined}
            onDrop={canEditLinks ? handleDrop : undefined}
            onEdit={canEditLinks ? (card) => {
              const containingCol = collections.find(c => c.links.some(l => l.id === card.id))
              setLinkEditor({ mode: 'edit', link: card, collectionId: containingCol?.id })
            } : undefined}
            onDelete={canEditLinks ? handleDeleteLink : undefined}
            onDuplicate={canEditLinks ? handleDuplicateLink : undefined}
            onAddLink={canEditLinks ? handleOpenAddLinkModal : undefined}
            onEditGroup={canEditGroup ? handleEditGroup : undefined}
            onDeleteGroup={canEditGroup ? handleDeleteGroup : undefined}
            onDuplicateGroup={canEditGroup ? handleDuplicateGroup : undefined}
            onReorderCollections={canEditGroup ? handleReorderCollections : undefined}
            onGenerateSummary={canEditLinks ? handleGenerateSummary : undefined}
          />
        </main>
      </div>

      {/* Floating Messenger-style AI Chat Bubble */}
      {!aiChatOpen && (
        <button
          onClick={() => setAiChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 z-40 flex items-center justify-center scale-100 hover:scale-105 active:scale-95 cursor-pointer"
          title="Mở AI Assistant"
        >
          <Sparkles className="w-5.5 h-5.5 fill-white/10" />
        </button>
      )}

      {/* Floating Messenger-style AI Chat Widget */}
      {aiChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-[#0c0f16]/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl flex flex-col h-[520px] max-h-[80vh] z-50 animate-fade-in-up">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400/10" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0c0f16]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AI Assistant</h3>
                <p className="text-[10px] text-slate-500">Hỏi đáp về các bookmark của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setAiChatOpen(false)}
              className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiChatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'bg-white/[0.03] border border-white/5 text-slate-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiResponding && (
              <div className="flex justify-start">
                <div className="bg-white/[0.03] border border-white/5 text-slate-300 rounded-2xl rounded-bl-none p-3.5 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendAiMessage} className="p-4 border-t border-white/5 bg-[#090b11]/50 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                placeholder="Hỏi AI về bookmark..."
                className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                disabled={isAiResponding}
              />
              <button
                type="submit"
                disabled={!aiChatInput.trim() || isAiResponding}
                className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {collectionModalOpen && (
        <CollectionModal 
          onClose={() => setCollectionModalOpen(false)} 
          onSave={(col) => handleCreateCollection(col, () => setCollectionModalOpen(false))} 
        />
      )}
      {shareModalOpen && activeCollection && (
        <ShareModal 
          collection={activeCollection}
          onClose={() => setShareModalOpen(false)}
          onUpdateShareMode={handleUpdateShareMode}
        />
      )}
      {linkEditor && (
        <LinkModal
          mode={linkEditor.mode}
          initialValues={linkEditor.link ? { ...linkEditor.link, tags: linkEditor.link.tags.join(', ') } : undefined}
          onClose={() => setLinkEditor(null)}
          onSave={(link) => handleSaveLink(link, linkEditor.mode, linkEditor.link?.id, linkEditor.collectionId, () => setLinkEditor(null))}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between gap-4 px-4 py-3 bg-[#10141f]/95 border border-blue-500/30 rounded-xl shadow-2xl glass-card animate-fade-in-up max-w-sm w-full mx-4">
          <span className="text-xs text-white font-medium">{toast.message}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUndoDelete}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              Undo
            </button>
            <button
              onClick={() => { setToast(null); setRecentlyDeletedCollection(null); }}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
