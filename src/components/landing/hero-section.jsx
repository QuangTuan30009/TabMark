import { ArrowRight, Sparkles, Layers, Zap } from 'lucide-react'

export function HeroSection({ onOpenDashboard }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-[#06080f]">
      {/* ── AMBIENT CYANG & MAGENTA GLOW SPHERES ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top Right Cyan Glow */}
        <div className="absolute -top-20 right-10 w-[600px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent blur-[140px] rounded-full" />
        
        {/* Center-Right Magenta / Purple Glow */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[450px] bg-gradient-to-tl from-purple-600/25 via-pink-500/15 to-transparent blur-[140px] rounded-full" />

        {/* Subtle Left Fill */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 2-COLUMN SPLIT HERO (Concept 5 Signature Layout) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 pb-12 md:pb-16">
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-6 text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Organize the Web{' '}
              <br className="hidden sm:inline" />
              at the Speed of{' '}
              <span className="text-white">Thought.</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-xl font-normal">
              Experience a new era of visual organization with beautiful Kanban flows and instant, intelligent AI summarization for every saved link.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenDashboard}
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#818cf8] hover:brightness-110 px-8 py-4 font-extrabold text-sm sm:text-base text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.45)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Try TabMark Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic 3D Isometric Floating Kanban Board (Enlarged & Left-Tilted) */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
            {/* Layered Multi-Color Ambient Neon Halos (Cyan, Purple, Pink) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[520px] bg-gradient-to-tr from-cyan-400/40 via-purple-600/35 to-pink-500/30 rounded-full blur-[130px] animate-pulse-aura -z-10 pointer-events-none" />
            
            {/* Secondary vibrant Cyan Accent Halo */}
            <div className="absolute -top-12 -right-8 w-[350px] h-[350px] bg-cyan-400/35 rounded-full blur-[100px] animate-pulse -z-10 pointer-events-none" />

            {/* Tertiary Hot Pink Accent Halo */}
            <div className="absolute -bottom-12 -left-8 w-[350px] h-[350px] bg-pink-500/30 rounded-full blur-[100px] animate-pulse -z-10 pointer-events-none delay-1000" />
            
            {/* Floating 3D Board Component (Left Tilted & Enlarged) */}
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

        {/* ── 3 MINIMAL VALUE PILLARS (Concept 5 Signature Footer Strip) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/[0.08]">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Visual Kanban</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Structured boards and effortless drag-and-drop organization for content.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Gemini AI Assistant</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Integrated intelligent features for summary generation and categorization.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Instant Search</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Powerful, lightning-fast search capabilities across all saved content.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
