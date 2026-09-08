import { GoogleGenerativeAI } from '@google/generative-ai'
import { isSupabaseConfigured, supabase } from './supabaseClient'

const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'

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
      let systemInstruction = `Bạn là Tabmark AI, một trợ lý ảo thông minh được tích hợp trực tiếp trong ứng dụng quản lý bookmark Tabmark.\n`
      systemInstruction += `Nhiệm vụ của bạn là hỗ trợ người dùng quản lý, tìm kiếm, tóm tắt và sắp xếp các liên kết (bookmark).\n\n`

      if (contextBookmarks && contextBookmarks.length > 0) {
        systemInstruction += `Dưới đây là danh sách các bookmark hiện có trong kho mà người dùng đang mở làm ngữ cảnh (Context):\n`
        contextBookmarks.forEach((link, idx) => {
          systemInstruction += `- ${idx + 1}. Title: "${link.title}" | URL: "${link.url}" | Ghi chú: "${link.note || 'Không có'}" | Tags: [${(link.tags || []).join(', ')}]\n`
        })
        systemInstruction += `\nHãy sử dụng danh sách này để trả lời các câu hỏi liên quan (như tìm kiếm link phù hợp, tóm tắt nhóm link, giải thích nội dung, phân tích tags, v.v.).\n`
      } else {
        systemInstruction += `Nhóm bookmark hiện tại của người dùng đang trống. Hãy thân thiện hướng dẫn họ cách thêm bookmark hoặc hỏi xem có thể hỗ trợ gì khác.\n`
      }

      systemInstruction += `\nLưu ý:\n`
      systemInstruction += `1. Luôn trả lời bằng tiếng Việt một cách lịch sự, ngắn gọn và hữu ích.\n`
      systemInstruction += `2. Bạn có thể sử dụng markdown để định dạng câu trả lời (như in đậm, danh sách, bảng biểu, liên kết).\n`

      const chatModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
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
      return 'Hiện tại kho bookmark của bạn chưa có liên kết nào để tóm tắt.'
    }
    let res = `Dưới đây là tóm tắt nhanh các bookmark trong kho của bạn (${contextBookmarks.length} liên kết):\n\n`
    contextBookmarks.slice(0, 5).forEach((link, idx) => {
      res += `${idx + 1}. **${link.title}** (${link.url})\n   👉 *${link.note || 'Không có mô tả'}*\n\n`
    })
    if (contextBookmarks.length > 5) {
      res += `*Và ${contextBookmarks.length - 5} bookmark khác...*`
    }
    return res
  }

  if (qLower.includes('tìm') || qLower.includes('search') || qLower.includes('find')) {
    const term = qLower.replace(/tìm kiếm|tìm|search|find/g, '').trim()
    if (!term) return 'Bạn muốn tìm kiếm từ khóa nào? Hãy nhập ví dụ: "Tìm React".'
    
    const matched = contextBookmarks.filter(l => 
      (l.title || '').toLowerCase().includes(term) || 
      (l.url || '').toLowerCase().includes(term) ||
      ((l.tags || []).join(' ')).toLowerCase().includes(term)
    )

    if (matched.length === 0) {
      return `Không tìm thấy bookmark nào liên quan đến từ khóa **"${term}"**.`
    }
    let res = `Tìm thấy **${matched.length}** liên kết liên quan đến **"${term}"**:\n\n`
    matched.forEach((link, idx) => {
      res += `${idx + 1}. **${link.title}** (${link.url}) ${link.collectionName ? `*— trong nhóm ${link.collectionName}*` : ''}\n`
    })
    return res
  }

  return `Xin chào! Tôi là TabMark AI. Tôi đã ghi nhận câu hỏi của bạn: "${latestText}".\n\nBạn có thể bảo tôi: **"Tóm tắt các link"** hoặc **"Tìm [tên công nghệ/link]"** để tôi tìm kiếm ngay trong kho bookmark!`
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

