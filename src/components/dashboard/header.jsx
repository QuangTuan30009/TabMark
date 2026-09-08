import { Search, Download, Upload, RefreshCw, Plus, Sparkles, Command } from 'lucide-react'

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
}) {
  return (
    <header className="border-b border-white/[0.06] bg-[#090d16]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-3.5 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ── LEFT: SMART AI SEARCH BAR (Concept 1 Style) ── */}
        <div className="flex-1 max-w-lg">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Ask AI or search bookmarks..."
              className="w-full pl-10 pr-12 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-white placeholder:text-slate-500 transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-slate-400 pointer-events-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: ACTIONS GROUP (Concept 1 Style) ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Sync Status Badge */}
          <div className="hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400 lg:flex items-center">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${isCloudEnabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-[11px] font-medium">{syncStatus}</span>
          </div>

          {/* PRO Badge / Upgrade Button */}
          {onOpenPayment && (
            user?.is_pro ? (
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider">PRO ACTIVE</span>
              </div>
            ) : (
              <button
                onClick={onOpenPayment}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-black rounded-xl text-xs font-black shadow-[0_0_15px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
                title="Mở khóa tính năng AI không giới hạn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nâng cấp PRO</span>
              </button>
            )
          )}

          {/* + Add Link Button (Primary) */}
          {onAddLink && (
            <button
              onClick={onAddLink}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          )}

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

          {/* Extra Buttons */}
          <button
            onClick={onImport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Import Bookmarks"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          {!isSharedView && onShare && (
            <button
              onClick={onShare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/25 rounded-xl text-xs font-semibold text-purple-300 hover:text-purple-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
