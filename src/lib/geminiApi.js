import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

export const isGeminiConfigured = !!apiKey

let genAI = null
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey)
}

/**
 * Trò chuyện với Gemini sử dụng lịch sử tin nhắn và ngữ cảnh các bookmarks hiện tại
 * @param {Array<{sender: 'user'|'ai', text: string}>} messages - Lịch sử chat
 * @param {Array} contextBookmarks - Danh sách bookmark hiện tại
 */
export async function chatWithGemini(messages, contextBookmarks = []) {
  if (!genAI) {
    throw new Error('Gemini API Key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env')
  }

  let systemInstruction = `Bạn là Tabmark AI, một trợ lý ảo thông minh được tích hợp trực tiếp trong ứng dụng quản lý bookmark Tabmark.\n`
  systemInstruction += `Nhiệm vụ của bạn là hỗ trợ người dùng quản lý, tìm kiếm, tóm tắt và sắp xếp các liên kết (bookmark).\n\n`

  if (contextBookmarks && contextBookmarks.length > 0) {
    systemInstruction += `Dưới đây là danh sách các bookmark hiện có trong nhóm mà người dùng đang mở làm ngữ cảnh (Context):\n`
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

  // Gemini SDK chat expects history format: { role: 'user' | 'model', parts: [{ text: '...' }] }
  const history = []
  const historyInput = messages.slice(0, -1) // Bỏ tin nhắn mới nhất
  const latestMessage = messages[messages.length - 1] // Tin nhắn mới nhất

  // Lịch sử chat của Gemini bắt buộc phải bắt đầu bằng tin nhắn của 'user' (role: 'user').
  // Do đó ta sẽ bỏ qua tin nhắn chào mừng ban đầu của AI (nếu có).
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
}

/**
 * Tạo tóm tắt tự động cho một bookmark dựa trên thông tin Title, URL và Tags
 * @param {string} title 
 * @param {string} url 
 * @param {Array<string>} tags 
 */
export async function generateLinkSummary(title, url, tags = []) {
  if (!genAI) {
    throw new Error('Gemini API Key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env')
  }

  const model = genAI.getGenerativeModel({ model: modelName })
  const prompt = `Hãy viết một đoạn tóm tắt siêu ngắn gọn và súc tích (chỉ từ 1 đến 2 câu, tối đa 120 ký tự) giới thiệu nội dung hoặc mục đích chính của liên kết này:\n- Tiêu đề: ${title}\n- URL: ${url}\n- Tags liên quan: ${tags.join(', ')}\n\nYêu cầu: Viết tự nhiên, chuyên nghiệp bằng tiếng Việt, tránh mở đầu rườm rà như "Trang web này là..." mà hãy đi thẳng vào vấn đề.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text().trim()
}
