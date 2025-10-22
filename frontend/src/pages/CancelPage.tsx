import { Link } from 'react-router-dom'
import { XCircle, Home, Headphones } from 'lucide-react'

export function CancelPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1160px]">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-xl font-bold text-navy font-space hover:text-blue-electric transition-colors">
            SOS Connection
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center gap-2 px-4 py-2 text-navy-dark hover:text-blue-electric transition-colors font-medium"
          >
            <Headphones className="w-5 h-5" />
            <span className="hidden sm:inline">Support</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-10">
            {/* Cancel Icon - Soft, Not Alarming */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-gray-400" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy mb-3 font-space">
              Pré-autorisation annulée
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              Pre-authorization canceled
            </p>

            {/* Subtitle */}
            <div className="max-w-xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Aucun débit n'a été effectué.
                <br />
                Vous pouvez réessayer à tout moment.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-dark text-white font-semibold rounded-2xl hover:bg-navy transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              Revenir à l'accueil
            </Link>
          </div>

          {/* Support Microcopy */}
          <div className="max-w-xl mx-auto">
            <p className="text-sm text-gray-500 leading-relaxed">
              Si vous rencontrez un problème avec le paiement ou le formulaire, contactez-nous à{' '}
              <a
                href="mailto:support@sos-connection.fr"
                className="text-blue-electric font-medium hover:underline"
              >
                support@sos-connection.fr
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

