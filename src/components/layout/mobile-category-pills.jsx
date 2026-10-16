import { Plus, Columns, ListFilter, LayoutGrid } from 'lucide-react'

export default function MobileCategoryPills({
  collections = [],
  activeCollectionId,
  onSelectCollection,
  onAddGroup,
  viewMode = 'kanban', // 'kanban' | 'list'
  onToggleViewMode,
}) {
  return (
    <div className="sm:hidden px-3 pt-2 pb-1 border-b border-white/[0.06] bg-[#070a12]/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Bộ sưu tập ({collections.length})
        </span>

        {/* View Mode Toggle: Kanban Columns vs Vertical List */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => onToggleViewMode?.('kanban')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all touch-press cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chế độ cột Kanban"
          >
            <Columns className="w-3 h-3" />
            <span>Cột</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode?.('list')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all touch-press cursor-pointer ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chế độ danh sách đọc"
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Danh sách</span>
          </button>
        </div>
      </div>

      {/* Horizontal scrolling pill chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 scroll-smooth">
        {collections.map((col) => {
          const isActive = col.id === activeCollectionId
          const count = col.links?.length || 0

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectCollection?.(col.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-press cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)] border border-blue-400/40'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
              }`}
            >
              <span className="truncate max-w-[120px]">{col.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}

        {/* Quick Add Group Pill */}
        {onAddGroup && (
          <button
            type="button"
            onClick={onAddGroup}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-dashed border-white/20 whitespace-nowrap transition-all touch-press cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo nhóm</span>
          </button>
        )}
      </div>
    </div>
  )
}
