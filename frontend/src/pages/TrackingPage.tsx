import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Home, Headphones, User, Phone, MapPin, Wifi, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { getCheckoutSession } from '../services/api'
import type { SOSRequest } from '../types/sos'

export function TrackingPage() {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('id')
  const sessionId = searchParams.get('session_id')
  
  const [request, setRequest] = useState<SOSRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = requestId || sessionId
    if (id) {
      fetchRequest(id)
    } else {
      setError('Aucun identifiant fourni')
      setLoading(false)
    }
  }, [requestId, sessionId])

  const fetchRequest = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getCheckoutSession(id)
      setRequest(result.sos)
    } catch (err: any) {
      setError('Demande introuvable ou identifiant invalide')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-electric mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre demande...</p>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy mb-2">Demande introuvable</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-dark text-white rounded-lg hover:bg-navy transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  // Determine step based on status and technician
  const getStatusInfo = () => {
    if (request.status === 'COMPLETED') {
      return {
        label: '🟩 Connexion rétablie',
        color: 'bg-green-100 text-green-700 border-green-300',
        step: 4,
        message: 'Votre connexion a été rétablie avec succès ! Le paiement a été capturé.'
      }
    }
    if (request.status === 'FAILED' || request.status === 'CANCELED') {
      return {
        label: '🔴 Non résolu',
        color: 'bg-red-100 text-red-700 border-red-300',
        step: 4,
        message: 'Le problème n\'a pas pu être résolu. Aucun paiement n\'a été effectué.'
      }
    }
    if (request.status === 'ASSIGNED' && request.assignedTechnician) {
      return {
        label: '🟨 Technicien en route',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        step: 3,
        message: `${request.assignedTechnician} est en route vers votre domicile.`
      }
    }
    if (request.status === 'ASSIGNED' && request.paymentIntentId) {
      return {
        label: '🟦 Paiement confirmé',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        step: 2,
        message: 'Votre pré-autorisation de 50€ est confirmée. Un technicien va vous être assigné.'
      }
    }
    return {
      label: '🟦 En attente de paiement',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      step: 1,
      message: 'Votre demande a été enregistrée. En attente de la confirmation du paiement.'
    }
  }

  const statusInfo = getStatusInfo()
  const currentStep = statusInfo.step

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

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-navy mb-2 font-space">
            Suivi de ma demande
          </h1>
          <p className="text-lg text-gray-500">Track my request</p>
        </div>

        {/* Status Card */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Reference */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">Référence / Reference</p>
              <p className="text-xl font-mono font-bold text-navy">
                SOS-{request.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <span className={`inline-flex px-6 py-3 rounded-full text-lg font-bold border-2 ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Status Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-navy font-medium">{statusInfo.message}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy mb-6 text-center">Progression</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2">
              <ProgressStep
                number={1}
                label="Demande créée"
                active={currentStep === 1}
                completed={currentStep > 1}
              />
              <ProgressStep
                number={2}
                label="50€ déposés"
                active={currentStep === 2}
                completed={currentStep > 2}
              />
              <ProgressStep
                number={3}
                label="Technicien en route"
                active={currentStep === 3}
                completed={currentStep > 3}
              />
              <ProgressStep
                number={4}
                label={request.status === 'COMPLETED' ? 'Résolu ✅' : request.status === 'FAILED' || request.status === 'CANCELED' ? 'Annulé ❌' : 'Résolu'}
                active={currentStep === 4}
                completed={currentStep >= 4}
              />
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-navy font-space mb-6 border-b border-gray-200 pb-4">
              Détails de votre demande
            </h2>

            <div className="space-y-4">
              <DetailRow
                icon={<User className="w-5 h-5 text-blue-electric" />}
                label="Nom / Name"
                value={request.name}
              />
              <DetailRow
                icon={<Phone className="w-5 h-5 text-blue-electric" />}
                label="Téléphone / Phone"
                value={request.phone}
              />
              <DetailRow
                icon={<MapPin className="w-5 h-5 text-blue-electric" />}
                label="Adresse / Address"
                value={request.address}
              />
              <DetailRow
                icon={<Wifi className="w-5 h-5 text-blue-electric" />}
                label="Opérateur / Operator"
                value={request.operator}
              />
              <DetailRow
                icon={<Wifi className="w-5 h-5 text-blue-electric" />}
                label="Type de connexion / Connection type"
                value={request.connectionType}
              />
              <DetailRow
                icon={<Clock className="w-5 h-5 text-blue-electric" />}
                label="Délai choisi / Preferred time window"
                value={request.delay}
              />
            </div>

            {/* Technician Info */}
            {request.assignedTechnician && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-electric rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Technicien assigné</p>
                    <p className="font-bold text-lg text-navy">En route vers vous</p>
                    {request.status === 'ASSIGNED' && (
                      <p className="text-xs text-yellow-700 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        🚗 Arrivée estimée sous 2 heures
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-dark text-white font-semibold rounded-2xl hover:bg-navy transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-electric font-semibold rounded-2xl border-2 border-blue-electric hover:bg-blue-electric hover:text-white transition-all duration-200 w-full sm:w-auto"
          >
            <Headphones className="w-5 h-5" />
            Contacter le support
          </Link>
        </div>

        {/* Support Note */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">
            Pour toute question, contactez{' '}
            <a href="mailto:support@sos-connection.fr" className="text-blue-electric hover:underline font-medium">
              support@sos-connection.fr
            </a>
            <br />
            Vous ne serez débité que si la connexion est rétablie.
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
      {/* Connector Line */}
      {number < 4 && (
        <div className="hidden sm:block absolute top-6 left-1/2 w-full h-0.5 -z-10">
          <div className={`h-full ${completed ? 'bg-blue-electric' : 'bg-gray-200'}`}></div>
        </div>
      )}

      {/* Circle */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 transition-all ${
          completed
            ? 'bg-blue-400 text-white shadow-lg'
            : active
            ? 'bg-blue-electric text-white shadow-lg ring-4 ring-blue-200'
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

