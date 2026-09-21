import { SocialLogin } from '@capgo/capacitor-social-login'
import { supabase } from './supabaseClient'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()


let isInitialized = false

/**
 * Xóa sạch trạng thái đăng nhập Google trong localStorage để tránh xung đột session
 */
export function clearGoogleAuthState() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem('capgo_social_login_google_state')
    window.localStorage.removeItem('capgo_social_login_oauth_pending')
  } catch (e) {
    console.warn('[GoogleAuth] Không thể xóa cache google auth:', e)
  }
}

/**
 * Đăng xuất Google hoàn toàn (clear cache + revoke trên provider)
 */
export async function logoutGoogle() {
  clearGoogleAuthState()
  try {
    await SocialLogin.logout({ provider: 'google' })
  } catch {
    // Bỏ qua lỗi nếu chưa từng đăng nhập qua SocialLogin
  }
}

/**
 * Initialize Google Auth for both Web and Capacitor Mobile
 */
export async function initGoogleAuth() {
  if (isInitialized || !GOOGLE_CLIENT_ID) return
  try {
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined
    await SocialLogin.initialize({
      google: {
        webClientId: GOOGLE_CLIENT_ID,
        mode: 'online',
        redirectUrl,
      },
    })
    isInitialized = true
  } catch (err) {
    console.warn('[GoogleAuth] Khởi tạo Google Auth thất bại:', err)
  }
}

/**
 * Perform Google Sign-In:
 * - Uses Google ID Token directly on Web & Mobile (avoids ...supabase.co domain completely!)
 * - Gracefully falls back to standard Supabase OAuth if VITE_GOOGLE_CLIENT_ID is not configured
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase client chưa được cấu hình.')
  }

  // 1. If Google Web Client ID is configured, use Google ID Token (Direction 2)
  if (GOOGLE_CLIENT_ID) {
    try {
      // Dọn dẹp cache phiên cũ trước khi mở luồng đăng nhập mới
      clearGoogleAuthState()
      await initGoogleAuth()

      const response = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          prompt: 'select_account',
        },
      })

      const idToken = response?.result?.idToken

      if (!idToken) {
        throw new Error('Không nhận được ID Token từ Google.')
      }

      // Authenticate with Supabase via ID token (100% Free Supabase tier)
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      })

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      // User cancelled login or closed popup
      const errMsg = err?.message || ''
      if (
        errMsg.toLowerCase().includes('cancel') ||
        errMsg.toLowerCase().includes('closed') ||
        errMsg.toLowerCase().includes('dismiss')
      ) {
        return { data: null, error: null, cancelled: true }
      }

      console.warn('[GoogleAuth] Lỗi đăng nhập bằng ID Token, thử chuyển sang OAuth mặc định:', err)
      // If error occurs, fallback to standard OAuth
    }
  } else {
    console.warn('[GoogleAuth] Chưa cấu hình VITE_GOOGLE_CLIENT_ID trong .env. Sử dụng OAuth redirect mặc định.')
  }

  // 2. Fallback to Supabase OAuth redirect
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) throw error
  return { data, error: null }
}
