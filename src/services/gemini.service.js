import { GoogleGenerativeAI } from '@google/generative-ai'
import { isSupabaseConfigured, supabase } from '@/lib/supabase-client'

const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

export const isGeminiConfigured = isSupabaseConfigured || !!clientApiKey

let genAI = null
if (clientApiKey) {
  genAI = new GoogleGenerativeAI(clientApiKey)
}

/**
 * Trò chuyện với Gemini (Ưu tiên qua Supabase Edge Function bảo mật, fallback qua client SDK)
 * @param {Array<{sender: 'user'|'ai', text: string}>} messages - Lịch sử chat
 * @param {Array} contextBookmarks - Danh sách bookmark hiện tại
 */
export async function chatWithGemini(messages, contextBookmarks = []) {
  // 1. Thử gọi qua Supabase Edge Function (Bảo mật 100% không lộ key)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          action: 'chat',
          messages,
          contextBookmarks,
        },
      })
      if (!error && data?.result) {
        return data.result
      }
    } catch (e) {
      console.warn('Edge Function gemini-ai chưa kích hoạt, thử fallback client SDK...', e)
    }
  }

  // 2. Thử gọi qua Client SDK nếu có
  if (genAI) {
    try {
      let systemInstruction = `Bạn là TabMark AI, một người bạn đồng hành và trợ lý AI thông minh toàn diện (tương tự như ChatGPT, Claude hay Gemini).

PHONG CÁCH TRÒ CHUYỆN (CONVERSATIONAL STYLE):
- Trò chuyện tự nhiên, thân thiện, linh hoạt và thông minh như một người cộng sự thực thụ hoặc giữa các mô hình AI với nhau.
- KHÔNG BỊ GÒ BÓ THEO BẤT KỲ FORM/MẪU CỨNG NHẮC NÀO. Linh hoạt biến hóa theo ngữ cảnh câu chuyện: lúc đàm thoại nhẹ nhàng, lúc phân tích sâu, lúc phản biện hoặc thảo luận ý tưởng.
- Không tự ép mình phải dùng tiêu đề lớn hoặc danh sách gạch đầu dòng cứng nhắc trừ khi người dùng yêu cầu liệt kê.

ĐỌC LINK VÀ GỢI Ý Ý TƯỞNG:
- Bạn có khả năng tra cứu, đọc hiểu nội dung thực tế của các đường link trên internet.
- Khi người dùng hỏi về các đường link trong kho bookmark hoặc đưa link mới, hãy đọc hiểu nội dung, phân tích góc nhìn và chủ động gợi ý những ý tưởng sáng tạo, ứng dụng thực tế hoặc hướng kết hợp thú vị từ các tài nguyên đó.
- Sẵn sàng giải đáp mọi chủ đề khác (lập trình, công nghệ, cuộc sống, tư duy...) với chiều sâu và sự thấu cảm.

${contextBookmarks && contextBookmarks.length > 0 ? `KHO TÀI LIỆU/BOOKMARK CỦA NGƯỜI DÙNG (${contextBookmarks.length} liên kết):
${contextBookmarks.map((link, idx) => `${idx + 1}. [${link.title}](${link.url}) | Ghi chú: "${link.note || link.description || 'Không có'}" | Tags: [${(link.tags || []).join(', ')}]`).join('\n')}` : 'Kho bookmark hiện tại của người dùng đang trống.'}

Ngôn ngữ giao tiếp: Tiếng Việt tự nhiên, phong thái thông thái và cuốn hút.`

      const chatModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
        },
      })

      const history = []
      const historyInput = messages.slice(0, -1)
      const latestMessage = messages[messages.length - 1]

      let foundFirstUser = false
      historyInput.forEach((msg) => {
        if (msg.sender === 'user') {
          foundFirstUser = true
        }
        if (foundFirstUser) {
          history.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          })
        }
      })

      const chat = chatModel.startChat({
        history: history,
      })

      const result = await chat.sendMessage(latestMessage.text)
      const response = await result.response
      return response.text()
    } catch (err) {
      console.warn('Gemini chat error, fallback to smart rule engine:', err)
    }
  }

  // 3. Smart Search & Summary Rule Engine fallback khi chưa có API key hoặc key lỗi
  const latestText = messages[messages.length - 1]?.text || ''
  const qLower = latestText.toLowerCase()

  if (qLower.includes('tóm tắt') || qLower.includes('summarize')) {
    if (!contextBookmarks || contextBookmarks.length === 0) {
      return 'Hiện tại kho bookmark của bạn chưa có liên kết nào để tóm tắt. Hãy thêm bookmark mới để tôi hỗ trợ nhé!'
    }
    let res = `### 📋 Tóm tắt kho bookmark (${contextBookmarks.length} liên kết)\n\n`
    res += `Dưới đây là các liên kết nổi bật đang có trong bộ sưu tập của bạn:\n\n`
    contextBookmarks.slice(0, 8).forEach((link, idx) => {
      const note = link.note || link.description || 'Tài nguyên được lưu trữ trong không gian làm việc.'
      const tagStr = (link.tags && link.tags.length > 0) ? link.tags.map(t => `\`#${t.replace(/^#/, '')}\``).join(' ') : ''
      res += `${idx + 1}. **[${link.title}](${link.url})**\n   - ${note}${tagStr ? `\n   - ${tagStr}` : ''}\n\n`
    })
    if (contextBookmarks.length > 8) {
      res += `> *Còn ${contextBookmarks.length - 8} bookmark khác trong kho. Bạn có thể nhập "Tìm [từ khóa]" để lọc nhanh.*`
    }
    return res
  }

  if (qLower.includes('tìm') || qLower.includes('search') || qLower.includes('find')) {
    const term = qLower.replace(/tìm kiếm|tìm|search|find/g, '').trim()
    if (!term) return 'Bạn muốn tìm kiếm từ khóa nào? Hãy nhập ví dụ: "Tìm React" hoặc "Tìm công cụ design".'
    
    const matched = contextBookmarks.filter(l => 
      (l.title || '').toLowerCase().includes(term) || 
      (l.url || '').toLowerCase().includes(term) ||
      ((l.tags || []).join(' ')).toLowerCase().includes(term)
    )

    if (matched.length === 0) {
      return `Không tìm thấy bookmark nào liên quan đến từ khóa **"${term}"** trong nhóm hiện tại.`
    }
    let res = `### 🔍 Kết quả tìm kiếm cho "${term}" (${matched.length} liên kết)\n\n`
    matched.forEach((link, idx) => {
      const note = link.note || link.description || ''
      res += `${idx + 1}. **[${link.title}](${link.url})**\n${note ? `   - ${note}\n` : ''}\n`
    })
    return res
  }

  if (qLower.includes('gợi ý') || qLower.includes('hay') || qLower.includes('suggest') || qLower.includes('tài liệu')) {
    if (!contextBookmarks || contextBookmarks.length === 0) {
      return 'Kho bookmark của bạn đang trống, hãy thêm các link bạn yêu thích vào nhé!'
    }
    const sample = contextBookmarks.slice(0, 4)
    let res = `### 💡 Gợi ý tài nguyên nổi bật trong kho của bạn\n\n`
    sample.forEach((link, idx) => {
      res += `${idx + 1}. **[${link.title}](${link.url})**\n   - ${link.note || 'Tài liệu hữu ích nên tham khảo lại khi làm việc.'}\n\n`
    })
    return res
  }

  return `Xin chào! Tôi là **TabMark AI**.\n\nTôi có thể hỗ trợ bạn:\n- 📋 **"Tóm tắt nhóm"** — Xem tổng quan các liên kết trong kho\n- 🔍 **"Tìm [từ khóa]"** — Tra cứu bookmark theo chủ đề\n- 💡 **"Gợi ý tài liệu"** — Đề xuất liên kết hữu ích nhất`
}

/**
 * Tạo tóm tắt tự động cho một bookmark (Ưu tiên qua Supabase Edge Function)
 * @param {string} title 
 * @param {string} url 
 * @param {Array<string>} tags 
 */
export async function generateLinkSummary(title, url, tags = []) {
  // 1. Thử gọi qua Supabase Edge Function (Bảo mật 100%)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          action: 'summary',
          title,
          url,
          tags,
        },
      })
      if (!error && data?.result) {
        return data.result
      }
    } catch (e) {
      console.warn('Edge Function gemini-ai chưa kích hoạt, thử fallback client SDK...', e)
    }
  }

  // 2. Thử gọi qua Client SDK nếu có
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const prompt = `Hãy viết một đoạn tóm tắt siêu ngắn gọn và súc tích (chỉ từ 1 đến 2 câu, tối đa 120 ký tự) giới thiệu nội dung hoặc mục đích chính của liên kết này:\n- Tiêu đề: ${title}\n- URL: ${url}\n- Tags liên quan: ${tags.join(', ')}\n\nYêu cầu: Viết tự nhiên, chuyên nghiệp bằng tiếng Việt, tránh mở đầu rườm rà như "Trang web này là..." mà hãy đi thẳng vào vấn đề.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (err) {
      console.warn('Gemini generateContent error, using smart fallback summary:', err)
    }
  }

  // 3. Fallback tóm tắt thông minh nếu chưa có key hoặc key lỗi
  const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
  const tagStr = tags && tags.length > 0 ? ` thuộc chủ đề ${tags.slice(0, 2).join(', ')}` : ''
  return `Trang ${domain}: ${title || 'Tài liệu liên kết'}${tagStr}. Cung cấp thông tin và tài nguyên hữu ích.`
}

/**
 * Trích xuất Metadata thông minh bằng Gemini AI cho tính năng Add Link
 * @param {{ url: string, title?: string }} param0
 * @returns {Promise<{ title: string, tags: string[], note: string, icon: string, time: string }>}
 */
export async function extractLinkMetadataWithAI({ url, title = '' }) {
  // 1. Heuristic fallback nếu không có AI
  const domainMatch = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
  const domainName = domainMatch.split('.')[0] || 'Link'
  const fallbackTitle = title.trim() || domainName.charAt(0).toUpperCase() + domainName.slice(1)
  
  const fallbackResult = {
    title: fallbackTitle,
    tags: [domainName.toLowerCase(), 'bookmark'],
    note: `Liên kết được lưu từ ${domainMatch}`,
    icon: domainName.slice(0, 2).toUpperCase(),
    time: '3 min',
  }

  // 2. Thử gọi qua Supabase Edge Function nếu có
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          action: 'extract_metadata',
          url,
          title,
        },
      })
      if (!error && data?.result) {
        return {
          title: data.result.title || fallbackResult.title,
          tags: Array.isArray(data.result.tags) ? data.result.tags : fallbackResult.tags,
          note: data.result.note || fallbackResult.note,
          icon: data.result.icon || fallbackResult.icon,
          time: data.result.time || fallbackResult.time,
        }
      }
    } catch (e) {
      console.warn('Edge function metadata extract failed, trying client SDK...', e)
    }
  }

  // 3. Fallback sang Google Generative AI Client SDK
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const prompt = `Phân tích đường link sau và trả về thông tin dạng JSON:\nURL: "${url}"\nTiêu đề hiện tại (nếu có): "${title}"\n\nHãy sinh dữ liệu JSON theo đúng schema sau:\n{\n  "title": "Tiêu đề ngắn gọn, chuẩn xác của trang web (tối đa 40 ký tự)",\n  "tags": ["3 đến 5 tags tiếng Anh hoặc tiếng Việt liên quan nhất dạng chữ thường không dấu cách"],\n  "note": "Tóm tắt súc tích nội dung/mục đích trang web từ 1 đến 2 câu tiếng Việt (tối đa 100 ký tự)",\n  "icon": "2 ký tự viết hoa đại diện cho website hoặc tên icon (VD: RE, GH, GG, AI)",\n  "time": "Ước tính thời gian đọc (VD: 3 min, 5 min, 10 min)"\n}`

      const result = await model.generateContent(prompt)
      let text = result.response.text().trim()
      // Clean markdown code blocks if any
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
      const parsed = JSON.parse(text)
      return {
        title: parsed.title || fallbackResult.title,
        tags: Array.isArray(parsed.tags) ? parsed.tags : fallbackResult.tags,
        note: parsed.note || fallbackResult.note,
        icon: parsed.icon || fallbackResult.icon,
        time: parsed.time || fallbackResult.time,
      }
    } catch (err) {
      console.warn('Gemini metadata extraction fallback to heuristic:', err)
    }
  }

  // 4. Nếu không có key hoặc lỗi, trả về fallback thông minh
  return fallbackResult
}
