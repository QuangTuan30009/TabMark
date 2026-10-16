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
  Check,
  ArrowUp,
  ArrowDown,
  Share2
} from 'lucide-react'

// High-res Favicon resolver with fallback
function BrandFavicon({ url, title, icon, className = 'w-4 h-4' }) {
  const [hasError, setHasError] = useState(false)

  const getDomain = (rawUrl) => {
    try {
      if (!rawUrl) return ''
      const clean = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
      return new URL(clean).hostname.replace(/^www\./i, '')
    } catch {
      return ''
    }
  }

  const domain = getDomain(url)

  // 1. Nếu có Icon / Emoji tùy chỉnh do người dùng tự đặt
  const isCustomIcon = icon && typeof icon === 'string' && icon.trim() && icon !== 'BM' && icon !== 'sparkles'
  if (isCustomIcon) {
    return (
      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-cyan-500/30 border border-cyan-400/30 flex items-center justify-center text-[10px] font-black text-cyan-200 shrink-0 shadow-sm select-none">
        {icon}
      </div>
    )
  }

  if (!domain || hasError) {
    return (
      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/15 flex items-center justify-center text-[10px] font-black text-cyan-300 shrink-0 shadow-inner select-none">
        {icon || (title ? title.slice(0, 2).toUpperCase() : '🔗')}
      </div>
    )
  }

  return (
    <div className="w-5 h-5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
        alt={domain}
        className={`${className} object-contain rounded-sm`}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  )
}

// Gradient themes for thumbnail banners when screenshot image is not present
const bannerGradients = [
  'from-blue-900/40 via-indigo-950/50 to-[#0b0e14]',
  'from-violet-900/40 via-purple-950/50 to-[#0b0e14]',
  'from-cyan-900/40 via-slate-950/50 to-[#0b0e14]',
  'from-emerald-900/40 via-teal-950/50 to-[#0b0e14]',
  'from-rose-900/40 via-slate-950/50 to-[#0b0e14]',
]

export default function KanbanCard({
  card,
  columnKey,
  color = 'blue',
  tooltipDirection = 'right',
  onDragStart,
  onDropOnCard,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  onShareCard,
  onEdit,
  onDelete,
  onDuplicate,
  onGenerateSummary
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleAIClick = async (e) => {
    e.stopPropagation()
    if (!onGenerateSummary) return
    setIsGenerating(true)
    try {
      await onGenerateSummary(card)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = (e) => {
    e.stopPropagation()
    if (card.url) {
      navigator.clipboard.writeText(card.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getHref = (url) => {
    if (!url) return '#'
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
  }

  const canDrag = !!onDragStart
  const gradientIndex = (card.title?.length || 0) % bannerGradients.length

  return (
    <div
      draggable={canDrag}
      onDragStart={(e) => {
        if (canDrag) {
          e.stopPropagation()
          onDragStart(e, card.id, columnKey)
        }
      }}
      onDragOver={(e) => {
        if (canDrag) {
          e.preventDefault()
          e.stopPropagation()
          setIsDragOver(true)
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (canDrag) {
          e.preventDefault()
          e.stopPropagation()
          setIsDragOver(false)
          if (onDropOnCard) {
            onDropOnCard(e, columnKey, card.id)
          }
        }
      }}
      className={`group relative ${showMenu ? 'z-30' : 'z-0'} rounded-2xl bg-[#0e1320] border transition-all duration-200 ${
        isDragOver
          ? 'border-cyan-400 ring-2 ring-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]'
          : 'border-white/[0.06] hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      } ${canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      {/* ── TOP THUMBNAIL BANNER (Concept 1 Style) ── */}
      <div className="relative h-28 w-full border-b border-white/[0.04]">
        {/* Clipped background layers only */}
        <div className={`absolute inset-0 overflow-hidden rounded-t-2xl bg-gradient-to-br ${bannerGradients[gradientIndex]}`}>
          {/* Subtle grid pattern inside banner */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
        </div>
        
        {/* Top Banner Bar: Favicon Pill + Action Menu */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15 shadow-md">
            <BrandFavicon url={card.url} title={card.title} icon={card.icon} className="w-4 h-4" />
            <span className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">
              {card.url ? new URL(getHref(card.url)).hostname.replace(/^www\./i, '') : 'link'}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-black/60 transition-all cursor-pointer"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#121724]/95 border border-white/15 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 py-1.5 backdrop-blur-xl animate__animated animate__fadeIn animate__faster">
                  <a
                    href={getHref(card.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mở liên kết</span>
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Đã sao chép!' : 'Sao chép link'}</span>
                  </button>

                  {/* Quick Reorder Buttons */}
                  {canMoveUp && onMoveUp && (
                    <button
                      onClick={() => { setShowMenu(false); onMoveUp() }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Di chuyển lên</span>
                    </button>
                  )}
                  {canMoveDown && onMoveDown && (
                    <button
                      onClick={() => { setShowMenu(false); onMoveDown() }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Di chuyển xuống</span>
                    </button>
                  )}

                  {onShareCard && (
                    <button
                      onClick={() => { setShowMenu(false); onShareCard(card) }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Chia sẻ bookmark này</span>
                    </button>
                  )}

                  {onEdit && (
                    <button
                      onClick={() => { setShowMenu(false); onEdit(card) }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      <span>Chỉnh sửa</span>
                    </button>
                  )}
                  {onDuplicate && (
                    <button
                      onClick={() => { setShowMenu(false); onDuplicate(card) }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      <span>Nhân bản link</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => { setShowMenu(false); onDelete(card.id) }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors border-t border-white/10 cursor-pointer mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Xóa bookmark</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Banner Decorative Title Preview */}
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
          <span className="text-xs font-bold text-white/90 drop-shadow-md truncate max-w-[190px]">
            {card.title}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{card.time || '5 min'}</span>
          </div>
        </div>
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-4 space-y-3">
        {/* Title Row with Brand Logo */}
        <div className="flex items-start gap-2.5">
          <BrandFavicon url={card.url} title={card.title} icon={card.icon} className="w-5 h-5" />
          <h4 className="font-bold text-sm text-white leading-snug line-clamp-2 select-none group-hover:text-blue-400 transition-colors flex-1">
            {card.title}
          </h4>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {card.tags && card.tags.length > 0 ? (
            card.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[10px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-md text-slate-300 select-none transition-colors"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-500 italic">No tags</span>
          )}
        </div>

        {/* ── AI SUMMARY EMBEDDED BOX (Concept 1 Pillar Feature) ── */}
        <div
          onClick={handleAIClick}
          className="relative p-3 rounded-xl bg-cyan-950/20 hover:bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group/ai shadow-[0_0_15px_rgba(6,182,212,0.05)]"
          title="Click để tóm tắt hoặc cập nhật bằng AI"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-[10px] uppercase tracking-wider">
              <Sparkles className={`w-3 h-3 text-cyan-400 fill-cyan-400/20 ${isGenerating ? 'animate-spin text-purple-400' : ''}`} />
              <span>✦ AI SUMMARY</span>
            </div>
            {isGenerating && (
              <span className="text-[10px] text-cyan-300 animate-pulse font-medium">Đang tóm tắt...</span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-normal">
            {card.note ? card.note : 'Chưa có tóm tắt. Bấm để AI phân tích link này...'}
          </p>
        </div>

        {/* ── QUICK ACTION BAR (1-Tap Fast Access) ── */}
        <div className="pt-1 flex items-center justify-between gap-2 border-t border-white/[0.04]">
          <a
            href={getHref(card.url)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-xs font-semibold text-blue-300 hover:text-blue-200 border border-blue-500/20 transition-all touch-press"
          >
            <ExternalLink className="w-3 h-3 text-blue-400" />
            <span>Mở link</span>
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/[0.06] transition-all touch-press cursor-pointer"
            title="Sao chép URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span className="text-[11px]">{copied ? 'Đã copy' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
