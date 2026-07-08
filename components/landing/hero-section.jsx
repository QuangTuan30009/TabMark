import { ChevronRight } from 'lucide-react'

export function HeroSection({ onOpenDashboard }) {
  return (
    <section className="hero-gradient relative overflow-hidden px-6 pb-16 pt-20 md:pb-24 md:pt-32">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#8B5CF6]/10 blur-[100px] animate-pulse-glow delay-500" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Left – copy */}
        <div className="animate-fade-in-left">
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-pretty md:text-5xl lg:text-[3.4rem]">
            Quản lý bookmark{' '}
            <br className="hidden sm:block" />
            thông minh bằng{' '}
            <span className="gradient-text">AI </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Tổ chức, gắn thẻ và tìm kiếm bookmark của bạn dễ dàng với sức mạnh của AI
            và giao diện Kanban trực quan. Trải nghiệm năng suất vượt trội ngay hôm nay.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onOpenDashboard}
              className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(47,155,255,0.35)]"
            >
              Thử ngay miễn phí
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right – dashboard mockup */}
        <div className="animate-fade-in-right delay-200">
          <div className="img-hover rounded-2xl border border-white/10 bg-card/60 p-3 shadow-2xl glow-blue">
            <img
              src="/dashboard-mockup.png"
              alt="Tabmark Dashboard Preview"
              className="w-full rounded-xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
