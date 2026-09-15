import { useState } from 'react'
import { ExternalLink, Copy, Check, Sparkles, Bookmark } from 'lucide-react'

/**
 * Parses inline markdown:
 * - **bold**
 * - *italic*
 * - `code`
 * - [label](url)
 * - (domain.com) or (https://...)
 */
export function renderInlineMarkdown(text) {
  if (!text) return ''

  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|\((?:https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})[^\s)]*\))/g
  const parts = text.split(regex)

  return parts.map((part, i) => {
    if (!part) return null

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} className="text-slate-300 not-italic font-medium">
          {part.slice(1, -1)}
        </em>
      )
    }

    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={i} className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }

    // Markdown link: [text](url)
    const mdLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (mdLinkMatch) {
      let url = mdLinkMatch[2]
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline font-medium"
        >
          <span>{mdLinkMatch[1]}</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )
    }

    // Parenthesized URL: (url)
    const parenUrlMatch = part.match(/^\(((?:https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})[^\s)]*)\)$/)
    if (parenUrlMatch) {
      let rawUrl = parenUrlMatch[1]
      let href = rawUrl
      if (!href.startsWith('http://') && !href.startsWith('https://')) {
        href = 'https://' + href
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 text-[11px] font-mono transition-colors ml-1 border border-blue-500/20"
          title={`Mở ${rawUrl}`}
        >
          <span className="truncate max-w-[140px]">{rawUrl.replace(/^https?:\/\//, '')}</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
        </a>
      )
    }

    return part
  })
}

/**
 * Renders full AI response with structured cards for bookmark summaries and markdown parsing
 */
export function AiMessageBubble({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.sender === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-xs px-4 py-2.5 text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_2px_12px_rgba(59,130,246,0.3)] leading-relaxed">
          {message.text}
        </div>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Split message into sections/items
  const rawText = message.text || ''
  
  // Parse paragraphs and structured items
  const lines = rawText.split('\n')
  const elements = []
  let currentItem = null

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) {
      if (currentItem) {
        elements.push({ type: 'bookmark-item', data: currentItem })
        currentItem = null
      }
      return
    }

    // Detect numbered item: e.g. "1. **Title** (url)" or "1. Title"
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (numberMatch) {
      if (currentItem) {
        elements.push({ type: 'bookmark-item', data: currentItem })
      }
      currentItem = {
        number: numberMatch[1],
        titleLine: numberMatch[2],
        noteLines: [],
      }
      return
    }

    // If we're inside a numbered item and this line is a note (e.g. "👉 *Note*" or bullet)
    if (currentItem) {
      currentItem.noteLines.push(trimmed)
      return
    }

    // Otherwise standard paragraph
    elements.push({ type: 'paragraph', text: trimmed })
  })

  if (currentItem) {
    elements.push({ type: 'bookmark-item', data: currentItem })
  }

  return (
    <div className="flex justify-start group">
      <div className="max-w-[92%] sm:max-w-[88%] rounded-2xl rounded-tl-xs p-3.5 bg-[#121624] border border-white/10 text-slate-200 text-xs shadow-xl space-y-2.5 relative">
        
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Sao chép câu trả lời"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>

        {elements.map((el, i) => {
          if (el.type === 'paragraph') {
            return (
              <p key={i} className="leading-relaxed text-slate-300">
                {renderInlineMarkdown(el.text)}
              </p>
            )
          }

          if (el.type === 'bookmark-item') {
            const { number, titleLine, noteLines } = el.data
            return (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] transition-colors space-y-1.5"
              >
                {/* Header with number and title */}
                <div className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] shrink-0 mt-0.5 border border-blue-500/30">
                    {number}
                  </span>
                  <div className="flex-1 min-w-0 leading-snug">
                    {renderInlineMarkdown(titleLine)}
                  </div>
                </div>

                {/* Notes & Description */}
                {noteLines.length > 0 && (
                  <div className="pl-7 space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    {noteLines.map((note, noteIdx) => (
                      <div key={noteIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0">👉</span>
                        <div className="flex-1">
                          {renderInlineMarkdown(note.replace(/^[👉\s*]+|[*\s]+$/g, ''))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
