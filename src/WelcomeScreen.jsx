import { useEffect, useState } from 'react'
import { Brain, BookmarkIcon, Zap, Globe } from 'lucide-react'

export default function WelcomeScreen({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Show welcome screen for 2.5 seconds, then start fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      // Wait for fade out animation to finish before unmounting
      setTimeout(onComplete, 800)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06111F] transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-200'}`}
    >
      <div className="flex animate-fade-in-up flex-col items-center gap-10">
        
        {/* Top Icons */}
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-12 animate-fade-in-up items-center justify-center rounded-full border border-[#2F9BFF]/30 bg-[#2F9BFF]/10 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
            <Zap className="h-5 w-5 text-[#2F9BFF]" />
          </div>
          <div className="flex h-12 w-12 animate-fade-in-up items-center justify-center rounded-full border border-[#2F9BFF]/30 bg-[#2F9BFF]/10 shadow-[0_0_30px_rgba(139,92,246,0.25)] delay-100">
            <Brain className="h-5 w-5 text-[#2F9BFF]" />
          </div>
          <div className="flex h-12 w-12 animate-fade-in-up items-center justify-center rounded-full border border-[#2F9BFF]/30 bg-[#2F9BFF]/10 shadow-[0_0_30px_rgba(139,92,246,0.25)] delay-200">
            <BookmarkIcon className="h-5 w-5 text-[#2F9BFF]" />
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center">
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl delay-300">
            Welcome To <span className="text-white">Tabmark</span>
          </h1>
          <h2 className="animate-fade-in-up mt-4 text-2xl font-bold tracking-wide text-[#2F9BFF] drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] md:text-4xl delay-400">
            AI Bookmark Manager
          </h2>
        </div>

        {/* Bottom Pill */}
        <div className="animate-fade-in-up mt-8 flex items-center gap-2 rounded-full border border-[#2F9BFF]/20 bg-[#2F9BFF]/10 px-5 py-2 shadow-[0_0_20px_rgba(139,92,246,0.15)] delay-500">
          <Globe className="h-4 w-4 text-[#2F9BFF]" />
          <span className="text-sm font-medium text-[#2F9BFF]/90">tabmark.app</span>
        </div>

      </div>
    </div>
  )
}
