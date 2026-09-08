import { Check } from 'lucide-react'
import { RevealSection } from '@/components/landing/reveal'

const plans = [
  {
    name: 'Starter',
    target: 'Sinh viên & Cá nhân',
    price: '69.000 đ',
    period: '/tháng',
    popular: false,
    features: [
      'Lưu trữ không giới hạn Bookmark & Board',
      '50 lượt gọi AI Summary & Chat mỗi ngày',
      'Tiện ích Extension 1-Click đầy đủ',
      'Đồng bộ Cloud thời gian thực',
      'Tìm kiếm thông minh cơ bản',
    ],
    cta: 'Đăng ký Starter',
  },
  {
    name: 'Pro',
    target: 'Freelancer, Developer & Team nhỏ',
    price: '149.000 đ',
    period: '/tháng',
    popular: true,
    badge: 'Bán chạy nhất ⭐',
    features: [
      'Mọi tính năng của gói Starter',
      'KHÔNG GIỚI HẠN lượt gọi AI Summary & Chat',
      'AI Auto-Tagging & Tự động phân loại',
      'Cộng tác nhóm & Chia sẻ quyền Edit',
      'Xuất dữ liệu chuẩn JSON & HTML Chrome',
      'Huy hiệu PRO Vàng Kim chính thức',
    ],
    cta: 'Nâng cấp lên Pro',
  },
  {
    name: 'Business',
    target: 'Doanh nghiệp & Phòng ban R&D',
    price: '299.000 đ',
    period: '/tháng',
    popular: false,
    features: [
      'Toàn bộ tính năng cao cấp của Pro',
      'Cộng tác nhóm 5 - 10 thành viên',
      'Tích hợp Gemini API chuyên sâu',
      'Tự động sao lưu dữ liệu doanh nghiệp',
      'Phân quyền Admin / Editor / Viewer',
      'Hỗ trợ ưu tiên kỹ thuật 24/7',
    ],
    cta: 'Đăng ký Business',
  },
]

const addons = [
  {
    name: 'Gói Sinh Viên Ưu Đãi',
    target: 'Dành riêng cho sinh viên FPT / ĐH',
    price: '49.000 đ',
    period: '/tháng',
    features: ['Đầy đủ tính năng Pro', 'Ưu đãi xác thực email trường .edu.vn'],
  },
  {
    name: 'Bản Quyền 1 Năm (Tiết kiệm 30%)',
    target: 'Người dùng gắn bó lâu dài',
    price: '1.199.000 đ',
    period: '/năm',
    features: ['Tiết kiệm gần 600.000đ/năm', 'Tặng 3 tháng sử dụng miễn phí'],
  },
]

export function PricingSection({ onOpenDashboard }) {
  return (
    <section id="pricing" className="px-4 sm:px-6 py-20 md:py-28 relative bg-[#070a12] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-cyan-600/[0.04] blur-[160px]" />

      <div className="mx-auto max-w-6xl relative z-10">
        <RevealSection className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 mb-3 tracking-widest uppercase">
            <span>Pricing</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl tracking-tight">
            Bảng giá linh hoạt
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
            Lựa chọn gói cước phù hợp nhất với nhu cầu quản lý và làm việc cùng AI của bạn
          </p>
        </RevealSection>

        {/* 3 Main Plans */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <RevealSection key={plan.name} style={{ transitionDelay: `${i * 150}ms` }}>
              <div
                className={`relative h-full flex flex-col rounded-3xl p-8 transition-all duration-300 backdrop-blur-xl ${
                  plan.popular
                    ? 'bg-[#0e1424] border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50 scale-[1.02]'
                    : 'bg-[#0c101c]/80 border border-white/10 hover:border-white/20 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-1 text-xs font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] uppercase tracking-wider">
                    Phổ biến nhất
                  </span>
                )}
                <div className="mb-2">
                  <p className="text-xl font-extrabold text-white">{plan.name}</p>
                </div>
                <p className="text-xs font-semibold text-cyan-400 mb-6">{plan.target}</p>
                
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-4xl font-black text-white tracking-tight">{plan.price}</span>
                  <span className="text-sm font-medium text-slate-400">{plan.period}</span>
                </div>

                <ul className="flex-1 space-y-3.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-slate-300 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onOpenDashboard}
                  className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Add-ons Section */}
        <RevealSection className="mt-16">
          <div className="rounded-3xl border border-white/10 bg-[#0c101c]/60 p-8 md:p-10 backdrop-blur-xl">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">Gói Mua Thêm (Add-ons)</h3>
              <p className="mt-2 text-sm text-slate-400">
                Mua thêm dung lượng AI Credit khi bạn cần sử dụng nhiều hơn giới hạn của gói.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {addons.map((addon) => (
                <div
                  key={addon.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-cyan-500/20"
                >
                  <div>
                    <h4 className="font-bold text-white">{addon.name}</h4>
                    <p className="text-xs text-cyan-400 mt-1 font-semibold">{addon.target}</p>
                    <ul className="mt-3 space-y-1.5">
                      {addon.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="h-3 w-3 text-cyan-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-white/5 pt-4 sm:border-0 sm:pt-0">
                    <span className="text-xl font-extrabold text-white">{addon.price}</span>
                    <button
                      onClick={onOpenDashboard}
                      className="rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-4 py-1.5 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/25 sm:mt-2 cursor-pointer"
                    >
                      Mua thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
