import { useEffect, useState } from 'react'
import { Brain, BookmarkIcon, Zap, Globe } from 'lucide-react'

export default function WelcomeScreen({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false)

  const handleSkip = () => {
    if (isFadingOut) return
    setIsFadingOut(true)
    setTimeout(onComplete, 400)
  }

  useEffect(() => {
    // Show welcome screen for 2.2 seconds, then start fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      setTimeout(onComplete, 600)
    }, 2200)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#06111F] pt-safe pb-safe p-6 transition-opacity duration-500 ease-in-out cursor-pointer select-none ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="w-full" />

      <div className="flex animate-fade-in-up flex-col items-center gap-8 text-center max-w-sm">
        
        {/* Top Icons */}
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 animate-fade-in-up items-center justify-center rounded-2xl border border-[#2F9BFF]/30 bg-[#2F9BFF]/10 shadow-[0_0_30px_rgba(47,155,255,0.25)]">
            <Zap className="h-5 w-5 text-[#2F9BFF]" />
          </div>
          <div className="flex h-14 w-14 animate-fade-in-up items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 shadow-[0_0_35px_rgba(168,85,247,0.3)] delay-100">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
          <div className="flex h-12 w-12 animate-fade-in-up items-center justify-center rounded-2xl border border-[#2F9BFF]/30 bg-[#2F9BFF]/10 shadow-[0_0_30px_rgba(47,155,255,0.25)] delay-200">
            <BookmarkIcon className="h-5 w-5 text-[#2F9BFF]" />
          </div>
        </div>

        {/* Text Area */}
        <div>
          <h1 className="animate-fade-in-up text-3xl sm:text-4xl font-black tracking-tight text-white delay-300">
            Welcome To <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">TabMark</span>
          </h1>
          <h2 className="animate-fade-in-up mt-3 text-lg sm:text-xl font-bold tracking-wide text-[#2F9BFF] drop-shadow-[0_0_15px_rgba(47,155,255,0.5)] delay-400">
            AI Bookmark Manager
          </h2>
        </div>

        {/* Bottom Pill */}
        <div className="animate-fade-in-up flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md delay-500">
          <Globe className="h-3.5 w-3.5 text-[#2F9BFF]" />
          <span className="text-xs font-semibold text-slate-300">tabmark.app</span>
        </div>

      </div>

      <div className="text-[11px] text-slate-500 font-medium tracking-wide animate-pulse">
        Chạm để bắt đầu
      </div>
    </div>
  )
}
