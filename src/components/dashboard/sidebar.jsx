import { useState } from 'react'
import {
  Briefcase,
  Wrench,
  Palette,
  User as UserIcon,
  BookOpen,
  Search,
  MessageSquare,
  Settings,
  Bookmark,
  LogOut,
  Sparkles,
  LayoutDashboard,
  BarChart2,
  Folder,
  Plus,
  ChevronRight
} from 'lucide-react'

// Helper to match collection name with mockup icons
function getCollectionIcon(name) {
  const lower = name.toLowerCase()
  if (lower.includes('work') || lower.includes('việc')) return Briefcase
  if (lower.includes('dev') || lower.includes('tool') || lower.includes('công cụ')) return Wrench
  if (lower.includes('design') || lower.includes('thiết kế')) return Palette
  if (lower.includes('personal') || lower.includes('cá nhân')) return UserIcon
  if (lower.includes('reading') || lower.includes('sách') || lower.includes('đọc')) return BookOpen
  return Folder
}

export default function Sidebar({
  collections = [],
  activeCollectionId,
  onSelectCollection,
  searchQuery = '',
  onSearchChange,
  onAIChatToggle,
  user,
  onSettingsClick,
  onLogout,
  onOpenPayment,
}) {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Filter collections based on searchQuery
  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = () => {
    if (!user) return 'SJ'
    const name = user.email || 'Sarah Jenkins'
    return name.slice(0, 2).toUpperCase()
  }

  const displayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Sarah Jenkins')
  const displayUsername = user?.email ? `@${user.email.split('@')[0]}` : '@SarahJ'

  return (
    <div className="w-72 bg-[#090d16] border-r border-white/[0.06] flex flex-col h-[calc(100vh-4rem)] md:h-screen shrink-0 text-foreground transition-all duration-300 select-none">
      {/* ── USER PROFILE SECTION (Concept 1 Style) ── */}
      <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-[0_0_12px_rgba(59,130,246,0.3)] shrink-0">
            <div className="w-full h-full rounded-full bg-[#0d121f] flex items-center justify-center text-white text-xs font-bold">
              {getInitials()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090d16]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold truncate text-white">
                {displayName}
              </p>
              {user?.is_pro ? (
                <span className="px-1.5 py-0.2 text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-full uppercase tracking-wider shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                  PRO
                </span>
              ) : (
                <button
                  onClick={onOpenPayment}
                  className="px-1.5 py-0.2 text-[9px] font-bold bg-white/10 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 rounded-full cursor-pointer transition-colors"
                  title="Click để nâng cấp PRO"
                >
                  FREE
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {displayUsername}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onSettingsClick}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── BRAND LOGO HEADER ── */}
      <div className="px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center group">
          <img
            src="/Tabmark-removebg-preview.png"
            alt="TabMark Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>
      </div>

      {/* ── MAIN NAVIGATION LINKS (Concept 1 Style) ── */}
      <div className="px-3 py-1 space-y-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            const searchInput = document.querySelector('header input')
            if (searchInput) searchInput.focus()
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          onClick={onOpenPayment}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all"
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics</span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">PRO</span>
        </button>
      </div>

      {/* Search Input for Collections */}
      <div className="p-3 border-t border-white/[0.04] mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.06] rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* ── COLLECTIONS SECTION HEADER ── */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider">
        <span>COLLECTIONS</span>
      </div>

      {/* Collections List */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {filteredCollections.map((col) => {
          const Icon = getCollectionIcon(col.name)
          const isActive = col.id === activeCollectionId
          return (
            <button
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group ${
                isActive
                  ? 'bg-white/[0.08] text-white font-bold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="truncate text-left">{col.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500 group-hover:text-slate-400'
              }`}>
                {col.links?.length ?? 0}
              </span>
            </button>
          )
        })}

        {filteredCollections.length === 0 && (
          <p className="text-[11px] text-center text-slate-500 py-6">No collections found</p>
        )}
      </nav>

      {/* ── UPGRADE BANNER (For Free Users) ── */}
      {!user?.is_pro && onOpenPayment && (
        <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.08)]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">Nâng Cấp PRO</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Chỉ từ 29.000đ dùng AI không giới hạn & lưu trữ trọn đời.
          </p>
          <button
            onClick={onOpenPayment}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black hover:brightness-110 shadow-[0_0_12px_rgba(251,191,36,0.3)] transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Nâng cấp ngay</span>
          </button>
        </div>
      )}

      {/* ── BOTTOM AI ASSISTANT BUTTON (Concept 1 Pillar) ── */}
      <div className="p-3 border-t border-white/[0.05]">
        <button
          onClick={onAIChatToggle}
          className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20 hover:from-cyan-600/30 hover:to-indigo-600/30 border border-cyan-500/30 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-3.5 h-3.5 fill-white/20" />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-white leading-tight">AI ASSISTANT</p>
              <p className="text-[10px] text-cyan-300 font-normal">Chat with TabMark AI</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
