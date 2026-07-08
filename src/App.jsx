import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/src/lib/bookmarksApi'
import LandingPage from './LandingPage'
import WelcomeScreen from './WelcomeScreen'
import AuthScreen from './AuthScreen'
import { DashboardPage } from './pages/dashboard-page'
import { supabase } from '@/src/lib/supabaseClient'

export default function App() {
  const [page, setPage] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#dashboard') return 'dashboard';
    if (hash === '#login') return 'login';
    if (hash.startsWith('#shared/')) return 'shared';
    return 'home';
  })
  const [showWelcome, setShowWelcome] = useState(() => window.location.hash !== '#dashboard')
  const [user, setUser] = useState(null)

  // Restore session
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Restore from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setPage('dashboard')
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
      if (hash === '#dashboard') {
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
      {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
      
      {page === 'login' ? (
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
        <LandingPage onOpenDashboard={goToDashboard} onLoginClick={goToLogin} />
      )}
    </>
  )
}
