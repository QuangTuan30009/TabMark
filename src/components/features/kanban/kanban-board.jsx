import { useEffect, useRef, useState } from 'react'
import KanbanColumn from './kanban-column'
import KanbanCard from './kanban-card'
import { Plus, Bookmark, FolderPlus } from 'lucide-react'

const colorsConfig = [
  { color: 'blue', indicatorColor: 'bg-blue-500', glowClass: 'glow-todo' },
  { color: 'green', indicatorColor: 'bg-emerald-500', glowClass: 'glow-progress' },
  { color: 'orange', indicatorColor: 'bg-amber-500', glowClass: 'glow-review' },
  { color: 'purple', indicatorColor: 'bg-purple-500', glowClass: 'glow-done' },
  { color: 'pink', indicatorColor: 'bg-pink-500', glowClass: 'glow-review' },
]

export default function KanbanBoard({
  collections = [],
  activeCollectionId = null,
  highlightedColumnId = null,
  viewMode = 'kanban',
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onDuplicate,
  onAddLink,
  onEditGroup,
  onDeleteGroup,
  onDuplicateGroup,
  onReorderCollections,
  onGenerateSummary,
  onMoveLink,
  onShareCard,
}) {
  const boardRef = useRef(null)
  const [draggedColId, setDraggedColId] = useState(null)
  const [dragOverColId, setDragOverColId] = useState(null)

  useEffect(() => {
    if (activeCollectionId && viewMode === 'kanban') {
      const colEl = document.getElementById(`column-${activeCollectionId}`)
      if (colEl) {
        colEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [activeCollectionId, viewMode])

  function handleColDragStart(e, colId) {
    e.dataTransfer.setData('text/collection-id', colId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedColId(colId)
  }

  function handleColDragOver(e, colId) {
    if (!draggedColId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColId(colId)
  }

  function handleColDrop(e, targetColId) {
    if (!draggedColId || draggedColId === targetColId) {
      setDraggedColId(null)
      setDragOverColId(null)
      return
    }

    e.preventDefault()
    e.stopPropagation()

    if (onReorderCollections) {
      onReorderCollections(draggedColId, targetColId)
    }

    setDraggedColId(null)
    setDragOverColId(null)
  }

  function handleColDragEnd() {
    setDraggedColId(null)
    setDragOverColId(null)
  }

  // Active collection for List View
  const activeCol = collections.find((c) => c.id === activeCollectionId) || collections[0]
  const activeIndex = collections.findIndex((c) => c.id === activeCol?.id)
  const activeConfig = colorsConfig[(activeIndex >= 0 ? activeIndex : 0) % colorsConfig.length]

  return (
    <div ref={boardRef} className="flex-1 overflow-y-auto overflow-x-auto sm:overflow-x-hidden scroll-smooth pb-dock sm:pb-8">
      {/* ── MOBILE LIST VIEW (Clean Vertical Reading Flow) ── */}
      {viewMode === 'list' && (
        <div className="sm:hidden p-4 space-y-4 max-w-lg mx-auto">
          {activeCol ? (
            <>
              {/* Group Card Header */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-3 h-3 rounded-full ${activeConfig.indicatorColor} shadow-[0_0_8px_currentColor]`} />
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white truncate">{activeCol.name}</h2>
                    <p className="text-[11px] text-slate-400 truncate">{activeCol.description || 'Danh sách liên kết'}</p>
                  </div>
                </div>
                {onAddLink && (
                  <button
                    type="button"
                    onClick={() => onAddLink(activeCol.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition-all touch-press cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                )}
              </div>

              {/* List of Cards */}
              {activeCol.links?.length > 0 ? (
                <div className="space-y-3">
                  {activeCol.links.map((card, idx) => (
                    <KanbanCard
                      key={card.id}
                      card={card}
                      columnKey={activeCol.id}
                      color={activeConfig.color}
                      onDragStart={onDragStart}
                      onDropOnCard={onDrop}
                      canMoveUp={idx > 0}
                      canMoveDown={idx < activeCol.links.length - 1}
                      onMoveUp={onMoveLink ? () => onMoveLink(card.id, 'up') : undefined}
                      onMoveDown={onMoveLink ? () => onMoveLink(card.id, 'down') : undefined}
                      onShareCard={onShareCard}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                      onGenerateSummary={onGenerateSummary}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                  <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-300">Chưa có liên kết nào</p>
                  <p className="text-[11px] text-slate-500 mt-1 mb-4">Nhóm này chưa có bookmark nào được thêm.</p>
                  {onAddLink && (
                    <button
                      type="button"
                      onClick={() => onAddLink(activeCol.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold transition-all touch-press cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm bookmark đầu tiên</span>
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-white/10">
              <FolderPlus className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-300">Chưa có nhóm nào</p>
            </div>
          )}
        </div>
      )}

      {/* ── STANDARD KANBAN MULTI-COLUMN VIEW ── */}
      <div
        className={`${
          viewMode === 'list' ? 'hidden sm:flex' : 'flex'
        } sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 snap-x snap-mandatory sm:snap-none overflow-x-auto sm:overflow-x-visible gap-3 sm:gap-6 p-3 sm:p-6 w-full auto-rows-min`}
      >
        {collections.map((col, index) => {
          const config = colorsConfig[index % colorsConfig.length]
          const isHighlighted = highlightedColumnId === col.id || activeCollectionId === col.id
          const tooltipDirection = index >= collections.length - 2 && collections.length > 2 ? 'left' : 'right'
          const isDragging = draggedColId === col.id
          const isDragOver = dragOverColId === col.id && draggedColId !== col.id

          return (
            <div
              key={col.id}
              id={`column-${col.id}`}
              className={`transition-all duration-300 w-[82vw] max-w-[320px] shrink-0 snap-start sm:w-full sm:max-w-none sm:shrink ${
                isDragging ? 'opacity-40 scale-95' : ''
              } ${isDragOver ? 'ring-2 ring-primary/50 rounded-2xl' : ''}`}
              draggable
              onDragStart={(e) => handleColDragStart(e, col.id)}
              onDragOver={(e) => handleColDragOver(e, col.id)}
              onDrop={(e) => handleColDrop(e, col.id)}
              onDragEnd={handleColDragEnd}
            >
              <KanbanColumn
                columnKey={col.id}
                title={col.name}
                color={config.color}
                indicatorColor={config.indicatorColor}
                glowClass={config.glowClass}
                isHighlighted={isHighlighted}
                tooltipDirection={tooltipDirection}
                cards={col.links || []}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAddLink={onAddLink}
                onEditGroup={onEditGroup}
                onDeleteGroup={onDeleteGroup}
                onDuplicateGroup={onDuplicateGroup}
                onGenerateSummary={onGenerateSummary}
                onMoveLink={onMoveLink}
                onShareCard={onShareCard}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

