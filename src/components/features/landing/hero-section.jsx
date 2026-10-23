import { ArrowRight, Sparkles, Layers, Zap, Search } from 'lucide-react'

export function HeroSection({ onOpenDashboard }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-36 md:pb-24 bg-[#06080f]">
      {/* ── AMBIENT CYAN & MAGENTA GLOW SPHERES ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top Right Cyan Glow */}
        <div className="absolute -top-20 right-10 w-[600px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent blur-[140px] rounded-full" />
        
        {/* Center-Right Magenta / Purple Glow */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[450px] bg-gradient-to-tl from-purple-600/25 via-pink-500/15 to-transparent blur-[140px] rounded-full" />

        {/* Subtle Left Fill */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 2-COLUMN SPLIT HERO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 pb-12 md:pb-16">
          
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-6 text-left space-y-6">
            
            {/* Top Pill Tag */}
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nền Tảng Quản Lý Bookmark AI Thế Hệ Mới</span>
            </div> */}

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.14] text-balance">
              Tổ Chức Không Gian Web{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Theo Tốc Độ Tư Duy.
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-300/90 max-w-xl font-normal text-balance">
              Trải nghiệm quy trình sắp xếp trực quan với bảng Kanban mượt mà, tích hợp Gemini AI tự động đọc hiểu, trích xuất tóm tắt và tìm kiếm siêu tốc.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOpenDashboard}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#818cf8] hover:brightness-110 px-8 py-4 font-extrabold text-sm sm:text-base text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.45)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Dùng thử TabMark miễn phí</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all text-center"
              >
                Tìm hiểu tính năng
              </a>
            </div>

            {/* Extension Support link */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <a
                href="https://github.com/QuangTuan30009/TabMark/tree/main/extension"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cyan-300 hover:text-white transition-colors"
              >
                <span>Hỗ trợ Chrome Extension</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic 3D Isometric Floating Kanban Board */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-2 lg:pt-0">
            {/* Layered Multi-Color Ambient Neon Halos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[520px] bg-gradient-to-tr from-cyan-400/40 via-purple-600/35 to-pink-500/30 rounded-full blur-[130px] animate-pulse-aura -z-10 pointer-events-none" />
            
            {/* Secondary vibrant Cyan Accent Halo */}
            <div className="absolute -top-12 -right-8 w-[350px] h-[350px] bg-cyan-400/35 rounded-full blur-[100px] animate-pulse -z-10 pointer-events-none" />

            {/* Tertiary Hot Pink Accent Halo */}
            <div className="absolute -bottom-12 -left-8 w-[350px] h-[350px] bg-pink-500/30 rounded-full blur-[100px] animate-pulse -z-10 pointer-events-none delay-1000" />
            
            {/* Floating 3D Board Component */}
            <div className="relative w-full flex items-center justify-center animate-float-3d-left">
              <img
                src="/concept5-board-clean.png"
                alt="TabMark 3D Isometric Kanban Board"
                className="w-full max-w-[720px] lg:max-w-[820px] h-auto object-contain select-none drop-shadow-[0_25px_70px_rgba(0,0,0,0.9)] filter brightness-110 contrast-105"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* ── 3 VALUE PILLARS (Glassmorphism Cards) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-10 border-t border-white/[0.08]">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-all group shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
              Quy Trình Kanban Trực Quan
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              Sắp xếp và kéo thả liên kết giữa các bảng To-do, Reading, Done một cách thông minh và linh hoạt.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/30 transition-all group shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              Trợ Lý Gemini AI Tóm Tắt
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              Tự động phân tích nội dung trang web, trích xuất ý chính và gợi ý từ khóa thẻ (tags) chuẩn xác.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-blue-500/30 transition-all group shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
              Tìm Kiếm Siêu Tốc
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
              Tìm kiếm tức thì theo ngữ cảnh, tên trang hoặc ghi chú cá nhân với phím tắt thông minh.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
