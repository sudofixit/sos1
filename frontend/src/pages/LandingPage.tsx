import { Hero } from '../components/Hero'
import { SOSForm } from '../components/SOSForm'
import { HowItWorks } from '../components/HowItWorks'
import { FAQ } from '../components/FAQ'
import { Footer } from '../components/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SOSForm />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  )
}

