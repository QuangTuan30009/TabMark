import { useReveal } from '@/hooks/use-reveal'

export function RevealSection({ className = '', children, ...props }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} {...props}>
      {children}
    </div>
  )
}

export default RevealSection
