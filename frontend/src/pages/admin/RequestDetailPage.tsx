import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  getRequestById,
  capturePayment, 
  cancelPayment,
  assignTechnician,
  type SOSRequest 
} from '../../services/adminApi'
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Wifi,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock
} from 'lucide-react'
import { Toast, type ToastType } from '../../components/admin/Toast'
import { ConfirmModal } from '../../components/admin/ConfirmModal'

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  const [request, setRequest] = useState<SOSRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' })
  
  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean
    type: 'capture' | 'release' | null
  }>({ show: false, type: null })

  useEffect(() => {
    if (id) {
      fetchRequestDetail()
    }
  }, [id])

  const fetchRequestDetail = async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await getRequestById(id)
      setRequest(data.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement de la demande')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type })
  }

  const handleAssignTechnician = async () => {
    if (!id) return
    
    setAssignLoading(true)
    try {
      await assignTechnician(id)
      showToast('✅ Technicien assigné avec succès', 'success')
      await fetchRequestDetail()
    } catch (err: any) {
      showToast(err.response?.data?.error || '❌ Erreur lors de l\'assignation', 'error')
    } finally {
      setAssignLoading(false)
    }
  }

  const handleCapture = async () => {
    if (!request?.paymentIntentId) return
    
    setConfirmModal({ show: false, type: null })
    setActionLoading(true)
    
    try {
      await capturePayment(request.paymentIntentId)
      showToast('✅ Paiement capturé avec succès', 'success')
      await fetchRequestDetail()
    } catch (err: any) {
      showToast(err.response?.data?.error || '❌ Erreur lors de la capture du paiement', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRelease = async () => {
    if (!request?.paymentIntentId) return
    
    setConfirmModal({ show: false, type: null })
    setActionLoading(true)
    
    try {
      await cancelPayment(request.paymentIntentId)
      showToast('⚪ Empreinte libérée avec succès', 'success')
      await fetchRequestDetail()
    } catch (err: any) {
      showToast(err.response?.data?.error || '❌ Erreur lors de la libération', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const canManagePayment = request?.status === 'ASSIGNED' && request?.paymentIntentId

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-electric mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-navy mb-2">Demande introuvable</h2>
          <p className="text-gray-600 mb-6">{error || 'Cette demande n\'existe pas'}</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 bg-navy-dark text-white rounded-lg hover:bg-navy transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={confirmModal.show && confirmModal.type === 'capture'}
        title="Capturer le paiement"
        message="Confirmer la capture de 50 € ?"
        confirmText="Confirmer la capture"
        onConfirm={handleCapture}
        onCancel={() => setConfirmModal({ show: false, type: null })}
        type="primary"
      />

      <ConfirmModal
        isOpen={confirmModal.show && confirmModal.type === 'release'}
        title="Libérer l'empreinte"
        message="Confirmer la libération de l'empreinte ?"
        confirmText="Libérer l'empreinte"
        onConfirm={handleRelease}
        onCancel={() => setConfirmModal({ show: false, type: null })}
        type="danger"
      />

      {/* Header */}
      <header className="bg-navy-dark shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center justify-center p-2.5 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Retour au tableau de bord"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white font-space">
                  Détail de la demande
                </h1>
                <p className="text-sm text-gray-300 font-mono">
                  Réf: {request.id.slice(0, 12)}...
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Client Info */}
          <div className="space-y-6">
            {/* Client Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-electric" />
                Informations client
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="text-base font-semibold text-navy">{request.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Téléphone</div>
                    <div className="text-base font-semibold text-navy">{request.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-base font-semibold text-navy">{request.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Adresse d'intervention</div>
                    <div className="text-base font-semibold text-navy">{request.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-electric" />
                Informations techniques
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Opérateur</div>
                    <div className="text-base font-semibold text-navy">{request.operator}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Type de connexion</div>
                    <div className="text-base font-semibold text-navy">{request.connectionType}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Délai souhaité</div>
                    <div className="text-base font-semibold text-navy">{request.delay}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Date de création</div>
                    <div className="text-base font-semibold text-navy">
                      {new Date(request.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>

                {request.details && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Détails du problème</div>
                    <div className="text-base text-gray-700 bg-gray-50 rounded-lg p-3">
                      {request.details}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - Payment Card */}
          <div className="space-y-6">
            {/* Payment Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy mb-4">Paiement & Actions</h2>
              
              {/* Payment Status */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Statut du paiement</div>
                <div className="text-lg font-bold text-navy">
                  {request.status === 'PENDING' && '⏳ En attente d\'autorisation'}
                  {request.status === 'ASSIGNED' && '💳 Empreinte 50 € (non débitée)'}
                  {request.status === 'COMPLETED' && '✅ Capturé'}
                  {request.status === 'CANCELED' && '🔄 Libéré'}
                  {request.status === 'FAILED' && '❌ Échec'}
                </div>
              </div>

              {/* Technician Assignment - Only if payment authorized and not assigned yet */}
              {request.status === 'ASSIGNED' && !request.assignedTechnician && request.paymentIntentId && (
                <div className="mb-6">
                  <button
                    onClick={handleAssignTechnician}
                    disabled={assignLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-electric text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {assignLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Assignation...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Assigner un technicien
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Show assigned status */}
              {request.assignedTechnician && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-electric rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Technicien assigné</div>
                    <div className="font-bold text-navy">En route vers le client</div>
                  </div>
                </div>
              )}

              {/* Payment Actions - Only if technician assigned */}
              {request.assignedTechnician && canManagePayment && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setConfirmModal({ show: true, type: 'capture' })}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Résolu - Capturer 50€
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setConfirmModal({ show: true, type: 'release' })}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-semibold"
                  >
                    <XCircle className="w-5 h-5" />
                    Non résolu - Libérer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

