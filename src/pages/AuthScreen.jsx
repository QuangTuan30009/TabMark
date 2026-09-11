import { useState } from 'react'
import { Mail, Lock, AlertCircle, Check, Eye, EyeOff, Sparkles, Shield, ArrowLeft, Layers, Zap } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

export default function AuthScreen({ onLogin, onBackHome }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.')
      setLoading(false)
      return
    }

    if (isSupabaseConfigured) {
      try {
        if (isSignUp) {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
          })
          if (signUpError) throw signUpError

          if (data?.session) {
            onLogin(data.user)
          } else {
            setMessage('Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.')
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          })
          if (signInError) throw signInError
          if (data?.user) {
            onLogin(data.user)
          }
        }
      } catch (err) {
        console.error(err)
        setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    } else {
      // Mock Local mode authentication
      setTimeout(() => {
        setLoading(false)
        if (isSignUp) {
          setMessage('Đăng ký tài khoản Mock thành công! Giờ bạn có thể đăng nhập.')
          setIsSignUp(false)
        } else {
          onLogin({ email: email.trim(), isMock: true })
        }
      }, 800)
    }
  }

  function switchMode(toSignUp) {
    setIsSignUp(toSignUp)
    setError(null)
    setMessage(null)
  }

  async function handleGoogleSignIn() {
    setError(null)
    setMessage(null)
    if (isSupabaseConfigured) {
      try {
        setLoading(true)
        const { error: googleError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        })
        if (googleError) throw googleError
      } catch (err) {
        console.error(err)
        setError(err.message || 'Lỗi đăng nhập Google, vui lòng thử lại.')
        setLoading(false)
      }
    } else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        onLogin({ email: 'google.user@example.com', isMock: true, provider: 'google' })
      }, 800)
    }
  }

  function handleQuickAdminLogin() {
    setEmail('taquangtuan2016@gmail.com')
    setPassword('tuan123')
    onLogin({
      id: 'usr-admin',
      email: 'taquangtuan2016@gmail.com',
      full_name: 'Tạ Quang Tuấn (Admin)',
      role: 'Super Admin',
      is_admin: true,
      is_pro: true,
      plan: 'pro',
      isMock: true,
    })
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex font-sans selection:bg-blue-500/30">
      
      <style>{`
        @keyframes bounce {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* ── LEFT HERO PANEL (Original purple gradient & bouncing illustration, hidden on mobile & iPad) ── */}
      <div 
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3b2fc9 0%, #5b35d5 40%, #7c4de8 70%, #6a3de8 100%)',
        }}
      >
        {/* Grid overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} 
        />

        {/* Center illustration */}
        <div 
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px 48px',
            zIndex: 1,
          }}
        >
          <img
            src="/image-tabmark.png"
            alt="App preview"
            style={{
              width: '100%',
              maxWidth: '480px',
              animation: 'bounce 2s ease-in-out infinite',
              objectFit: 'contain',
              filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.4))',
            }}
          />
        </div>
      </div>

      {/* ── RIGHT AUTH FORM CONTAINER (Responsive on all screens) ── */}
      <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 lg:p-12 w-full max-w-xl mx-auto overflow-y-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          {/* Logo on mobile/tablet */}
          <div className="lg:hidden flex items-center">
            <button onClick={onBackHome} className="cursor-pointer">
              <img src="/tabmark-logo-white.png" alt="TabMark" className="h-8 w-auto object-contain" />
            </button>
          </div>

          <div className="hidden lg:block" />

          {onBackHome && (
            <button
              onClick={onBackHome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về trang chủ</span>
            </button>
          )}
        </div>

        {/* Center Card */}
        <div className="my-auto w-full max-w-md mx-auto space-y-6">
          
          {/* Mode Switch Tabs */}
          <div className="p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                !isSignUp
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                isSignUp
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isSignUp ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
            </h1>
            <p className="text-xs text-slate-400">
              {isSignUp
                ? 'Đăng ký ngay để bắt đầu tổ chức bookmark cùng trợ lý AI.'
                : 'Nhập email và mật khẩu của bạn để truy cập không gian làm việc.'}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-white transition-all cursor-pointer shadow-sm group hover:border-white/20"
          >
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8H6.3C9.7 35.7 16.3 40 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.2 35.4 44 30.1 44 24c0-1.3-.1-2.6-.4-3.9z" />
            </svg>
            <span>{isSignUp ? 'Đăng ký với Google' : 'Đăng nhập với Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">hoặc email</span>
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Địa chỉ Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus:border-cyan-500/60 focus:bg-white/[0.06] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Mật khẩu <span className="text-rose-400">*</span>
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Vui lòng liên hệ quản trị viên hoặc dùng chế độ Mock để đăng nhập.')}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full pl-10 pr-11 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus:border-cyan-500/60 focus:bg-white/[0.06] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            {!isSignUp && (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-400">Ghi nhớ phiên đăng nhập này</span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : isSignUp ? (
                'Tạo tài khoản TabMark'
              ) : (
                'Đăng nhập ngay'
              )}
            </button>
          </form>

          {/* Switch mode footer text */}
          <p className="text-center text-xs text-slate-400">
            {isSignUp ? 'Đã có tài khoản TabMark? ' : 'Chưa có tài khoản? '}
            <button
              type="button"
              onClick={() => switchMode(!isSignUp)}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer transition-colors"
            >
              {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
            </button>
          </p>

          {/* Discrete Admin Demo Pill */}
            {/* <div className="pt-4 border-t border-white/[0.06] text-center">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-[11px] text-purple-300 font-medium transition-all cursor-pointer"
                title="Đăng nhập tài khoản Admin nhanh cho demo bài tập lớn EXE101"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Đăng nhập thử nghiệm Admin (Tạ Quang Tuấn)</span>
              </button>
            </div> */}

        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-slate-500">
          TabMark © 2026 • AI Visual Bookmark Manager • EXE101
        </div>

      </div>

    </div>
  )
}
