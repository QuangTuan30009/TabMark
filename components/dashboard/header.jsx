import { Search, Download, Upload, RefreshCw, Plus, Sparkles } from 'lucide-react'

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
} ) {
  return (
    <header className="border-b border-white/5 bg-[#080a10]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 group-focus-within:animate-pulse" />
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search or ask AI..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-slate-500 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Cloud Sync Status Badge */}
          <div className="hidden rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-1.5 text-xs text-slate-400 lg:flex items-center">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${isCloudEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {syncStatus}
          </div>

          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Export Bookmarks"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={onImport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Import Bookmarks"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>

          <button
            onClick={onSync}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Sync Database"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync</span>
          </button>

          {!isSharedView && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-sm font-medium text-purple-300 hover:text-purple-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}

          {onAddGroup && (
            <button
              onClick={onAddGroup}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add group</span>
            </button>
          )}

          {onAddLink && (
            <button
              onClick={onAddLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add link</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
