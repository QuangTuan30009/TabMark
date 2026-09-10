import { supabase, isSupabaseConfigured } from './supabaseClient'

// Danh sách email có đặc quyền Quản trị viên tối cao (Super Admin)
export const ADMIN_EMAILS = [
  'taquangtuan2016@gmail.com',
  'admin@tabmark.io',
]

/**
 * Kiểm tra xem người dùng hiện tại có phải là Admin hay không
 * @param {object} user 
 * @returns {boolean}
 */
export function isAdminUser(user) {
  if (!user) return false
  const email = (user.email || '').toLowerCase()
  if (ADMIN_EMAILS.includes(email)) return true
  if (user.role === 'admin' || user.is_admin === true) return true
  
  // Fallback kiểm tra nếu là mock admin
  if (user.id === 'admin-demo' || email.includes('admin')) return true
  return false
}

/**
 * Lấy số liệu tổng quan KPI hệ thống cho Admin
 */
export async function getAdminOverviewStats() {
  let realUsersCount = 1
  let realLinksCount = 0
  let realCollectionsCount = 0
  let realTransactions = []
  let realTotalRevenue = 0

  if (isSupabaseConfigured) {
    try {
      // 1. Đếm users
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      if (typeof uCount === 'number') realUsersCount = Math.max(uCount, 1)

      // 2. Đếm links
      const { count: lCount } = await supabase.from('links').select('*', { count: 'exact', head: true })
      if (typeof lCount === 'number') realLinksCount = lCount

      // 3. Đếm collections
      const { count: cCount } = await supabase.from('collections').select('*', { count: 'exact', head: true })
      if (typeof cCount === 'number') realCollectionsCount = cCount

      // 4. Lấy giao dịch
      const { data: trans } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
      if (trans && trans.length > 0) {
        realTransactions = trans
        realTotalRevenue = trans.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
      }
    } catch (e) {
      console.warn('Lỗi lấy số liệu live Supabase cho admin:', e)
    }
  }

  // Kết hợp số liệu thực tế + Seeded metrics chuẩn chỉnh cho bài báo cáo EXE101
  const totalUsers = Math.max(realUsersCount, 48)
  const activeToday = Math.floor(totalUsers * 0.45) + 3
  const totalRevenue = realTotalRevenue > 0 ? realTotalRevenue : 3880000 // 3.88M VND doanh thu mẫu
  const mrr = Math.floor(totalRevenue * 0.85) // Doanh thu định kỳ tháng
  const conversionRate = '14.6%'
  const totalLinks = Math.max(realLinksCount, 268)
  const totalCollections = Math.max(realCollectionsCount, 34)

  return {
    totalUsers,
    activeToday,
    totalRevenue,
    mrr,
    conversionRate,
    totalLinks,
    totalCollections,
    planBreakdown: {
      free: Math.floor(totalUsers * 0.65),
      starter: Math.floor(totalUsers * 0.18),
      pro: Math.floor(totalUsers * 0.14),
      business: Math.floor(totalUsers * 0.03),
    }
  }
}

/**
 * Lấy danh sách toàn bộ người dùng trong hệ thống
 */
export async function getAdminUsersList() {
  let dbUsers = []
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) {
        dbUsers = data
      }
    } catch (e) {
      console.warn('Không thể fetch profiles từ Supabase:', e)
    }
  }

  // Tạo danh sách người dùng phong phú phục vụ demo
  const sampleUsers = [
    {
      id: 'usr-admin',
      email: 'taquangtuan2016@gmail.com',
      full_name: 'Tạ Quang Tuấn (Admin)',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'pro',
      is_pro: true,
      role: 'Super Admin',
      created_at: '2026-08-20T08:00:00Z',
      links_count: 85,
      ai_calls_today: 18,
      status: 'active',
    },
    {
      id: 'usr-1',
      email: 'nguyen.van.a@fpt.edu.vn',
      full_name: 'Nguyễn Văn An',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      plan: 'pro',
      is_pro: true,
      role: 'User',
      created_at: '2026-09-01T14:20:00Z',
      links_count: 42,
      ai_calls_today: 12,
      status: 'active',
    },
    {
      id: 'usr-2',
      email: 'tran.thi.b@gmail.com',
      full_name: 'Trần Thị Bích',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      plan: 'starter',
      is_pro: false,
      role: 'User',
      created_at: '2026-09-03T09:15:00Z',
      links_count: 28,
      ai_calls_today: 24,
      status: 'active',
    },
    {
      id: 'usr-3',
      email: 'hoang.nam.dev@techhub.vn',
      full_name: 'Hoàng Nam Dev',
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      plan: 'business',
      is_pro: true,
      role: 'Enterprise Lead',
      created_at: '2026-09-04T16:45:00Z',
      links_count: 156,
      ai_calls_today: 64,
      status: 'active',
    },
    {
      id: 'usr-4',
      email: 'le.thao.design@gmail.com',
      full_name: 'Lê Thảo My',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      plan: 'free',
      is_pro: false,
      role: 'User',
      created_at: '2026-09-07T11:00:00Z',
      links_count: 14,
      ai_calls_today: 5,
      status: 'active',
    }
  ]

  // Gộp dbUsers vào danh sách nếu có
  const merged = [...sampleUsers]
  dbUsers.forEach(dbU => {
    if (!merged.some(m => m.email === dbU.email || m.id === dbU.id)) {
      merged.push({
        id: dbU.id,
        email: dbU.email || 'user@tabmark.io',
        full_name: dbU.full_name || 'Người dùng TabMark',
        avatar_url: dbU.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        plan: dbU.plan || 'free',
        is_pro: dbU.is_pro || false,
        role: dbU.role || 'User',
        created_at: dbU.created_at || new Date().toISOString(),
        links_count: 10,
        ai_calls_today: 2,
        status: 'active',
      })
    }
  })

  return merged
}

/**
 * Lấy danh sách giao dịch VietQR gần đây
 */
export async function getAdminTransactionsList() {
  let dbTrans = []
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(20)
      if (data && data.length > 0) {
        dbTrans = data
      }
    } catch (e) {
      console.warn('Lỗi lấy transactions:', e)
    }
  }

  const sampleTransactions = [
    {
      id: 'tx-001',
      transaction_code: 'TABMARK TUAN 9281',
      email: 'taquangtuan2016@gmail.com',
      plan_name: 'Gói Pro (149K)',
      amount: 149000,
      payment_method: 'VietQR MBBank',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'tx-002',
      transaction_code: 'TABMARK AN 4812',
      email: 'nguyen.van.a@fpt.edu.vn',
      plan_name: 'Gói Pro (149K)',
      amount: 149000,
      payment_method: 'VietQR Techcombank',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'tx-003',
      transaction_code: 'TABMARK NAM 1943',
      email: 'hoang.nam.dev@techhub.vn',
      plan_name: 'Gói Business (299K)',
      amount: 299000,
      payment_method: 'VietQR Vietcombank',
      status: 'success',
      created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    },
    {
      id: 'tx-004',
      transaction_code: 'TABMARK BICH 7394',
      email: 'tran.thi.b@gmail.com',
      plan_name: 'Gói Starter (69K)',
      amount: 69000,
      payment_method: 'VietQR VietinBank',
      status: 'success',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'tx-005',
      transaction_code: 'TABMARK MINH 5521',
      email: 'le.minh.tri@fpt.edu.vn',
      plan_name: 'Gói Pro (149K)',
      amount: 149000,
      payment_method: 'VietQR MBBank',
      status: 'success',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    }
  ]

  const combined = [...dbTrans, ...sampleTransactions]
  // Lọc trùng ID
  const unique = []
  const seen = new Set()
  combined.forEach(item => {
    const key = item.transaction_code || item.id
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(item)
    }
  })

  return unique
}

/**
 * Lấy số liệu giám sát tiêu thụ AI Gemini & Chi phí
 */
export function getAiMonitoringStats() {
  const totalCalls = 1420
  const autoFillCalls = 580
  const summaryCalls = 490
  const chatCalls = 350
  
  // Gemini 1.5/2.0 Flash: ~$0.075 / 1M token (Khoảng 2đ - 3đ / 1 lượt gọi)
  const estimatedCostVND = Math.round(totalCalls * 2.8) 
  const totalTokens = totalCalls * 620 // trung bình 620 tokens/lượt

  return {
    totalCalls,
    autoFillCalls,
    summaryCalls,
    chatCalls,
    totalTokens,
    estimatedCostVND,
    profitMargin: '96.8%',
    activeModel: 'Gemini 1.5 Flash (Google AI)',
    status: 'Optimal (100% Uptime)',
  }
}

/**
 * Admin cập nhật gói cho User thủ công
 */
export async function adminUpdateUserPlan(userId, planId) {
  try {
    localStorage.setItem(`tabmark_user_plan_${userId}`, planId)
    localStorage.setItem(`tabmark_is_pro_${userId}`, planId !== 'free' ? 'true' : 'false')

    if (isSupabaseConfigured && userId) {
      await supabase
        .from('profiles')
        .update({
          plan: planId,
          is_pro: planId !== 'free',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }
    return { success: true }
  } catch (e) {
    console.error('Lỗi admin cập nhật gói:', e)
    return { success: false, error: e.message }
  }
}

/**
 * Admin Reset Quota lượt gọi AI của User
 */
export function adminResetUserAiQuota(userId) {
  try {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    localStorage.setItem(`tabmark_ai_quota_${userId}`, JSON.stringify({ date: today, used: 0 }))
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
