import { Check } from 'lucide-react'
import { RevealSection } from '@/components/ui/reveal-section'

const plans = [
  {
    id: 'starter',
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
    id: 'pro',
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
    id: 'business',
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

export function PricingSection({ onOpenDashboard, onSelectPlan }) {
  const handleChoosePlan = (planId) => {
    if (onSelectPlan) {
      onSelectPlan(planId)
    } else if (onOpenDashboard) {
      onOpenDashboard(planId)
    }
  }

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
                onClick={() => handleChoosePlan(plan.id)}
                className={`relative h-full flex flex-col rounded-3xl p-8 transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                  plan.popular
                    ? 'bg-[#0e1424] border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50 scale-[1.02] hover:scale-[1.03]'
                    : 'bg-[#0c101c]/80 border border-white/10 hover:border-white/20 hover:scale-[1.01] shadow-xl'
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleChoosePlan(plan.id)
                  }}
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
      </div>
    </section>
  )
}
