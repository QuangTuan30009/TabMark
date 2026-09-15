import { 
  LayoutDashboard, 
  FolderOpen, 
  Plus, 
  Sparkles, 
  Settings 
} from 'lucide-react'

export default function MobileBottomBar({
  activeTab = 'board',
  onTabChange,
  onOpenAddLink,
  onOpenCollections,
  onToggleAiChat,
  onOpenSettings,
  isAiChatOpen = false,
  aiQuotaRemaining = 0,
}) {
  return (
    <div className="fixed bottom-2 inset-x-3 sm:hidden z-40">
      <nav 
        className="relative bg-[#0b0f19]/92 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.75)] px-2 py-1.5 flex items-center justify-between"
        style={{
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
        aria-label="Mobile Navigation"
      >
        {/* 1. Board / Trang chủ */}
        <button
          type="button"
          onClick={() => onTabChange?.('board')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all touch-press cursor-pointer ${
            activeTab === 'board' && !isAiChatOpen
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {activeTab === 'board' && !isAiChatOpen && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Bảng</span>
        </button>

        {/* 2. Danh mục / Collections */}
        <button
          type="button"
          onClick={onOpenCollections}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-slate-400 hover:text-white transition-all touch-press cursor-pointer"
        >
          <div className="relative">
            <FolderOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Nhóm</span>
        </button>

        {/* 3. Center Elevated + Add Link Button */}
        <div className="flex items-center justify-center px-1">
          <button
            type="button"
            onClick={onOpenAddLink}
            className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(59,130,246,0.6)] border border-white/20 active:scale-90 hover:scale-105 transition-all cursor-pointer touch-press"
            title="Thêm bookmark mới"
            aria-label="Add Bookmark"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. TabMark AI Assistant */}
        <button
          type="button"
          onClick={onToggleAiChat}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all touch-press cursor-pointer ${
            isAiChatOpen
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {isAiChatOpen && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Trợ lý AI</span>
        </button>

        {/* 5. Cài đặt / Profile */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-slate-400 hover:text-white transition-all touch-press cursor-pointer"
        >
          <div className="relative">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Cài đặt</span>
        </button>
      </nav>
    </div>
  )
}
