import { useState, useEffect, useRef } from 'react'
import { updateUserProfile } from '@/lib/bookmarksApi'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { Upload, Trash2, KeyRound, Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'

export function SettingsModal({ isOpen, onClose, user, onUserUpdated, onOpenPayment, onResetDefaultCollections, onLogout }) {
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '')
      setAvatarUrl(user.avatar_url || user.user_metadata?.avatar_url || '')
      setNewPassword('')
      setConfirmPassword('')
      setMessage(null)
      setError(null)
      setShowUrlInput(false)
    }
  }, [user, isOpen])

  if (!isOpen) return null

  const getInitials = () => {
    if (fullName) return fullName.slice(0, 2).toUpperCase()
    if (user?.email) return user.email.slice(0, 2).toUpperCase()
    return 'TM'
  }

  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.provider === 'google' || user?.app_metadata?.providers?.includes('google')

  // Handle image file upload & compression
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một file hình ảnh hợp lệ (JPG, PNG, WEBP,...).')
      return
    }

    // Limit original file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('Dung lượng ảnh gốc tối đa là 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 256 // 256x256 px is ideal for crisp avatar and small size (~25KB)
          
          // Crop square from center
          const minDim = Math.min(img.width, img.height)
          const startX = (img.width - minDim) / 2
          const startY = (img.height - minDim) / 2

          canvas.width = MAX_SIZE
          canvas.height = MAX_SIZE
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE)

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
          setAvatarUrl(dataUrl)
          setError(null)
        } catch (err) {
          console.error('Lỗi khi xử lý ảnh:', err)
          setError('Không thể xử lý hình ảnh này.')
        }
      }
      img.onerror = () => {
        setError('Không thể tải dữ liệu ảnh.')
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const trimmedName = fullName.trim()
      const trimmedAvatar = avatarUrl.trim()

      // 1. Cập nhật thông tin Profile (Tên & Avatar) vào database (bảng profiles)
      if (user?.id && isSupabaseConfigured) {
        await updateUserProfile(user.id, {
          full_name: trimmedName,
          avatar_url: trimmedAvatar
        })

        // Đồng thời cập nhật user_metadata của Supabase Auth để đồng bộ phiên làm việc
        try {
          await supabase.auth.updateUser({
            data: {
              full_name: trimmedName,
              avatar_url: trimmedAvatar
            }
          })
        } catch (authErr) {
          console.warn('Cập nhật user_metadata cảnh báo:', authErr)
        }
      }

      // 2. Đổi hoặc thiết lập mật khẩu (dành cho cả tài khoản Google & Email thông thường)
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

      // 3. Cập nhật state ở React App & localStorage nếu có
      const updatedUser = {
        ...user,
        full_name: trimmedName,
        avatar_url: trimmedAvatar,
        user_metadata: {
          ...user?.user_metadata,
          full_name: trimmedName,
          avatar_url: trimmedAvatar
        }
      }

      try {
        const currentMock = localStorage.getItem('tabmark_mock_user')
        if (currentMock) {
          const parsed = JSON.parse(currentMock)
          localStorage.setItem('tabmark_mock_user', JSON.stringify({
            ...parsed,
            full_name: trimmedName,
            avatar_url: trimmedAvatar
          }))
        }
        if (user?.id) {
          localStorage.setItem(`tabmark_user_profile_${user.id}`, JSON.stringify({
            full_name: trimmedName,
            avatar_url: trimmedAvatar
          }))
        }
      } catch (storageErr) {
        console.warn('Lỗi lưu cache profile:', storageErr)
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
              Quản lý thông tin tài khoản, ảnh đại diện và mật khẩu đăng nhập
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
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shrink-0 shadow-lg">
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

            <div className="min-w-0 flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isGoogleUser ? 'Tài khoản Google' : 'Tài khoản Email'}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  user?.is_pro 
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' 
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}>
                  {user?.is_pro ? 'Gói PRO' : 'Gói FREE'}
                </span>
              </div>

              {/* Upload & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh từ máy</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('')
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                    title="Gỡ ảnh đại diện"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Gỡ ảnh</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-2 transition-colors cursor-pointer py-1 px-1"
                >
                  {showUrlInput ? 'Ẩn link URL' : 'Dùng link URL'}
                </button>
              </div>
            </div>
          </div>

          {/* Optional Manual Avatar URL Input */}
          {showUrlInput && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Đường dẫn ảnh đại diện trực tiếp (URL)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs text-white bg-white/[0.03] border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {message && (
            <div className="p-3 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="p-3 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
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
              Địa chỉ email liên kết tài khoản
            </p>
          </div>

          {/* Password Section (Available for both Google & Email users) */}
          <div className="pt-3 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-bold text-white">
                  {isGoogleUser ? 'Thiết lập mật khẩu đăng nhập' : 'Đổi mật khẩu'}
                </p>
              </div>
            </div>

            {isGoogleUser && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-semibold text-white mb-0.5">Linh hoạt phương thức đăng nhập</p>
                  Bạn đang đăng nhập bằng Google. Khi thiết lập mật khẩu tại đây, bạn có thể đăng nhập bằng cả <strong>Google</strong> lẫn <strong>Email & Mật khẩu</strong> ({user?.email || 'email này'}).
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {isGoogleUser ? 'Mật khẩu muốn tạo (tối thiểu 6 ký tự)' : 'Mật khẩu mới'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isGoogleUser ? "Nhập mật khẩu để đăng nhập bằng email" : "Để trống nếu không muốn đổi"}
                className="w-full px-3.5 py-2.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Xác nhận lại mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>

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

          {/* Reset Bookmark Collections to Curated Real Links */}
          {onResetDefaultCollections && (
            <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-300">
                  Sắp xếp lại Bookmark chuẩn
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Khôi phục các nhóm link thật & chuẩn (General Work, AI, Dev, Học tập)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onResetDefaultCollections()
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Khôi phục ngay
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
