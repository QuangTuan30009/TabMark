// Định nghĩa hạn mức theo từng gói (Lượt gọi AI / ngày)
export const PLAN_AI_LIMITS = {
  free: {
    name: 'Gói Miễn Phí',
    dailyLimit: 5,
    isUnlimited: false,
  },
  starter: {
    name: 'Gói Starter (69K)',
    dailyLimit: 50,
    isUnlimited: false,
  },
  pro: {
    name: 'Gói Pro (149K)',
    dailyLimit: Infinity,
    isUnlimited: true,
  },
  business: {
    name: 'Gói Business (299K)',
    dailyLimit: Infinity,
    isUnlimited: true,
  },
}

/**
 * Lấy mã gói hiện tại của user (mặc định 'free')
 */
export function getUserPlanKey(user) {
  const userId = user?.id || 'mock'
  let storedPlan = ''
  try {
    storedPlan = localStorage.getItem(`tabmark_user_plan_${userId}`) || ''
  } catch (e) {}

  const plan = (user?.plan || storedPlan || '').toLowerCase()
  if (plan.includes('business') || storedPlan.includes('business')) return 'business'
  if (plan.includes('pro') || user?.is_pro || storedPlan.includes('pro')) return 'pro'
  if (plan.includes('starter') || storedPlan.includes('starter')) return 'starter'
  return 'free'
}

/**
 * Lấy key ngày hiện tại (YYYY-MM-DD) theo múi giờ địa phương
 */
export function getTodayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Lấy thông tin hạn mức và số lượt đã dùng hôm nay
 */
export function getAiQuota(user) {
  const planKey = getUserPlanKey(user)
  const planConfig = PLAN_AI_LIMITS[planKey] || PLAN_AI_LIMITS.free
  
  if (planConfig.isUnlimited) {
    return {
      planKey,
      planName: planConfig.name,
      dailyLimit: Infinity,
      usedToday: 0,
      remaining: Infinity,
      isUnlimited: true,
      canUse: true,
    }
  }

  const userId = user?.id || 'anonymous_user'
  const today = getTodayKey()
  const storageKey = `tabmark_ai_quota_${userId}`

  let quotaData = { date: today, used: 0 }
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.date === today && typeof parsed.used === 'number') {
        quotaData = parsed
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc quota từ localStorage:', e)
  }

  const remaining = Math.max(0, planConfig.dailyLimit - quotaData.used)
  const canUse = remaining > 0

  return {
    planKey,
    planName: planConfig.name,
    dailyLimit: planConfig.dailyLimit,
    usedToday: quotaData.used,
    remaining,
    isUnlimited: false,
    canUse,
  }
}

/**
 * Tiêu thụ 1 lượt dùng AI.
 * Trả về { success: true, remaining } nếu thành công.
 * Trả về { success: false, remaining: 0, error: 'QUOTA_EXCEEDED' } nếu hết hạn mức.
 */
export function consumeAiQuota(user) {
  const quota = getAiQuota(user)
  
  if (quota.isUnlimited) {
    return { success: true, remaining: Infinity, isUnlimited: true }
  }

  if (!quota.canUse) {
    return { success: false, remaining: 0, isUnlimited: false, error: 'QUOTA_EXCEEDED' }
  }

  const userId = user?.id || 'anonymous_user'
  const today = getTodayKey()
  const storageKey = `tabmark_ai_quota_${userId}`

  const newUsed = quota.usedToday + 1
  try {
    localStorage.setItem(storageKey, JSON.stringify({ date: today, used: newUsed }))
  } catch (e) {
    console.warn('Lỗi lưu quota vào localStorage:', e)
  }

  return {
    success: true,
    remaining: Math.max(0, quota.dailyLimit - newUsed),
    usedToday: newUsed,
    isUnlimited: false,
  }
}
