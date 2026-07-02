import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

function getHref(url) {
  if (!url) return '#'
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

export default function AISummaryModal({ card, onClose, visible }) {
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    setIsVisible(visible)
  }, [visible])

  if (!isVisible || !card) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-lg shadow-2xl z-50 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">AI Summary</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Card Info */}
          <div className="flex items-start gap-3">
            <div className="text-3xl">{card.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{card.title}</h4>
              <p className="text-sm text-muted-foreground">{card.url}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">
              Comprehensive crash course covering advanced TypeScript features like generics, decorators, and utility types. 45 minutes long.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span key={tag} className="inline-block px-2.5 py-1 text-xs bg-secondary border border-border/50 rounded-full text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Estimated Time</p>
              <p className="font-semibold text-sm">{card.time}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Added</p>
              <p className="font-semibold text-sm">Today</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2">
          <button className="flex-1 px-4 py-2 text-sm font-medium bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors">
            Edit
          </button>
          <a
            href={getHref(card.url)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-4 py-2 text-center text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Open Link
          </a>
        </div>
      </div>
    </>
  )
}
