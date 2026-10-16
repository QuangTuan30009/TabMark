import Swal from 'sweetalert2'

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
