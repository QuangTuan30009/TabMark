import Swal from 'sweetalert2'

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
  if (!user) return 'free'
  const plan = (user.plan || '').toLowerCase()
  if (plan.includes('business')) return 'business'
  if (plan.includes('pro') || user.is_pro) return 'pro'
  if (plan.includes('starter')) return 'starter'
  return 'free'
}

/**
 * Lấy key ngày hiện tại (YYYY-MM-DD) theo múi giờ địa phương
 */
function getTodayKey() {
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

/**
 * Hiển thị popup thông báo hết hạn mức AI và kêu gọi nâng cấp
 * @param {Function} onUpgrade Callback mở modal nâng cấp
 * @param {object} quota Thông tin hạn mức
 */
export function showQuotaExceededAlert(onUpgrade, quota) {
  const planName = quota?.planName || 'Gói hiện tại'
  const limit = quota?.dailyLimit || 5

  return Swal.fire({
    title: 'Hết hạn mức AI hôm nay!',
    html: `
      <div style="text-align: left; font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-top: 8px;">
        <p style="margin-bottom: 12px;">
          Bạn đang sử dụng <strong style="color: #38bdf8;">${planName}</strong> với giới hạn 
          <strong style="color: #f43f5e;">${limit} lượt AI / ngày</strong> và đã dùng hết hôm nay.
        </p>
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="margin: 0; color: #94a3b8; font-size: 13px;">
            ⚡ Nâng cấp lên <strong style="color: #a855f7;">Gói Pro (149K)</strong> để sử dụng 
            <strong style="color: #22c55e;">Không giới hạn</strong> lượt gọi AI và mở khóa toàn bộ tính năng cao cấp!
          </p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin: 0;">
          * Hạn mức sẽ tự động được làm mới vào 00:00 ngày mai.
        </p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '⚡ Nâng cấp ngay',
    cancelButtonText: 'Để sau',
    confirmButtonColor: '#7c3aed',
    cancelButtonColor: '#334155',
    background: '#0f172a',
    color: '#f8fafc',
    customClass: {
      popup: 'border border-purple-500/30 shadow-2xl rounded-2xl'
    }
  }).then((result) => {
    if (result.isConfirmed && typeof onUpgrade === 'function') {
      onUpgrade()
    }
  })
}
