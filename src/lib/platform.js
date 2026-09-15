import { Capacitor } from '@capacitor/core'

/**
 * Checks if running inside native Android/iOS app via Capacitor
 */
export const isCapacitorNative = () => {
  try {
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

/**
 * Checks if running in standalone PWA or installed mobile web app
 */
export const isStandalonePWA = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

/**
 * Checks if running on a mobile touch screen device (phone or small tablet)
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return isCapacitorNative() || isStandalonePWA() || window.innerWidth <= 768
}

/**
 * Checks if the current environment is an installed app experience (Capacitor or PWA)
 */
export const isInstalledApp = () => {
  return isCapacitorNative() || isStandalonePWA()
}
