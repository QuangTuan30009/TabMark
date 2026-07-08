import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage({ onOpenDashboard, onLoginClick }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onOpenDashboard={onOpenDashboard} onLoginClick={onLoginClick || onOpenDashboard} />
      <HeroSection onOpenDashboard={onOpenDashboard} />
      <FeaturesSection />
      <PricingSection onOpenDashboard={onOpenDashboard} />
      <Footer />
    </div>
  )
}
