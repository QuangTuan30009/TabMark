import { useState, useEffect } from 'react'
import { X, ExternalLink, Settings, ShieldAlert, Check } from 'lucide-react'

export default function PopupBlockerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('chrome')
  const [dontShowAgain, setDontShowAgain] = useState(false)

  // Only render if open
  if (!isOpen) return null

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hidePopupBlockerGuide', 'true')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#10141f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <ExternalLink className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Opening your links</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Due to security policies, your browser may block multiple tabs from opening at once. If you don't see all your links, please allow pop-ups.
          </p>
          
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-[#0b0d14]/50">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setActiveTab('chrome')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chrome' 
                  ? 'bg-blue-500/20 text-blue-400 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              Chrome / Edge
            </button>
            <button
              onClick={() => setActiveTab('safari')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'safari' 
                  ? 'bg-blue-500/20 text-blue-400 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              Safari (Mac)
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[140px]">
            {activeTab === 'chrome' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-red-500/20">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="text-white font-medium">Step 1:</span> Click the red <span className="text-red-400 font-semibold border border-red-500/30 px-1.5 py-0.5 rounded text-xs mx-1 bg-red-500/10">Pop-up blocked</span> icon on the right side of your URL address bar.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/20">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="text-white font-medium">Step 2:</span> Select <span className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded text-xs mx-1">Always allow pop-ups and redirects</span> and click <strong>Done</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safari' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-600">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="text-white font-medium">Step 1:</span> Open Safari <strong>Settings</strong> (or Preferences) and go to the <span className="text-white font-medium">Websites</span> tab.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/20">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="text-white font-medium">Step 2:</span> Click <span className="text-white font-medium">Pop-up Windows</span> on the left, find this website, and change the setting to <span className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded text-xs mx-1">Allow</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#10141f]">
          <label 
            className="flex items-center gap-2 mb-5 cursor-pointer group w-fit"
            onClick={() => setDontShowAgain(!dontShowAgain)}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              dontShowAgain 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-slate-600 group-hover:border-slate-500'
            }`}>
              {dontShowAgain && <Check className="w-3 h-3" />}
            </div>
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              Don't show this guide again
            </span>
          </label>
          
          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl font-semibold transition-colors focus:ring-4 focus:ring-white/20 outline-none"
          >
            I understand and allow
          </button>
        </div>
      </div>
    </div>
  )
}
