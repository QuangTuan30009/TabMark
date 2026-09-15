import { App as CapacitorApp } from '@capacitor/app'
import Swal from 'sweetalert2'

// LIFO Stack for modal / drawer / subview back handlers
const backHandlers = []
let lastBackPressTime = 0

/**
 * Register a back button handler.
 * Handlers are executed in LIFO order (last registered = topmost modal).
 * If the handler returns true (or truthy), propagation stops.
 * If it returns false, it delegates to the next handler in the stack.
 */
export function registerBackButtonHandler(handler) {
  backHandlers.push(handler)
  return () => {
    const idx = backHandlers.lastIndexOf(handler)
    if (idx > -1) {
      backHandlers.splice(idx, 1)
    }
  }
}

/**
 * Initialize global hardware Back button listener for Android
 */
export function setupHardwareBackButton({ getPage, setPage, isRootPage }) {
  try {
    CapacitorApp.addListener('backButton', () => {
      // 1. If SweetAlert2 modal is currently visible, close it first
      if (Swal.isVisible()) {
        Swal.close()
        return
      }

      // 2. If any registered component (modal / sidebar / sheet) handles it, run it
      if (backHandlers.length > 0) {
        for (let i = backHandlers.length - 1; i >= 0; i--) {
          const handler = backHandlers[i]
          const handled = handler()
          if (handled !== false) {
            return
          }
        }
      }

      const currentPage = typeof getPage === 'function' ? getPage() : ''

      // 3. Navigation between sub-pages
      if (currentPage === 'admin') {
        if (typeof setPage === 'function') {
          window.history.pushState(null, '', '#dashboard')
          setPage('dashboard')
        }
        return
      }

      if (currentPage === 'login') {
        if (typeof setPage === 'function') {
          window.history.pushState(null, '', window.location.pathname)
          setPage('home')
        }
        return
      }

      if (currentPage === 'shared') {
        if (typeof setPage === 'function') {
          window.history.pushState(null, '', window.location.pathname)
          setPage('home')
        }
        return
      }

      // 4. On Root / Dashboard / Home: Double-tap back within 2s to exit app gracefully
      const now = Date.now()
      if (now - lastBackPressTime < 2000) {
        CapacitorApp.exitApp()
      } else {
        lastBackPressTime = now
        Swal.mixin({
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 1800,
          background: '#0f172a',
          color: '#f8fafc',
          customClass: {
            popup: 'rounded-xl border border-white/10 shadow-lg text-xs'
          }
        }).fire({
          icon: 'info',
          title: 'Nhấn Back lần nữa để thoát ứng dụng'
        })
      }
    })
  } catch (err) {
    console.warn('[BackButton] Lỗi khởi tạo BackButton listener:', err)
  }
}
