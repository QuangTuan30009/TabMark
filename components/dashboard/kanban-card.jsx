import { useState } from 'react'
import {
  MoreVertical,
  ExternalLink,
  Sparkles,
  Trash2,
  Copy,
  Edit,
  Clock,
  FileText,
  CreditCard,
  Globe,
  Search,
  MessageSquare
} from 'lucide-react'

// Custom brand SVGs because newer versions of lucide-react do not export brand icons
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9" />
    </svg>
  )
}

function FigmaIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 1 1 7 0z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      <path d="M12 16h3.5a3.5 3.5 0 1 1 0 7H12v-7z" />
    </svg>
  )
}

function StackOverflowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 16H6v6h12v-6Z" />
      <path d="M9 13h6" />
      <path d="M9.3 10.4 15 12" />
      <path d="m10.1 7.7 5.2 3" />
      <path d="m11.7 5 4.3 4.1" />
      <path d="M14 2.5l2.9 5.2" />
    </svg>
  )
}

// Map URLs or icon labels to custom colored brand icons
function getBrandIcon(iconName, url) {
  const name = (iconName || '').toLowerCase()
  const urlLower = (url || '').toLowerCase()

  if (name === 'github' || urlLower.includes('github.com')) {
    return <GithubIcon className="w-4 h-4 text-white" />
  }
  if (name === 'youtube' || urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return <YoutubeIcon className="w-4 h-4 text-red-500 fill-red-500/10" />
  }
  if (name === 'figma' || urlLower.includes('figma.com')) {
    return <FigmaIcon className="w-4 h-4 text-pink-500" />
  }
  if (name === 'stackoverflow' || urlLower.includes('stackoverflow.com')) {
    return <StackOverflowIcon className="w-4 h-4 text-orange-400" />
  }
  if (name === 'googledoc' || urlLower.includes('docs.google.com') || urlLower.includes('team.com')) {
    return <FileText className="w-4 h-4 text-blue-400" />
  }
  if (name === 'stripe' || urlLower.includes('stripe.com')) {
    return <CreditCard className="w-4 h-4 text-indigo-400" />
  }
  if (name === 'chatgpt' || urlLower.includes('chatgpt.com') || urlLower.includes('openai.com')) {
    return <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
  }
  if (name === 'medium' || urlLower.includes('medium.com')) {
    return <FileText className="w-4 h-4 text-slate-200" />
  }
  if (name === 'search' || urlLower.includes('google.com') || urlLower.includes('seo.com')) {
    return <Search className="w-4 h-4 text-sky-400" />
  }
  if (name === 'vite' || urlLower.includes('vite.dev') || urlLower.includes('vitejs.dev')) {
    return <Globe className="w-4 h-4 text-violet-400" />
  }
  if (name === 'dribbble' || urlLower.includes('dribbble.com')) {
    return <Globe className="w-4 h-4 text-rose-400" />
  }

  return <Globe className="w-4 h-4 text-slate-400" />
}

export default function KanbanCard({
  card,
  columnKey,
  color = 'blue',
  tooltipDirection = 'right',
  onDragStart,
  onEdit,
  onDelete,
  onDuplicate
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showAISummary, setShowAISummary] = useState(false)

  // Map column colors for hover classes
  const hoverClassMap = {
    blue: 'card-hover-todo',
    green: 'card-hover-progress',
    orange: 'card-hover-review',
    purple: 'card-hover-done',
    pink: 'card-hover-done'
  }

  // Handle URL normalization
  const getHref = (url) => {
    if (!url) return '#'
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnKey)}
      className={`group relative p-4 bg-[#10141f] border border-white/[0.04] rounded-xl hover:border-white/10 cursor-grab active:cursor-grabbing transition-all duration-300 ${hoverClassMap[color] || ''}`}
    >
      {/* Card Header (Icon & Menu button) */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/5">
          {getBrandIcon(card.icon, card.url)}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-[#161b26] border border-white/5 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                <button
                  onClick={() => { setShowMenu(false); onEdit(card) }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDuplicate(card) }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDelete(card.id) }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors border-t border-white/5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Content */}
      <h4 className="font-bold text-sm text-white mb-1.5 leading-snug line-clamp-2 select-none">
        {card.title}
      </h4>

      <a
        href={getHref(card.url)}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-slate-500 hover:text-blue-400 mb-3.5 truncate flex items-center gap-1 group/link"
      >
        <span className="truncate">{card.url}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 flex-shrink-0 transition-opacity" />
      </a>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {card.tags && card.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block px-2.5 py-0.5 text-[10px] font-semibold bg-white/[0.02] border border-white/[0.04] rounded-full text-slate-400 select-none"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta Info & AI Sparkle Button */}
      <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold">{card.time || '5 min'}</span>
        </div>
        <button
          onMouseEnter={() => setShowAISummary(true)}
          onMouseLeave={() => setShowAISummary(false)}
          className="text-xs text-blue-400 hover:text-purple-400 transition-colors flex items-center gap-1 py-1 px-2 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:border-purple-500/20 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-blue-400/10" />
          <span className="font-semibold text-[10px]">AI</span>
        </button>
      </div>

      {/* Floating AI Summary Tooltip with Collision Avoidance */}
      {showAISummary && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-72 p-4 bg-[#0e121a]/95 backdrop-blur-md rounded-2xl z-50 pointer-events-none animate-fade-in-up text-xs leading-relaxed text-slate-300 ai-summary-glow ${
            tooltipDirection === 'left'
              ? 'right-[102%] mr-2'
              : 'left-[102%] ml-2'
          }`}
        >
          <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-2">
            <Sparkles className="w-4 h-4 fill-purple-400/20" />
            <span>AI Summary</span>
          </div>
          <p className="text-slate-300 text-xs font-medium">
            {card.note || 'Tóm tắt AI chưa được khởi tạo cho bookmark này.'}
          </p>
        </div>
      )}
    </div>
  )
}
