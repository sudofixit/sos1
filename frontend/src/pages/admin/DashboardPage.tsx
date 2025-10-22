import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  getRequests, 
  type SOSRequest 
} from '../../services/adminApi'
import { 
  LogOut, 
  Search,
  Filter, 
  RefreshCw, 
  Eye,
  Loader2,
  Calendar,
  User
} from 'lucide-react'

export function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<SOSRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [paymentFilter, setPaymentFilter] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRequests(statusFilter || undefined)
      setRequests(data.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  // Client-side filtering
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Search filter (name, phone, id)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          req.name.toLowerCase().includes(query) ||
          req.phone.toLowerCase().includes(query) ||
          req.id.toLowerCase().includes(query) ||
          req.email.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Payment filter
      if (paymentFilter) {
        if (paymentFilter === 'authorized' && !req.paymentIntentId) return false
        if (paymentFilter === 'captured' && req.status !== 'COMPLETED') return false
        if (paymentFilter === 'released' && req.status !== 'CANCELED' && req.status !== 'FAILED') return false
      }

      // Date filter
      if (dateFilter) {
        const reqDate = new Date(req.createdAt)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (dateFilter === 'today') {
          if (reqDate < today) return false
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          if (reqDate < weekAgo) return false
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          if (reqDate < monthAgo) return false
        }
      }

      return true
    })
  }, [requests, searchQuery, paymentFilter, dateFilter])

  const statusColors = {
    PENDING: 'bg-gray-100 text-gray-700 border-gray-300',
    ASSIGNED: 'bg-blue-100 text-blue-700 border-blue-300',
    COMPLETED: 'bg-green-100 text-green-700 border-green-300',
    FAILED: 'bg-red-100 text-red-700 border-red-300',
    CANCELED: 'bg-red-100 text-red-700 border-red-300',
  }

  const statusLabels = {
    PENDING: 'Ouvert',
    ASSIGNED: 'Assigné',
    COMPLETED: 'Résolu',
    FAILED: 'Non résolu',
    CANCELED: 'Annulé',
  }

  const getPaymentStatus = (req: SOSRequest) => {
    if (req.status === 'COMPLETED') return { label: 'Capturé', color: 'text-green-600' }
    if (req.status === 'CANCELED' || req.status === 'FAILED') return { label: 'Libéré', color: 'text-gray-600' }
    if (req.paymentIntentId) return { label: 'Empreinte', color: 'text-yellow-600' }
    return { label: 'En attente', color: 'text-gray-400' }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy-dark shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white font-space">
                Toutes les demandes SOS
              </h1>
              <p className="text-sm text-gray-300">
                Gestion et suivi des interventions
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total" value={requests.length} color="gray" />
          <StatCard label="Ouverts" value={requests.filter(r => r.status === 'PENDING').length} color="gray" />
          <StatCard label="Assignés" value={requests.filter(r => r.status === 'ASSIGNED').length} color="blue" />
          <StatCard label="Résolus" value={requests.filter(r => r.status === 'COMPLETED').length} color="green" />
          <StatCard label="Annulés" value={requests.filter(r => r.status === 'CANCELED' || r.status === 'FAILED').length} color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-navy mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, téléphone, référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Statut
              </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
                <option value="">Tous</option>
                <option value="PENDING">Ouvert</option>
              <option value="ASSIGNED">Assigné</option>
                <option value="COMPLETED">Résolu</option>
                <option value="FAILED">Non résolu</option>
              <option value="CANCELED">Annulé</option>
            </select>
          </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Paiement
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Tous</option>
                <option value="authorized">Empreinte</option>
                <option value="captured">Capturé</option>
                <option value="released">Libéré</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-3 pr-9 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
              >
                <option value="">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
              </select>
            </div>

            {/* Refresh Button */}
          <button
            onClick={fetchRequests}
            disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-navy rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <Loader2 className="w-8 h-8 animate-spin text-blue-electric mx-auto mb-4" />
            <p className="text-gray-600">Chargement des demandes...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-navy mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter || paymentFilter || dateFilter
                ? 'Essayez de modifier vos filtres'
                : 'Les nouvelles demandes apparaîtront ici'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Réf
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Opérateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Paiement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Technicien
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const payment = getPaymentStatus(request)
                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {request.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-navy">{request.name}</div>
                          <div className="text-xs text-gray-500">{request.phone}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {request.address}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {request.operator}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[request.status]}`}>
                            {statusLabels[request.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-sm font-medium ${payment.color}`}>
                            {payment.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {request.assignedTechnician ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-electric rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-navy truncate">
                                {request.assignedTechnician}
                              </span>
          </div>
        ) : (
                            <span className="text-sm text-gray-400">Non assigné</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => navigate(`/admin/request-detail/${request.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-dark text-white text-sm rounded-lg hover:bg-navy transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ouvrir
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper Components
interface StatCardProps {
  label: string
  value: number
  color: 'gray' | 'yellow' | 'blue' | 'green' | 'red'
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold rounded-lg inline-block px-2 ${colorClasses[color]}`}>
        {value}
      </div>
    </div>
  )
}
