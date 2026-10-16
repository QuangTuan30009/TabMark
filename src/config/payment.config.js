// Cấu hình thanh toán chuyển khoản VietQR cho TabMark
// Bạn có thể thay đổi số tài khoản và ngân hàng tại đây

export const PAYMENT_CONFIG = {
  bankId: import.meta.env.VITE_BANK_ID || 'MB', // Mã ngân hàng: MB, VCB, TCB, VPB, TPB, ICB, ACB...
  bankName: import.meta.env.VITE_BANK_NAME || 'MB Bank ',
  accountNo: import.meta.env.VITE_BANK_ACCOUNT_NO || '0913813880', // Số tài khoản nhận tiền của bạn
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'TA QUANG TUAN', // Tên chủ tài khoản (viết hoa không dấu)
  
  // Danh sách các gói thanh toán chuẩn EXE101
  plans: [
    {
      id: 'starter',
      name: 'Gói Starter (Cá nhân)',
      price: 69000,
      formattedPrice: '69.000 đ',
      period: '/ tháng',
      popular: false,
      badge: 'Cơ bản',
      description: 'Tối ưu cho sinh viên & người đi làm quản lý cá nhân',
      features: [
        'Lưu trữ không giới hạn Bookmark & Board',
        '50 lượt gọi AI Summary & Chat mỗi ngày',
        'Tiện ích Extension 1-Click đầy đủ',
        'Đồng bộ Cloud thời gian thực',
        'Hỗ trợ kỹ thuật tiêu chuẩn'
      ]
    },
    {
      id: 'pro',
      name: 'Gói PRO (Chuyên nghiệp)',
      price: 149000,
      formattedPrice: '149.000 đ',
      period: '/ tháng',
      popular: true,
      badge: 'Bán Chạy Nhất ⭐',
      description: 'Dành cho Freelancer, Lập trình viên & Nhóm cộng tác',
      features: [
        'Toàn bộ quyền lợi của gói Starter',
        'KHÔNG GIỚI HẠN lượt gọi AI Summary & Chat',
        'AI Auto-Tagging & Tự động phân loại',
        'Chia sẻ Board quyền Chỉnh sửa (Edit mode)',
        'Xuất dữ liệu chuẩn JSON & HTML Chrome',
        'Huy hiệu PRO Vàng Kim chính thức'
      ]
    },
    {
      id: 'business',
      name: 'Gói Business (Doanh nghiệp)',
      price: 299000,
      formattedPrice: '299.000 đ',
      period: '/ tháng',
      popular: false,
      badge: 'Cao Cấp 👑',
      description: 'Dành cho Agency, Doanh nghiệp & Nhóm nghiên cứu R&D',
      features: [
        'Toàn bộ quyền lợi của gói PRO',
        'Cộng tác nhóm 5 - 10 thành viên',
        'Tích hợp Gemini API chuyên sâu',
        'Tự động sao lưu dữ liệu doanh nghiệp',
        'Phân quyền Admin / Editor / Viewer',
        'Hỗ trợ kỹ thuật ưu tiên 24/7'
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
