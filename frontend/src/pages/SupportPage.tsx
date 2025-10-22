import { Link } from 'react-router-dom'
import { Mail, Phone, ArrowLeft, Clock } from 'lucide-react'

export function SupportPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-electric hover:underline font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-navy mb-4 font-space">
            Contactez le Support
          </h1>
          <p className="text-lg text-gray-600">
            Notre équipe est là pour vous aider
          </p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-6">
          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-blue-electric rounded-full flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-navy mb-2">Email</h2>
                <p className="text-gray-600 mb-3">
                  Envoyez-nous un email et nous vous répondrons dans les plus brefs délais
                </p>
                <a
                  href="mailto:support@sos-connection.fr"
                  className="inline-flex items-center gap-2 text-blue-electric font-semibold hover:underline"
                >
                  support@sos-connection.fr
                </a>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-navy mb-2">Téléphone</h2>
                <p className="text-gray-600 mb-3">
                  Appelez-nous pour une assistance immédiate
                </p>
                <a
                  href="tel:+33123456789"
                  className="inline-flex items-center gap-2 text-green-600 font-bold text-xl hover:underline"
                >
                  +33 1 23 45 67 89
                </a>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Clock className="w-4 h-4" />
                  Lundi - Vendredi: 9h00 - 18h00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-navy mb-6 text-center">
            Questions Fréquentes
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-navy mb-2">
                💳 Quand serai-je débité ?
              </h3>
              <p className="text-gray-600">
                Vous ne serez débité que si le technicien résout votre problème de connexion. 
                La pré-autorisation de 50€ sera automatiquement libérée si le problème n'est pas résolu.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-navy mb-2">
                ⏱️ Combien de temps pour l'intervention ?
              </h3>
              <p className="text-gray-600">
                Un technicien sera assigné dans les minutes suivant votre demande et arrivera 
                chez vous dans un délai maximum de 2 heures.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-navy mb-2">
                🔄 Comment suivre ma demande ?
              </h3>
              <p className="text-gray-600">
                Après votre paiement, vous recevrez un lien de suivi par email. 
                Vous pourrez suivre en temps réel l'état de votre intervention.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-navy mb-2">
                ❌ Puis-je annuler ma demande ?
              </h3>
              <p className="text-gray-600">
                Oui, tant que le technicien n'est pas en route. Contactez-nous immédiatement 
                pour annuler votre demande sans frais.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Besoin d'aide supplémentaire ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-dark text-white font-semibold rounded-2xl hover:bg-navy transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Créer un SOS
            </Link>
            <a
              href="mailto:support@sos-connection.fr"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-electric font-semibold rounded-2xl border-2 border-blue-electric hover:bg-blue-electric hover:text-white transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              Envoyer un email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

