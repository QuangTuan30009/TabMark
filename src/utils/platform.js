/**
 * Checks if running on a mobile touch screen device (phone or small tablet)
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}
