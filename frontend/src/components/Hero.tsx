import { MapPin, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  const scrollToForm = () => {
    document.getElementById('sos-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-background pt-8 pb-16 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold text-navy font-space">
            SOS Connection
          </div>
          <Link
            to="/support"
            className="inline-flex items-center gap-2 px-4 py-2 text-navy-dark hover:text-blue-electric transition-colors font-medium"
          >
            <Headphones className="w-5 h-5" />
            <span className="hidden sm:inline">Support</span>
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <MapPin className="w-4 h-4 text-blue-electric" />
            <span className="text-sm font-medium text-navy">
              Intervention locale • Paris & Île-de-France
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-5xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6">
            Je récupère ma connexion{' '}
            <span className="text-blue-electric">
              en moins de 2 heures
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Un technicien intervient rapidement à domicile pour rétablir votre fibre, Wi-Fi ou box.
            Une empreinte bancaire de 50€ est prise et vous n'êtes débité que si la connexion revient.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-navy-dark text-white font-semibold rounded-lg hover:bg-navy transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Créer un SOS maintenant
          </button>
          <button
            onClick={scrollToHowItWorks}
            className="px-8 py-4 bg-white text-navy-dark font-semibold rounded-lg border-2 border-navy-dark hover:bg-navy-dark hover:text-white transition-all duration-200 w-full sm:w-auto"
          >
            Comment ça marche
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <StatCard
            value="≤2h"
            label="Arrivée technicien"
            color="blue-electric"
          />
          <StatCard
            value="95%"
            label="Connexions rétablies"
            color="blue-electric"
          />
          <StatCard
            value="50€"
            label="Empreinte bancaire"
            color="blue-electric"
          />
          <StatCard
            value="0€"
            label="Si non résolu"
            color="blue-electric"
          />
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  value: string
  label: string
  color: string
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-navy-dark rounded-xl p-6 text-center card-shadow">
      <div className="text-3xl sm:text-4xl font-bold text-blue-electric mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-300 font-medium">
        {label}
      </div>
    </div>
  )
}

