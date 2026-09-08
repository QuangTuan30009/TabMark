import { useState, useEffect } from 'react'
import { updateUserProfile } from '@/lib/bookmarksApi'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'

export function SettingsModal({ isOpen, onClose, user, onUserUpdated, onOpenPayment, onLogout }) {
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '')
      setAvatarUrl(user.avatar_url || user.user_metadata?.avatar_url || '')
      setNewPassword('')
      setConfirmPassword('')
      setMessage(null)
      setError(null)
    }
  }, [user, isOpen])

  if (!isOpen) return null

  const getInitials = () => {
    if (fullName) return fullName.slice(0, 2).toUpperCase()
    if (user?.email) return user.email.slice(0, 2).toUpperCase()
    return 'TM'
  }

  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.provider === 'google'

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      // 1. Cập nhật thông tin Profile (Tên & Avatar)
      if (user?.id && isSupabaseConfigured) {
        await updateUserProfile(user.id, {
          full_name: fullName.trim(),
          avatar_url: avatarUrl.trim()
        })
      }

      // 2. Đổi mật khẩu nếu người dùng nhập
      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.')
        }
        if (newPassword !== confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp.')
        }
        if (isSupabaseConfigured) {
          const { error: pwdErr } = await supabase.auth.updateUser({
            password: newPassword
          })
          if (pwdErr) throw pwdErr
        }
      }

      // 3. Cập nhật state ở React App
      const updatedUser = {
        ...user,
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim()
      }
      if (onUserUpdated) {
        onUserUpdated(updatedUser)
      }

      setMessage('Đã lưu thay đổi hồ sơ thành công!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Không thể lưu thay đổi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-[#0c101a] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Hồ sơ cá nhân
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý thông tin tài khoản và cài đặt cá nhân
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {/* Avatar Preview & Display Section */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shrink-0 shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#0d121f] flex items-center justify-center text-white text-base font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">
                {fullName || user?.email || 'Người dùng TabMark'}
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isGoogleUser ? 'Google Account' : 'Email Account'}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  user?.is_pro 
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' 
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}>
                  {user?.is_pro ? 'Gói PRO' : 'Gói FREE'}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className="p-3 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Họ và tên / Tên hiển thị
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên hiển thị của bạn"
              className="w-full px-3.5 py-2.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 text-xs text-slate-400 bg-white/[0.01] border border-white/5 rounded-xl cursor-not-allowed select-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Địa chỉ email đăng nhập vào hệ thống
            </p>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Đường dẫn ảnh đại diện (Avatar URL)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3.5 py-2.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Password Update (Only for non-OAuth or optional) */}
          {!isGoogleUser && (
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              <p className="text-xs font-bold text-white">
                Đổi mật khẩu
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Để trống nếu không muốn đổi"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              {newPassword && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3.5 py-2.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* Plan upgrade quick row if Free */}
          {!user?.is_pro && onOpenPayment && (
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-300">
                  Nâng cấp tài khoản PRO
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Lưu bookmark không giới hạn & Trợ lý AI nâng cao
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenPayment()
                }}
                className="px-3 py-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Nâng cấp ngay
              </button>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onLogout()
                }}
                className="px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
