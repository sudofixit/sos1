import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Home, Headphones, User, Phone, MapPin, Wifi, Clock } from 'lucide-react'
import { getCheckoutSession } from '../services/api'

export function SuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      getCheckoutSession(sessionId)
        .then((result) => {
          setData(result)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-electric mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

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

        {/* Hero Section */}
        <div className="text-center mb-10">
          {/* Success Icon with glow effect */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy mb-3 font-space">
            Merci — SOS créé avec succès
          </h1>
          <p className="text-lg text-gray-500 mb-6">
            Thank you — Your SOS has been created successfully
          </p>

          {/* Subtitle */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Votre pré-autorisation de <span className="font-semibold text-navy">50 €</span> est confirmée.
              <br />
              Un technicien va vous être assigné dans les prochaines minutes{' '}
              <span className="font-semibold text-blue-electric">(ETA ≤ 2 h)</span>.
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Card Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-navy font-space">
                Récapitulatif de votre demande
              </h2>
              <p className="text-sm text-gray-500 mt-1">Request summary</p>
            </div>

            {/* Details Grid */}
            {data?.sos && (
              <div className="space-y-4 mb-6">
                <DetailRow
                  icon={<User className="w-5 h-5 text-blue-electric" />}
                  label="Nom / Name"
                  value={data.sos.name}
                />
                <DetailRow
                  icon={<Phone className="w-5 h-5 text-blue-electric" />}
                  label="Téléphone / Phone"
                  value={data.sos.phone}
                />
                <DetailRow
                  icon={<MapPin className="w-5 h-5 text-blue-electric" />}
                  label="Adresse / Address"
                  value={data.sos.address}
                />
                <DetailRow
                  icon={<Wifi className="w-5 h-5 text-blue-electric" />}
                  label="Opérateur / Operator"
                  value={data.sos.operator}
                />
                <DetailRow
                  icon={<Wifi className="w-5 h-5 text-blue-electric" />}
                  label="Type de connexion / Connection type"
                  value={data.sos.connectionType}
                />
                <DetailRow
                  icon={<Clock className="w-5 h-5 text-blue-electric" />}
                  label="Délai choisi / Preferred time window"
                  value={data.sos.delay}
                />
              </div>
            )}

            {/* Status Line */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-navy font-medium">
                ⏱️ Technicien à venir sous 2 heures • Paiement non encore capturé
              </p>
            </div>
          </div>
        </div>

        {/* Status Progress Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
              <ProgressStep
                number={1}
                label="Pré-autorisation confirmée"
                active={true}
                completed={true}
              />
              <ProgressStep
                number={2}
                label="Technicien assigné"
                active={false}
                completed={false}
              />
              <ProgressStep
                number={3}
                label="En route"
                active={false}
                completed={false}
              />
              <ProgressStep
                number={4}
                label="Connexion rétablie ✅"
                active={false}
                completed={false}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          {sessionId && (
            <Link
              to={`/track?session_id=${sessionId}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-electric text-white font-semibold rounded-2xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Clock className="w-5 h-5" />
              Suivre ma demande en temps réel
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-dark text-white font-semibold rounded-2xl hover:bg-navy transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Fermer et revenir à l'accueil
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-electric font-semibold rounded-2xl border-2 border-blue-electric hover:bg-blue-electric hover:text-white transition-all duration-200 w-full sm:w-auto"
          >
            <Headphones className="w-5 h-5" />
            Contacter le support
          </Link>
        </div>

        {/* Bottom Reassurance Note */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">
            Vous ne serez débité que si la connexion est rétablie.
            <br />
            Si le problème persiste, la pré-autorisation sera automatiquement libérée.
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper Components
interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="font-medium text-navy break-words">{value}</div>
      </div>
    </div>
  )
}

interface ProgressStepProps {
  number: number
  label: string
  active: boolean
  completed: boolean
}

function ProgressStep({ number, label, active, completed }: ProgressStepProps) {
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Connector Line (hidden on mobile, shown on desktop between steps) */}
      {number < 4 && (
        <div className="hidden sm:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
          {completed && <div className="h-full bg-blue-electric"></div>}
        </div>
      )}

      {/* Circle */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 transition-all ${
          completed || active
            ? 'bg-blue-electric text-white shadow-lg'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        {completed ? <CheckCircle2 className="w-6 h-6" /> : number}
      </div>

      {/* Label */}
      <p
        className={`text-xs sm:text-sm font-medium leading-tight ${
          completed || active ? 'text-navy' : 'text-gray-400'
        }`}
      >
        {label}
      </p>
    </div>
  )
}

