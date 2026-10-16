import { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'
import { renderInlineMarkdown, CodeBlock } from '@/utils/markdown'

export { renderInlineMarkdown }

/**
 * Universal AI Chat Message Component
 * Parses headings, lists, code blocks, quote blocks, cards, and rich text
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

  const handleCopyAll = () => {
    navigator.clipboard.writeText(message.text || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Parse markdown blocks
  const raw = message.text || ''
  const rawLines = raw.split('\n')

  const blocks = []
  let i = 0

  while (i < rawLines.length) {
    const line = rawLines[i]
    const trimmed = line.trim()

    // 1. Code Block: ```lang
    if (trimmed.startsWith('```')) {
      const lang = trimmed.replace(/^```/, '').trim()
      const codeLines = []
      i++
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i])
        i++
      }
      blocks.push({ type: 'code', language: lang, code: codeLines.join('\n') })
      i++
      continue
    }

    // 2. Blank line
    if (!trimmed) {
      i++
      continue
    }

    // 3. Headings: ###, ##, #
    if (trimmed.startsWith('#')) {
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/)
      if (headingMatch) {
        blocks.push({
          type: 'heading',
          level: headingMatch[1].length,
          text: headingMatch[2],
        })
        i++
        continue
      }
    }

    // 4. Blockquote: > Quote
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '')
      blocks.push({ type: 'quote', text: quoteText })
      i++
      continue
    }

    // 5. Numbered item: e.g. "1. **[Title](url)**" or "1. Title"
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (numberMatch) {
      const itemNumber = numberMatch[1]
      const itemTitle = numberMatch[2]
      const subNotes = []
      i++
      // Gather sub-bullets belonging to this numbered item
      while (i < rawLines.length) {
        const nextLine = rawLines[i].trim()
        if (!nextLine) break
        if (nextLine.match(/^(\d+)\.\s+/)) break // next numbered item
        if (nextLine.startsWith('#')) break
        if (nextLine.startsWith('```')) break

        // Bullet point under this item
        if (nextLine.startsWith('- ') || nextLine.startsWith('* ') || nextLine.startsWith('👉')) {
          subNotes.push(nextLine.replace(/^[-*👉\s]+/, ''))
        } else {
          subNotes.push(nextLine)
        }
        i++
      }
      blocks.push({
        type: 'numbered-item',
        number: itemNumber,
        title: itemTitle,
        notes: subNotes,
      })
      continue
    }

    // 6. Bullet point: - item or * item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({
        type: 'bullet',
        text: trimmed.replace(/^[-*]\s+/, ''),
      })
      i++
      continue
    }

    // 7. General Paragraph
    blocks.push({ type: 'paragraph', text: trimmed })
    i++
  }

  return (
    <div className="flex justify-start group">
      <div className="max-w-[94%] sm:max-w-[90%] rounded-2xl rounded-tl-xs p-4 bg-[#101422] border border-white/10 text-slate-200 text-xs shadow-xl space-y-3 relative">
        
        {/* Copy Response Button */}
        <button
          type="button"
          onClick={handleCopyAll}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Sao chép câu trả lời"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {blocks.map((b, idx) => {
          // Code Block
          if (b.type === 'code') {
            return <CodeBlock key={idx} code={b.code} language={b.language} />
          }

          // Heading
          if (b.type === 'heading') {
            return (
              <div key={idx} className="pt-1 pb-0.5">
                <h4 className="font-bold text-white text-[13px] tracking-tight flex items-center gap-1.5 border-b border-white/5 pb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{renderInlineMarkdown(b.text)}</span>
                </h4>
              </div>
            )
          }

          // Blockquote
          if (b.type === 'quote') {
            return (
              <div key={idx} className="border-l-2 border-purple-500/50 bg-purple-500/5 px-3 py-2 rounded-r-xl text-slate-300 italic text-[11px] leading-relaxed">
                {renderInlineMarkdown(b.text)}
              </div>
            )
          }

          // Numbered Item (Bookmark Card)
          if (b.type === 'numbered-item') {
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all space-y-1.5 shadow-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[11px] shrink-0 mt-0.5 border border-blue-500/30">
                    {b.number}
                  </span>
                  <div className="flex-1 min-w-0 font-medium text-slate-200 leading-snug">
                    {renderInlineMarkdown(b.title)}
                  </div>
                </div>

                {b.notes.length > 0 && (
                  <div className="pl-7 space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    {b.notes.map((note, noteIdx) => (
                      <div key={noteIdx} className="flex items-start gap-1.5">
                        <span className="text-slate-500 mt-0.5 shrink-0">•</span>
                        <div className="flex-1">
                          {renderInlineMarkdown(note)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          // Bullet point
          if (b.type === 'bullet') {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  {renderInlineMarkdown(b.text)}
                </div>
              </div>
            )
          }

          // Paragraph
          return (
            <p key={idx} className="leading-relaxed text-slate-300">
              {renderInlineMarkdown(b.text)}
            </p>
          )
        })}
      </div>
    </div>
  )
}
