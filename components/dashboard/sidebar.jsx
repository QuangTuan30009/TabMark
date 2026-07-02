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
  LogOut
} from 'lucide-react'

// Helper to match collection name with mockup icons
function getCollectionIcon(name) {
  const lower = name.toLowerCase()
  if (lower.includes('work') || lower.includes('việc')) return Briefcase
  if (lower.includes('dev')) return Wrench
  if (lower.includes('tool') || lower.includes('công cụ')) return Wrench
  if (lower.includes('design') || lower.includes('thiết kế')) return Palette
  if (lower.includes('personal') || lower.includes('cá nhân')) return UserIcon
  if (lower.includes('reading') || lower.includes('sách') || lower.includes('đọc')) return BookOpen
  return Bookmark
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
  onLogout
}) {
  // Filter collections in the sidebar based on searchQuery
  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get initials for profile avatar
  const getInitials = () => {
    if (!user) return 'AC'
    const name = user.email || 'Alex Chen'
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="w-72 bg-[#0b0d14] border-r border-white/5 flex flex-col h-[calc(100vh-4rem)] md:h-screen shrink-0 text-foreground transition-all duration-300">
      {/* User Profile Area */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            {getInitials()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-white">
              {user?.email ? user.email.split('@')[0] : 'Alex Chen'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || 'alex@example.com'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onSettingsClick}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Groups bar */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.03] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Collections Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredCollections.map((col) => {
          const Icon = getCollectionIcon(col.name)
          const isActive = col.id === activeCollectionId
          return (
            <button
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="flex-1 text-left truncate">{col.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500 group-hover:text-slate-400'}`}>
                {col.links?.length ?? 0}
              </span>
            </button>
          )
        })}

        {filteredCollections.length === 0 && (
          <p className="text-xs text-center text-slate-500 py-6">No groups found</p>
        )}
      </nav>

      {/* Bottom AI Chat button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onAIChatToggle}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl text-white text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer ai-chat-btn-glow"
        >
          <MessageSquare className="w-4 h-4 fill-white/10" />
          AI Chat
        </button>
      </div>
    </div>
  )
}
