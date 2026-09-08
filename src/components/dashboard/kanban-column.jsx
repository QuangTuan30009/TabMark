import { useState } from 'react'
import { MoreVertical, Plus } from 'lucide-react'
import KanbanCard from './kanban-card'
import PopupBlockerModal from './popup-blocker-modal'

export default function KanbanColumn({
  columnKey,
  title,
  color,
  indicatorColor,
  glowClass,
  isHighlighted = false,
  tooltipDirection = 'right',
  cards = [],
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPopupModal, setShowPopupModal] = useState(false)

  function handleOpenAllLinks() {
    if (cards.length === 0) return
    
    // Check localStorage before showing the modal
    const dontShowAgain = localStorage.getItem('hidePopupBlockerGuide')
    if (!dontShowAgain) {
      setShowPopupModal(true)
    }

    const getHref = (url) => {
      if (!url) return '#'
      return /^https?:\/\//i.test(url) ? url : `https://${url}`
    }
    cards.forEach((card, index) => {
      setTimeout(() => {
        window.open(getHref(card.url), '_blank', 'noopener,noreferrer')
      }, index * 150)
    })
  }

  return (
    <div
      className={`w-full flex flex-col rounded-2xl border transition-all duration-300 max-h-[calc(100vh-12rem)] ${
        isHighlighted ? 'highlight-active-column' : 'border-white/[0.04]'
      } ${glowClass || 'bg-[#0b0d14]/40'}`}
    >
      {/* Column Header */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Color Indicator Dot */}
          <div className={`w-2 h-2 rounded-full ${indicatorColor} shadow-[0_0_8px_currentColor]`} />
          <h3 className="font-bold text-sm text-white truncate tracking-wide">{title}</h3>
          <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.04] border border-white/5 px-2.5 py-0.5 rounded-full flex-shrink-0">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </span>
        </div>
        
        <div className="flex items-center">
          {onAddLink && (
            <button
              onClick={() => onAddLink(columnKey)}
              className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
              title="Add link to group"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-44 bg-[#10141f] border border-white/5 rounded-xl shadow-xl z-20 py-1.5 animate-fade-in-up">
                  {onEditGroup && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onEditGroup(columnKey)
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Rename group
                    </button>
                  )}
                  {onDuplicateGroup && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onDuplicateGroup(columnKey)
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Duplicate group
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      handleOpenAllLinks()
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cards.length === 0}
                  >
                    Open all links ({cards.length})
                  </button>
                  {onDeleteGroup && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onDeleteGroup(columnKey)
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-white/5"
                    >
                      Delete group
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar min-h-0"
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDragOver(e)
        }}
        onDrop={(e) => {
          e.stopPropagation()
          onDrop(e, columnKey)
        }}
      >
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 border border-dashed border-white/5 rounded-xl text-center p-4">
            <p className="text-xs text-slate-600">No bookmarks yet</p>
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              columnKey={columnKey}
              color={color}
              tooltipDirection={tooltipDirection}
              onDragStart={onDragStart}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onGenerateSummary={onGenerateSummary}
            />
          ))
        )}
      </div>

      {/* Popup Blocker Guide Modal */}
      <PopupBlockerModal 
        isOpen={showPopupModal} 
        onClose={() => setShowPopupModal(false)} 
      />
    </div>
  )
}
