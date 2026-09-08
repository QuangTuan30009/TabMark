// Cấu hình thanh toán chuyển khoản VietQR cho TabMark
// Bạn có thể thay đổi số tài khoản và ngân hàng tại đây

export const PAYMENT_CONFIG = {
  bankId: import.meta.env.VITE_BANK_ID || 'MB', // Mã ngân hàng: MB, VCB, TCB, VPB, TPB, ICB, ACB...
  bankName: import.meta.env.VITE_BANK_NAME || 'MB Bank ',
  accountNo: import.meta.env.VITE_BANK_ACCOUNT_NO || '0913813880', // Số tài khoản nhận tiền của bạn
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'TA QUANG TUAN', // Tên chủ tài khoản (viết hoa không dấu)
  
  // Danh sách các gói thanh toán
  plans: [
    {
      id: 'student_early',
      name: 'Sinh Viên Early-Bird',
      price: 29000,
      formattedPrice: '29.000 đ',
      period: 'Vĩnh viễn (Lifetime)',
      popular: true,
      badge: 'Khuyên Dùng ⭐',
      description: 'Dành riêng cho sinh viên & người dùng trải nghiệm sớm',
      features: [
        'Mở khóa toàn bộ tính năng AI Summary',
        'Không giới hạn số lượng Bookmark & Board',
        'Đồng bộ đám mây Supabase siêu tốc',
        'Huy hiệu PRO Vàng Kim chính thức',
        'Hỗ trợ ưu tiên 24/7'
      ]
    },
    {
      id: 'pro_monthly',
      name: 'Gói Pro Tháng',
      price: 19000,
      formattedPrice: '19.000 đ',
      period: '/ 1 tháng',
      popular: false,
      badge: 'Tiết kiệm',
      description: 'Linh hoạt theo từng tháng học tập & làm việc',
      features: [
        'Mọi tính năng của bản Pro',
        'Không giới hạn AI Chat & Tóm tắt',
        'Chia sẻ nhóm Bookmark không giới hạn'
      ]
    },
    {
      id: 'ai_power',
      name: 'AI Power 6 Tháng',
      price: 69000,
      formattedPrice: '69.000 đ',
      period: '/ 6 tháng',
      popular: false,
      badge: 'Hot Deal 🔥',
      description: 'Dành cho dân nghiên cứu, lập trình viên & Power User',
      features: [
        'Toàn bộ tính năng Pro',
        'Ưu tiên hàng đợi xử lý AI tốc độ cao',
        'Tính năng phân loại tự động nâng cao'
      ]
    }
  ]
}

/**
 * Tạo URL mã VietQR tự động
 */
export function generateVietQRUrl({ bankId, accountNo, accountName, amount, memo }) {
  const cleanBank = bankId || PAYMENT_CONFIG.bankId
  const cleanAccount = accountNo || PAYMENT_CONFIG.accountNo
  const cleanName = encodeURIComponent(accountName || PAYMENT_CONFIG.accountName)
  const cleanMemo = encodeURIComponent(memo || 'TABMARK PRO')
  
  return `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-compact2.png?amount=${amount}&addInfo=${cleanMemo}&accountName=${cleanName}`
}
