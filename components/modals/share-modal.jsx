import { useState } from 'react'
import { X, Copy, Check, Shield, Globe, Lock } from 'lucide-react'

export function ShareModal({ onClose, collection, onUpdateShareMode }) {
  const [shareMode, setShareMode] = useState(collection?.shareMode || 'private')
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const shareUrl = `${window.location.origin}/#shared/${collection?.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await onUpdateShareMode(collection.id, shareMode)
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#10141f] border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Share "{collection?.name}"</h2>
              <p className="text-xs text-slate-400">Manage who can view or edit this group</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Rights</label>
            <div className="grid grid-cols-1 gap-3">
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${shareMode === 'private' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                <input type="radio" name="shareMode" value="private" checked={shareMode === 'private'} onChange={() => setShareMode('private')} className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-semibold text-white">Private</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Only you can access this group. It will not be accessible via link.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${shareMode === 'view' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                <input type="radio" name="shareMode" value="view" checked={shareMode === 'view'} onChange={() => setShareMode('view')} className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">View Only</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Anyone with the link can view the links, but cannot edit.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${shareMode === 'edit' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                <input type="radio" name="shareMode" value="edit" checked={shareMode === 'edit'} onChange={() => setShareMode('edit')} className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Can Edit</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Anyone with the link (and logged in) can add, edit, or delete links.</p>
                </div>
              </label>
            </div>
          </div>

          {shareMode !== 'private' && (
            <div className="space-y-2 animate-fade-in-up">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 text-sm text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-black/20 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
