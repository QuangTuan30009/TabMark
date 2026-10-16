import { supabase } from '@/lib/supabase-client'

/**
 * Đăng xuất Google (chỉ cần sign out Supabase trên web)
 */
export async function logoutGoogle() {
  // No-op on web — Supabase handles full sign out in App.jsx
}

/**
 * Đăng nhập bằng Google OAuth redirect (Web only)
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase client chưa được cấu hình.')
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) throw error
  return { data, error: null }
}
