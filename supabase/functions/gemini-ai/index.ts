// Supabase Edge Function: gemini-ai
// Endpoint: https://<project-ref>.supabase.co/functions/v1/gemini-ai
// Bảo mật: API Key được lưu trong Supabase Secrets (GEMINI_API_KEY), không bao giờ lộ ra client!

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1'

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '*'
  const envAllowed = Deno.env.get('ALLOWED_ORIGINS')
  const allowedOrigins = envAllowed ? envAllowed.split(',').map((o: string) => o.trim()) : []

  // Nếu cấu hình ALLOWED_ORIGINS trong Supabase Secrets, kiểm tra whitelist; hỗ trợ Chrome extension và localhost khi dev
  const isAllowed =
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(origin) ||
    origin.startsWith('chrome-extension://') ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1')

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : (allowedOrigins[0] || '*'),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY chưa được thiết lập trong Supabase Secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, messages, contextBookmarks, title, url, tags } = await req.json()
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // 1. Tóm tắt bookmark đơn lẻ
    if (action === 'summary') {
      const prompt = `Hãy viết một đoạn tóm tắt siêu ngắn gọn và súc tích (chỉ từ 1 đến 2 câu, tối đa 120 ký tự) giới thiệu nội dung hoặc mục đích chính của liên kết này:\n- Tiêu đề: ${title}\n- URL: ${url}\n- Tags liên quan: ${(tags || []).join(', ')}\n\nYêu cầu: Viết tự nhiên, chuyên nghiệp bằng tiếng Việt, đi thẳng vào vấn đề.`
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      return new Response(JSON.stringify({ result: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Trò chuyện (Chat AI) với danh sách bookmarks
    if (action === 'chat') {
      let systemInstruction = `Bạn là Tabmark AI, trợ lý AI thông minh toàn diện tương tự như ChatGPT/Claude.\n`
      systemInstruction += `Phong cách: Trò chuyện tự nhiên, linh hoạt, thân thiện như giữa các mô hình AI hoặc đồng nghiệp với nhau. Không bị gò bó theo bất kỳ form hay khung mẫu cứng nhắc nào.\n`
      systemInstruction += `Bạn có khả năng tra cứu, đọc hiểu nội dung của các đường link trên web để gợi ý ý tưởng sáng tạo, sâu sắc từ các liên kết đó.\n`
      if (contextBookmarks && contextBookmarks.length > 0) {
        systemInstruction += `Kho bookmark hiện tại của người dùng:\n`
        contextBookmarks.forEach((link: any, idx: number) => {
          systemInstruction += `- ${idx + 1}. Title: "${link.title}" | URL: "${link.url}" | Ghi chú: "${link.note || ''}" | Tags: [${(link.tags || []).join(', ')}]\n`
        })
      }
      systemInstruction += `\nTrả lời bằng tiếng Việt tự nhiên, có chiều sâu.`

      const chatModel = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
        tools: [{ googleSearch: {} }],
      })

      const history: any[] = []
      const historyInput = (messages || []).slice(0, -1)
      const latestMessage = messages[messages.length - 1]

      let foundFirst = false
      historyInput.forEach((msg: any) => {
        if (msg.sender === 'user') foundFirst = true
        if (foundFirst) {
          history.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          })
        }
      })

      const chat = chatModel.startChat({ history })
      const result = await chat.sendMessage(latestMessage.text)
      const text = result.response.text()

      return new Response(JSON.stringify({ result: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Hành động (action) không hợp lệ' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
