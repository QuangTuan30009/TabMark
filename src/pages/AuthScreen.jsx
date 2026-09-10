import { useState } from 'react'
import { Mail, Lock, AlertCircle, Check, Eye, EyeOff } from 'lucide-react'
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
      }, 1000)
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
      // Mock Local mode authentication for Google
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        onLogin({ email: 'google.user@example.com', isMock: true, provider: 'google' })
      }, 1000)
    }
  }

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes bounce {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      {/* ── LEFT PANEL ── */}
      <div style={styles.leftPanel}>
        {/* Grid overlay */}
        <div style={styles.gridOverlay} />

        {/* Logo top-left */}
        {/* <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <img src="/login-signup-image.png" alt="logo" />
          </div>
          <span style={styles.logoText}>Tabmark</span>
        </div> */}

        {/* Center illustration */}
        <div style={styles.illustrationWrap}>
          <img
            src="/image-tabmark.png"
            alt="App preview"
            style={styles.illustrationImg}
          />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>

          {/* Mode tabs */}
          <div style={styles.tabRow}>
            <button
              onClick={() => switchMode(false)}
              style={!isSignUp ? styles.tabActive : styles.tabInactive}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => switchMode(true)}
              style={isSignUp ? styles.tabActive : styles.tabInactive}
            >
              Đăng ký
            </button>
          </div>

          {/* Heading */}
          <h1 style={styles.heading}>
            {isSignUp ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
          </h1>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={styles.googleBtn}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8H6.3C9.7 35.7 16.3 40 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.2 35.4 44 30.1 44 24c0-1.3-.1-2.6-.4-3.9z" />
            </svg>
            {isSignUp ? 'Đăng ký với Google' : 'Đăng nhập với Google'}
          </button>

          {/* Divider */}
          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Error / Success */}
          {error && (
            <div style={styles.alertError}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div style={styles.alertSuccess}>
              <Check size={16} style={{ flexShrink: 0 }} />
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <Mail size={17} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={styles.input}
                onFocus={e => {
                  e.target.style.borderColor = '#5b6cf8'
                  e.target.style.boxShadow = '0 0 0 3px rgba(91,108,248,0.15)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a3a'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <Lock size={17} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ ...styles.input, paddingRight: '44px' }}
                onFocus={e => {
                  e.target.style.borderColor = '#5b6cf8'
                  e.target.style.boxShadow = '0 0 0 3px rgba(91,108,248,0.15)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a3a'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
              </button>
            </div>

            {/* Remember me (only for login) */}
            {!isSignUp && (
              <label style={styles.rememberRow}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={styles.rememberLabel}>Remember me</span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={e => !loading && (e.currentTarget.style.filter = 'brightness(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {loading ? (
                <span style={styles.spinner} />
              ) : isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
            </button>
          </form>

          {/* Switch mode link */}
          <p style={styles.switchText}>
            {isSignUp ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            <button
              type="button"
              onClick={() => switchMode(!isSignUp)}
              style={styles.switchLink}
            >
              {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
            </button>
          </p>

          {/* Quick Admin Demo Button */}
          <div className="pt-3 mt-1 border-t border-white/[0.08] text-center">
            <button
              type="button"
              onClick={() => {
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
              }}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <span>🛡️ Đăng nhập nhanh Admin (taquangtuan2016)</span>
            </button>
          </div>

          {/* Back to home */}
          <button
            type="button"
            onClick={onBackHome}
            style={styles.backBtn}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            ← Về trang chủ
          </button>

        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── inline styles ─────────────────────── */
const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* LEFT */
  leftPanel: {
    flex: '1 1 50%',
    position: 'relative',
    background: 'linear-gradient(135deg, #3b2fc9 0%, #5b35d5 40%, #7c4de8 70%, #6a3de8 100%)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '32px 36px',
    zIndex: 1,
  },
  logoIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  },
  illustrationWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px 48px',
    zIndex: 1,
  },
  illustrationImg: {
    width: '100%',
    maxWidth: '480px',
    animation: 'bounce 2s ease-in-out infinite',
    objectFit: 'contain',
    filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.4))',
  },

  /* RIGHT */
  rightPanel: {
    flex: '1 1 50%',
    background: '#111118',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 32px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },

  /* Tabs */
  tabRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '28px',
  },
  tabActive: {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '0 0 6px',
    borderBottom: '2px solid #5b6cf8',
    marginRight: '16px',
    letterSpacing: '-0.2px',
  },
  tabInactive: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0 0 6px',
    borderBottom: '2px solid transparent',
    marginRight: '16px',
    transition: 'color 0.2s',
    letterSpacing: '-0.2px',
  },

  /* Heading */
  heading: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-0.8px',
    margin: '0 0 28px',
    lineHeight: 1.15,
  },

  /* Google btn */
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    color: '#111118',
    border: 'none',
    borderRadius: '10px',
    padding: '13px 20px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '20px',
  },

  /* Divider */
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#2a2a3a',
  },
  dividerText: {
    color: '#6b7280',
    fontSize: '13px',
  },

  /* Alerts */
  alertError: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '16px',
  },
  alertSuccess: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#34d399',
    fontSize: '13px',
    marginBottom: '16px',
  },

  /* Form */
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#6b7280',
    pointerEvents: 'none',
    zIndex: 1,
  },
  input: {
    width: '100%',
    background: '#1a1a27',
    border: '1.5px solid #2a2a3a',
    borderRadius: '10px',
    padding: '13px 14px 13px 42px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
  },

  /* Remember me */
  rememberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    marginTop: '2px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#5b6cf8',
    cursor: 'pointer',
  },
  rememberLabel: {
    color: '#9ca3af',
    fontSize: '14px',
    userSelect: 'none',
  },

  /* Submit */
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #4f5cf7 0%, #6a3de8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'filter 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px',
    letterSpacing: '0.2px',
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  /* Bottom links */
  switchText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '20px',
    marginBottom: '0',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#7c8df8',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  backBtn: {
    display: 'block',
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '16px',
    transition: 'color 0.2s',
  },
}
