import { Shield, Mail, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-navy-dark py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-300 text-sm">
            <span className="text-white font-semibold">
              © 2025 SOS Connection
            </span>
            <span className="hidden sm:inline text-gray-500">•</span>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-electric" />
              <span>Paiement sécurisé Stripe</span>
            </div>
            <span className="hidden sm:inline text-gray-500">•</span>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Mentions légales
            </a>
          </div>

          {/* Right side */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-300 text-sm">
            <Link
              to="/support"
              className="flex items-center gap-2 text-white hover:text-blue-electric transition-colors font-medium"
            >
              <Headphones className="w-4 h-4" />
              Support
            </Link>
            <span className="hidden sm:inline text-gray-500">•</span>
            <a
              href="mailto:support@sos-connection.fr"
              className="flex items-center gap-2 text-white hover:text-blue-electric transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              support@sos-connection.fr
            </a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          Service de dépannage internet à domicile • Intervention rapide dans toute l'Île-de-France
        </div>
      </div>
    </footer>
  )
}

