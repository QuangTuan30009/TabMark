import { useState } from 'react'
import { Search, Download, Upload, RefreshCw, Plus, Sparkles, Command, Menu, MoreVertical, FolderPlus } from 'lucide-react'

export default function DashboardHeader({
  query,
  onQueryChange,
  onAddGroup,
  onAddLink,
  onExport,
  onImport,
  onSync,
  onShare,
  syncStatus,
  isCloudEnabled,
  isSharedView,
  user,
  onOpenPayment,
  onOpenMobileSidebar,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-white/[0.06] bg-[#090d16]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 pt-[calc(max(env(safe-area-inset-top,0px),0px)+0.875rem)] pb-3.5 sm:pt-[calc(max(env(safe-area-inset-top,0px),0px)+1rem)] sm:pb-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 min-w-0">
        
        {/* ── LEFT: HAMBURGER + SMART AI SEARCH BAR ── */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0 max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
          {/* Mobile Hamburger Menu Toggle */}
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Mở menu danh mục"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Search Bar */}
          <div className="relative group flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Hỏi AI hoặc tìm bookmark..."
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-white placeholder:text-slate-500 transition-all shadow-inner"
            />
            <div className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-slate-400 pointer-events-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: ACTIONS GROUP ── */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 min-w-0">
          {/* PRO Badge / Upgrade Button */}
          {onOpenPayment && (
            user?.is_pro ? (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)] shrink-0 select-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider font-extrabold">PRO</span>
              </div>
            ) : (
              <button
                onClick={onOpenPayment}
                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-black rounded-xl text-xs font-black shadow-[0_0_12px_rgba(251,191,36,0.3)] transition-all cursor-pointer shrink-0"
                title="Mở khóa tính năng AI không giới hạn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">PRO</span>
              </button>
            )
          )}

          {/* + Add Collection Button */}
          {onAddGroup && (
            <button
              onClick={onAddGroup}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
              title="Tạo nhóm bookmark mới"
            >
              <FolderPlus className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="hidden xl:inline">Thêm Nhóm</span>
            </button>
          )}

          {/* + Add Link Button (Primary) */}
          {onAddLink && (
            <button
              onClick={onAddLink}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all cursor-pointer shrink-0"
              title="Thêm bookmark mới"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Thêm Link</span>
              <span className="sm:hidden">Link</span>
            </button>
          )}

          {/* Share Button (Direct on medium/large screens) */}
          {!isSharedView && onShare && (
            <button
              onClick={onShare}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/25 rounded-xl text-xs font-semibold text-purple-300 hover:text-purple-200 transition-all cursor-pointer shrink-0"
              title="Chia sẻ Kanban Board"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden 2xl:inline">Share</span>
            </button>
          )}

          {/* Wide Desktop Direct Buttons (Only on extra wide screens >= 1536px to prevent overflow) */}
          <div className="hidden 2xl:flex items-center gap-1.5">
            {/* Export Button */}
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Export Bookmarks"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Sync Button */}
            <button
              onClick={onSync}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Sync Database"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>

            {/* Import Button */}
            <button
              onClick={onImport}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Import Bookmarks"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>

          {/* Secondary Action Dropdown (Visible on all screens < 2xl to guarantee no overflow) */}
          <div className="relative 2xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Thao tác khác"
              aria-label="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#10141f] border border-white/10 rounded-2xl shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-fade-in-up">
                  {onAddGroup && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        onAddGroup()
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-blue-400 hover:bg-white/5 transition-colors font-semibold cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Thêm Nhóm mới</span>
                    </button>
                  )}

                  {!isSharedView && onShare && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        onShare()
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-purple-300 hover:bg-purple-500/10 transition-colors font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Chia sẻ Kanban Board</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onExport()
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Xuất Bookmarks (Export)</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onImport()
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Nhập Bookmarks (Import)</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onSync()
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer border-t border-white/5"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Đồng bộ ({syncStatus})</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
