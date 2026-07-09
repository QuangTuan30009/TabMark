import { useEffect, useRef, useState } from 'react'
import KanbanColumn from './kanban-column'

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
}) {
  const boardRef = useRef(null)
  const [draggedColId, setDraggedColId] = useState(null)
  const [dragOverColId, setDragOverColId] = useState(null)

  useEffect(() => {
    if (activeCollectionId) {
      const colEl = document.getElementById(`column-${activeCollectionId}`)
      if (colEl) {
        colEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [activeCollectionId])

  function handleColDragStart(e, colId) {
    e.dataTransfer.setData('text/collection-id', colId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedColId(colId)
  }

  function handleColDragOver(e, colId) {
    // Only handle collection reordering if we're dragging a collection
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

  return (
    <div ref={boardRef} className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 w-full auto-rows-min">
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
              className={`transition-all duration-300 w-full ${
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
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
