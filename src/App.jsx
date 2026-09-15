import { useEffect, useState, useRef } from 'react'
import { isSupabaseConfigured, getUserProfile } from '@/lib/bookmarksApi'
import LandingPage from '@/pages/LandingPage'
import WelcomeScreen from '@/pages/WelcomeScreen'
import AuthScreen from '@/pages/AuthScreen'
import { DashboardPage } from '@/pages/dashboard-page'
import { AdminPage } from '@/pages/admin-page'
import { supabase } from '@/lib/supabaseClient'
import { isAdminUser } from '@/lib/adminApi'
import { isInstalledApp } from '@/lib/platform'
import { setupHardwareBackButton } from '@/lib/backButtonHandler'

export default function App() {
  const [page, setPage] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#admin') return 'admin';
    if (hash === '#dashboard') return 'dashboard';
    if (hash === '#login') return 'login';
    if (hash.startsWith('#shared/')) return 'shared';
    if (isInstalledApp()) {
      const savedMock = localStorage.getItem('tabmark_mock_user');
      return savedMock ? 'dashboard' : 'login';
    }
    return 'home';
  })
  const [showWelcome, setShowWelcome] = useState(() => window.location.hash !== '#dashboard')
  const [user, setUser] = useState(null)
  const pageRef = useRef(page)
  pageRef.current = page

  // Initialize hardware back button handler for Android
  useEffect(() => {
    setupHardwareBackButton({
      getPage: () => pageRef.current,
      setPage: (newPage) => setPage(newPage),
    })
  }, [])

  // Sync user with profile data
  async function syncUserWithProfile(rawUser) {
    if (!rawUser) {
      setUser(null)
      return
    }
    try {
      const profile = await getUserProfile(rawUser.id)
      if (profile) {
        setUser({ ...rawUser, ...profile })
      } else {
        setUser(rawUser)
      }
    } catch {
      setUser(rawUser)
    }
  }

  // Restore session
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Restore from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncUserWithProfile(session.user)
          if (!window.location.hash.startsWith('#shared/')) {
            setShowWelcome(false)
            setPage('dashboard')
          }
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          syncUserWithProfile(session.user)
          setShowWelcome(false)
          // Chỉ chuyển sang dashboard nếu không truy cập từ link shared
          const hash = window.location.hash
          if (!hash.startsWith('#shared/')) {
            window.history.pushState(null, '', '#dashboard')
            setPage('dashboard')
          }
        } else {
          setUser(null)
        }
      })

      return () => subscription.unsubscribe()
    } else {
      // Restore from local storage for mock user
      try {
        const saved = localStorage.getItem('tabmark_mock_user')
        if (saved) {
          setUser(JSON.parse(saved))
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    function handlePopState() {
      const hash = window.location.hash
      if (hash === '#admin') {
        setPage('admin')
      } else if (hash === '#dashboard') {
        setPage('dashboard')
      } else if (hash === '#login') {
        setPage('login')
      } else if (hash.startsWith('#shared/')) {
        setPage('shared')
      } else {
        setPage('home')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function goToDashboard() {
    if (user) {
      window.history.pushState(null, '', '#dashboard')
      setPage('dashboard')
    } else {
      window.history.pushState(null, '', '#login')
      setPage('login')
    }
  }

  function goHome() {
    window.history.pushState(null, '', window.location.pathname)
    setPage('home')
  }

  function goToLogin() {
    window.history.pushState(null, '', '#login')
    setPage('login')
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
    if (loggedInUser.isMock) {
      localStorage.setItem('tabmark_mock_user', JSON.stringify(loggedInUser))
    }
    
    // Nếu đang ở link share, giữ nguyên link share
    if (window.location.hash.startsWith('#shared/')) {
      setPage('shared')
    } else if (window.location.hash === '#admin') {
      setPage('admin')
    } else {
      window.history.pushState(null, '', '#dashboard')
      setPage('dashboard')
    }
  }

  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('tabmark_mock_user')
      setUser(null)
    }
    window.history.pushState(null, '', window.location.pathname)
    setPage('home')
  }

  return (
    <>
      {showWelcome && !user && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
      
      {page === 'admin' ? (
        <AdminPage 
          user={user || { email: 'taquangtuan2016@gmail.com', full_name: 'Tạ Quang Tuấn', role: 'Super Admin' }} 
          onBack={goToDashboard} 
        />
      ) : page === 'login' ? (
        <AuthScreen onLogin={handleLogin} onBackHome={goHome} />
      ) : page === 'dashboard' || page === 'shared' ? (
        user ? (
          <DashboardPage 
            onBackHome={goHome} 
            user={user} 
            onLogout={handleLogout} 
            sharedCollectionId={page === 'shared' ? window.location.hash.replace('#shared/', '') : null}
          />
        ) : (
          <AuthScreen onLogin={handleLogin} onBackHome={goHome} />
        )
      ) : (
        <LandingPage onOpenDashboard={goToDashboard} onLoginClick={goToLogin} user={user} />
      )}
    </>
  )
}
