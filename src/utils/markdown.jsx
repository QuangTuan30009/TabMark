import { useState } from 'react'
import { ExternalLink, Copy, Check, Terminal } from 'lucide-react'

/**
 * Universal inline markdown tokenizer:
 * Handles:
 * - [Link Text](https://url)
 * - (https://url) or (domain.com/path)
 * - **bold**
 * - *italic*
 * - `inline code`
 * - raw https://... URLs
 */
export function renderInlineMarkdown(text) {
  if (!text) return ''

  // Matches:
  // 1. Markdown link: [text](url)
  // 2. Bold: **text**
  // 3. Italic: *text*
  // 4. Code: `text`
  // 5. Parenthesized URL: (https://... or domain.com/...)
  // 6. Raw standalone URL: https?://\S+
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`|\((?:https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})[^\s)]*\)|https?:\/\/[^\s]+)/g
  const parts = text.split(regex)

  return parts.map((part, i) => {
    if (!part) return null

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
          className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors group/link"
        >
          <span>{mdLinkMatch[1]}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/link:opacity-100 transition-opacity shrink-0" />
        </a>
      )
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2)
      return (
        <strong key={i} className="font-bold text-white">
          {renderInlineMarkdown(inner)}
        </strong>
      )
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1)
      return (
        <em key={i} className="text-slate-300 not-italic font-normal">
          {renderInlineMarkdown(inner)}
        </em>
      )
    }

    // Inline Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={i} className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-white/5">
          {part.slice(1, -1)}
        </code>
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
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 hover:text-blue-300 text-[11px] font-mono transition-colors border border-blue-500/20 ml-1"
        >
          <span className="truncate max-w-[130px]">{rawUrl.replace(/^https?:\/\//, '')}</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
        </a>
      )
    }

    // Standalone raw URL: https://...
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline text-[11px] font-mono"
        >
          <span className="truncate max-w-[160px]">{part.replace(/^https?:\/\//, '')}</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
        </a>
      )
    }

    return part
  })
}

/**
 * Code Block component with Copy button
 */
export function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2 rounded-xl bg-[#07090f] border border-white/10 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/5 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-cyan-200 text-[11px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
