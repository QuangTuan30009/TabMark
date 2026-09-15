import { useMemo, useState, useRef, useEffect } from 'react'
import { X, Sparkles, Send } from 'lucide-react'
import Swal from 'sweetalert2'
import 'animate.css'
import Sidebar from '@/components/dashboard/sidebar'
import DashboardHeader from '@/components/dashboard/header'
import KanbanBoard from '@/components/dashboard/kanban-board'
import MobileBottomBar from '@/components/dashboard/mobile-bottom-bar'
import MobileCategoryPills from '@/components/dashboard/mobile-category-pills'
import { AiMessageBubble } from '@/components/dashboard/ai-chat-message'
import { CollectionModal } from '@/components/modals/collection-modal'
import { LinkModal } from '@/components/modals/link-modal'
import { ShareModal } from '@/components/modals/share-modal'
import { PaymentModal } from '@/components/modals/payment-modal'
import { SettingsModal } from '@/components/modals/settings-modal'
import { useCollections } from '@/hooks/use-collections'
import { isSupabaseConfigured } from '@/lib/bookmarksApi'
import { chatWithGemini, isGeminiConfigured, generateLinkSummary } from '@/lib/geminiApi'
import { getAiQuota, consumeAiQuota, showQuotaExceededAlert } from '@/lib/quotaManager'
import { registerBackButtonHandler } from '@/lib/backButtonHandler'

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState(() => (typeof window !== 'undefined' && window.innerWidth <= 640 ? 'list' : 'kanban'))
  const [mobileActiveTab, setMobileActiveTab] = useState('board')
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('')
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [linkEditor, setLinkEditor] = useState(null)
  const [currentUser, setCurrentUser] = useState(() => {
    if (!user) return user
    const userId = user.id || 'mock'
    const storedPlan = localStorage.getItem(`tabmark_user_plan_${userId}`)
    if (storedPlan) {
      return { ...user, plan: storedPlan, is_pro: true }
    }
    return user
  })

  useEffect(() => {
    if (!user) {
      setCurrentUser(null)
      return
    }
    const userId = user.id || 'mock'
    const storedPlan = localStorage.getItem(`tabmark_user_plan_${userId}`)
    if (storedPlan) {
      setCurrentUser({ ...user, plan: user.plan || storedPlan, is_pro: user.is_pro || true })
    } else {
      setCurrentUser(user)
    }
  }, [user])

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

  // Handle Android hardware back button for all modals and drawers in Dashboard
  useEffect(() => {
    const unregister = registerBackButtonHandler(() => {
      if (linkEditor) {
        setLinkEditor(null)
        return true
      }
      if (collectionModalOpen) {
        setCollectionModalOpen(false)
        return true
      }
      if (shareModalOpen) {
        setShareModalOpen(false)
        return true
      }
      if (paymentModalOpen) {
        setPaymentModalOpen(false)
        return true
      }
      if (settingsModalOpen) {
        setSettingsModalOpen(false)
        return true
      }
      if (aiChatOpen) {
        setAiChatOpen(false)
        return true
      }
      if (isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false)
        return true
      }
      return false // No open modal, delegate to global handler (double-tap exit or page nav)
    })
    return unregister
  }, [
    linkEditor,
    collectionModalOpen,
    shareModalOpen,
    paymentModalOpen,
    settingsModalOpen,
    aiChatOpen,
    isMobileSidebarOpen
  ])

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
    if (!aiChatInput.trim() || isAiResponding) return

    // 1. Kiểm tra & Trừ Quota AI
    const quotaResult = consumeAiQuota(currentUser)
    if (!quotaResult.success) {
      showQuotaExceededAlert(() => setPaymentModalOpen(true), getAiQuota(currentUser))
      return
    }

    const userQuery = aiChatInput.trim()
    const newMessages = [...aiChatMessages, { sender: 'user', text: userQuery }]
    setAiChatMessages(newMessages)
    setAiChatInput('')
    setIsAiResponding(true)

    // Lấy context từ tất cả các bookmark thuộc mọi danh mục để AI có góc nhìn toàn diện
    const allBookmarksContext = collections.flatMap(col => 
      (col.links || []).map(link => ({
        ...link,
        collectionName: col.name
      }))
    )

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
          responseText = 'Xin chào! Tôi là TabMark AI. Tôi có thể giúp gì cho bạn? Hãy thử gõ: **"Tóm tắt các link"** hoặc **"Tìm React"**.'
        } else {
          responseText = 'Tôi là TabMark AI (Chế độ giả lập). Tôi có thể:\n- 📝 **Tóm tắt** các bookmark hiện tại (gõ "tóm tắt")\n- 🔍 **Tìm kiếm** link trong hệ thống (gõ "tìm [từ khóa]")\n- 🤖 Giải đáp thắc mắc của bạn về bộ sưu tập link.\n\n*(Lưu ý: Để bật AI thực tế, hãy cấu hình VITE_GEMINI_API_KEY trong file .env)*'
        }

        setAiChatMessages(prev => [...prev, { sender: 'ai', text: responseText }])
        setIsAiResponding(false)
      }, 1000)
      return
    }

    try {
      const response = await chatWithGemini(newMessages, allBookmarksContext.length > 0 ? allBookmarksContext : (activeCollection?.links || []))
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
    // 1. Kiểm tra & Trừ Quota AI
    const quotaResult = consumeAiQuota(currentUser)
    if (!quotaResult.success) {
      showQuotaExceededAlert(() => setPaymentModalOpen(true), getAiQuota(currentUser))
      return
    }

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
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        collections={collections}
        activeCollectionId={activeCollection?.id}
        onSelectCollection={handleSelectCollection}
        searchQuery={sidebarSearchQuery}
        onSearchChange={setSidebarSearchQuery}
        onAIChatToggle={() => setAiChatOpen(!aiChatOpen)}
        user={currentUser}
        onOpenPayment={() => setPaymentModalOpen(true)}
        onSettingsClick={() => setSettingsModalOpen(true)}
        onAddCollection={canEditGroup ? () => setCollectionModalOpen(true) : undefined}
        onLogout={onLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
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
          user={currentUser}
          onOpenPayment={() => setPaymentModalOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Mobile Horizontal Category Pills Strip & View Mode Switcher */}
        <MobileCategoryPills
          collections={filteredCollections}
          activeCollectionId={activeCollection?.id}
          onSelectCollection={handleSelectCollection}
          onAddGroup={canEditGroup ? () => setCollectionModalOpen(true) : undefined}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* Kanban / List Area */}
        <main className="flex-1 flex flex-col overflow-hidden kanban-board-bg">
          {/* Active Group Description Header */}
          <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-1 hidden sm:flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide truncate">{activeCollection?.name ?? 'No group'}</h1>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{activeCollection?.description || 'Thêm link vào bảng Kanban này.'}</p>
            </div>
            <div className="text-[10px] font-bold text-slate-400 bg-white/[0.03] border border-white/10 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
              {totalFilteredLinksCount} links
            </div>
          </div>

          {/* Kanban Board Component with ViewMode support */}
          <KanbanBoard
            collections={filteredCollections}
            activeCollectionId={activeCollection?.id}
            highlightedColumnId={highlightedColumnId}
            viewMode={viewMode}
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

      {/* Floating Messenger-style AI Chat Bubble (Desktop Only) */}
      {!aiChatOpen && (
        <button
          onClick={() => setAiChatOpen(true)}
          className="hidden sm:flex fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 z-40 items-center justify-center scale-100 hover:scale-105 active:scale-95 cursor-pointer"
          title="Mở AI Assistant"
        >
          <Sparkles className="w-5 h-5 fill-white/10" />
        </button>
      )}

      {/* Mobile Backdrop Overlay for AI Chat Bottom Sheet */}
      {aiChatOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setAiChatOpen(false)}
        />
      )}

      {/* AI Chat Widget (Mobile Bottom Sheet & Desktop Messenger Widget) */}
      {aiChatOpen && (() => {
        const aiQuota = getAiQuota(currentUser)
        return (
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[420px] bg-[#0c0f16]/98 backdrop-blur-2xl border-t sm:border border-white/15 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] sm:shadow-2xl rounded-t-3xl sm:rounded-2xl flex flex-col h-[85vh] sm:h-[560px] max-h-[90vh] z-50 animate-fade-in-up pb-safe">
            {/* Mobile Drag Handle */}
            <div
              className="sm:hidden pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing"
              onClick={() => setAiChatOpen(false)}
            >
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01] sm:rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400/10" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0c0f16]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">TabMark AI</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      aiQuota.isUnlimited 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : aiQuota.remaining > 0
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {aiQuota.isUnlimited ? '⚡ Pro Unlimited' : `✨ ${aiQuota.remaining}/${aiQuota.dailyLimit} lượt`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Trợ lý tìm kiếm & tóm tắt liên kết</p>
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
                <AiMessageBubble key={idx} message={msg} />
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

            {/* Quick Prompt Suggestion Pills */}
            <div className="px-3 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5 bg-[#090b11]/30">
              <button
                type="button"
                onClick={() => setAiChatInput('Tóm tắt các link trong nhóm này')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-cyan-300 font-medium whitespace-nowrap border border-cyan-500/20 transition-colors cursor-pointer touch-press"
              >
                📝 Tóm tắt nhóm
              </button>
              <button
                type="button"
                onClick={() => setAiChatInput('Tìm bookmark ')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-purple-300 font-medium whitespace-nowrap border border-purple-500/20 transition-colors cursor-pointer touch-press"
              >
                🔍 Tìm kiếm
              </button>
              <button
                type="button"
                onClick={() => setAiChatInput('Gợi ý tài liệu hay')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-blue-300 font-medium whitespace-nowrap border border-blue-500/20 transition-colors cursor-pointer touch-press"
              >
                💡 Gợi ý tài liệu
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAiMessage} className="p-3 sm:p-4 border-t border-white/5 bg-[#090b11]/50 sm:rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  placeholder="Hỏi AI về bookmark..."
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  disabled={isAiResponding}
                />
                <button
                  type="submit"
                  disabled={!aiChatInput.trim() || isAiResponding}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center touch-press"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )
      })()}

      {/* Mobile Bottom Navigation Bar (Glassmorphism Dock) */}
      <MobileBottomBar
        activeTab={mobileActiveTab}
        onTabChange={(tab) => {
          setMobileActiveTab(tab)
          if (tab === 'board') {
            setAiChatOpen(false)
          }
        }}
        onOpenAddLink={() => handleOpenAddLinkModal(activeCollectionId)}
        onOpenCollections={() => setIsMobileSidebarOpen(true)}
        onToggleAiChat={() => setAiChatOpen((prev) => !prev)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        isAiChatOpen={aiChatOpen}
        aiQuotaRemaining={getAiQuota(currentUser).remaining}
      />

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
          collections={collections}
          activeCollectionId={linkEditor.collectionId || activeCollectionId}
          initialValues={linkEditor.link ? { ...linkEditor.link, tags: linkEditor.link.tags.join(', ') } : undefined}
          user={currentUser}
          onUpgrade={() => {
            setLinkEditor(null)
            setPaymentModalOpen(true)
          }}
          onClose={() => setLinkEditor(null)}
          onSave={(link) => {
            const targetColId = link.collectionId || linkEditor.collectionId || activeCollectionId
            handleSaveLink(link, linkEditor.mode, linkEditor.link?.id, targetColId, () => setLinkEditor(null))
          }}
        />
      )}

      {paymentModalOpen && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          user={currentUser}
          onUpgradeSuccess={(plan) => {
            const userId = currentUser?.id || 'mock'
            try {
              localStorage.setItem(`tabmark_user_plan_${userId}`, plan.id)
              localStorage.setItem(`tabmark_is_pro_${userId}`, 'true')
              const currentMock = localStorage.getItem('tabmark_mock_user')
              if (currentMock) {
                const parsed = JSON.parse(currentMock)
                localStorage.setItem('tabmark_mock_user', JSON.stringify({ ...parsed, is_pro: true, plan: plan.id }))
              }
            } catch (e) {
              console.warn('Lỗi lưu gói nâng cấp vào localStorage:', e)
            }
            setCurrentUser(prev => ({ ...prev, is_pro: true, plan: plan.id }))
          }}
        />
      )}

      {settingsModalOpen && (
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          user={currentUser}
          onUserUpdated={(updated) => setCurrentUser(updated)}
          onOpenPayment={() => setPaymentModalOpen(true)}
          onLogout={onLogout}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] flex items-center justify-between gap-3 px-4 py-3 bg-[#10141f]/95 border border-blue-500/30 rounded-2xl shadow-2xl glass-card animate-fade-in-up max-w-md w-auto sm:w-full">
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
