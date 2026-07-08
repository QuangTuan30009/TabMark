import { Check } from 'lucide-react'
import { RevealSection } from '@/components/landing/reveal'

const plans = [
  {
    name: 'Starter',
    target: 'Sinh viên',
    price: '50.000 đ',
    period: '/tháng',
    popular: false,
    features: [
      'Workspace cơ bản',
      'Tìm kiếm thông tin',
      'Tối ưu cho người mới',
    ],
    cta: 'Đăng ký Starter',
  },
  {
    name: 'Mid-tier',
    target: 'Freelancer, NVVP',
    price: '80.000 đ',
    period: '/tháng',
    popular: true,
    features: [
      'Mọi tính năng của Starter',
      'AI Summary',
      'AI Classification',
      '2.000 lượt request AI',
    ],
    cta: 'Nâng cấp lên Mid-tier',
  },
  {
    name: 'Premium',
    target: 'Phòng ban R&D',
    price: '150.000 đ',
    period: '/tháng',
    popular: false,
    features: [
      'AI đầy đủ tính năng',
      'Đồng bộ trên mọi thiết bị',
      'Cộng tác nhóm',
      '5.000 lượt request AI',
    ],
    cta: 'Đăng ký Premium',
  },
]

const addons = [
  {
    name: 'Basic AI Credit',
    target: 'Người dùng hết quota AI',
    price: '30.000 đ',
    features: ['Thêm 3.000 lượt request AI'],
  },
  {
    name: 'Advanced AI Credit',
    target: 'Người dùng AI chuyên sâu',
    price: '50.000 đ',
    features: ['Thêm 3.500 lượt request AI', 'Sử dụng mô hình AI cao cấp khác'],
  },
]

export function PricingSection({ onOpenDashboard }) {
  return (
    <section id="pricing" className="px-6 py-20 md:py-28 relative">
      <div className="mx-auto max-w-6xl">
        <RevealSection className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="text-3xl font-bold md:text-4xl">Bảng giá </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Lựa chọn gói cước phù hợp nhất với nhu cầu quản lý của bạn
          </p>
        </RevealSection>

        {/* 3 Main Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <RevealSection key={plan.name} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className={`relative h-full flex flex-col rounded-3xl border p-8 transition-all duration-300 ${plan.popular ? 'pricing-popular glow-blue bg-[#0b0e14]' : 'glass-card'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[#8B5CF6] px-4 py-1 text-xs font-bold text-white shadow-[0_0_15px_rgba(47,155,255,0.4)]">
                    Phổ biến nhất
                  </span>
                )}
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xl font-bold">{plan.name}</p>
                </div>
                <p className="text-sm font-medium text-primary mb-6">{plan.target}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onOpenDashboard}
                  className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all ${plan.popular
                    ? 'bg-primary text-primary-foreground hover:brightness-110 hover:shadow-[0_0_20px_rgba(47,155,255,0.3)]'
                    : 'bg-white/5 border border-white/10 text-foreground hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Add-ons Section */}
        <RevealSection className="mt-20">
          <div className="rounded-3xl border border-white/10 bg-[#080a10]/50 p-8 md:p-10 backdrop-blur-md">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-2xl font-bold">Gói Mua Thêm (Add-ons)</h3>
              <p className="mt-2 text-sm text-muted-foreground">Mua thêm dung lượng AI Credit khi bạn cần sử dụng nhiều hơn giới hạn của gói.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {addons.map((addon) => (
                <div key={addon.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
                  <div>
                    <h4 className="font-bold text-white">{addon.name}</h4>
                    <p className="text-xs text-primary mt-1">{addon.target}</p>
                    <ul className="mt-3 space-y-1">
                      {addon.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-accent" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-white/5 pt-4 sm:border-0 sm:pt-0">
                    <span className="text-xl font-bold text-white">{addon.price}</span>
                    <button onClick={onOpenDashboard} className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:mt-2">
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
