import { useState, useEffect } from 'react'
import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'
import { PaymentModal } from '@/components/modals/payment-modal'
import { registerBackButtonHandler } from '@/lib/backButtonHandler'

export default function LandingPage({ onOpenDashboard, onLoginClick, user }) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  useEffect(() => {
    const unregister = registerBackButtonHandler(() => {
      if (paymentModalOpen) {
        setPaymentModalOpen(false)
        return true
      }
      return false
    })
    return unregister
  }, [paymentModalOpen])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onOpenDashboard={onOpenDashboard} onLoginClick={onLoginClick || onOpenDashboard} />
      <HeroSection onOpenDashboard={onOpenDashboard} />
      <FeaturesSection />
      <PricingSection onOpenDashboard={() => setPaymentModalOpen(true)} />
      <Footer />

      {paymentModalOpen && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          user={user}
          onUpgradeSuccess={() => onOpenDashboard()}
        />
      )}
    </div>
  )
}
