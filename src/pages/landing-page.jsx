import { useState } from 'react'
import { Navbar } from '@/components/features/landing/navbar'
import { HeroSection } from '@/components/features/landing/hero-section'
import { FeaturesSection } from '@/components/features/landing/features-section'
import { PricingSection } from '@/components/features/landing/pricing-section'
import { Footer } from '@/components/features/landing/footer'
import { PaymentModal } from '@/components/modals/payment-modal'

export default function LandingPage({ onOpenDashboard, onLoginClick, user }) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('pro')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onOpenDashboard={onOpenDashboard} onLoginClick={onLoginClick || onOpenDashboard} />
      <HeroSection onOpenDashboard={onOpenDashboard} />
      <FeaturesSection />
      <PricingSection
        onSelectPlan={(planId) => {
          setSelectedPlanId(planId)
          setPaymentModalOpen(true)
        }}
        onOpenDashboard={() => {
          setSelectedPlanId('pro')
          setPaymentModalOpen(true)
        }}
      />
      <Footer />

      {paymentModalOpen && (
        <PaymentModal
          isOpen={paymentModalOpen}
          initialPlanId={selectedPlanId}
          onClose={() => setPaymentModalOpen(false)}
          user={user}
          onUpgradeSuccess={() => onOpenDashboard()}
        />
      )}
    </div>
  )
}
