import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies - auth happens via httpOnly cookie
})

// Types
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface SOSRequest {
  id: string
  name: string
  phone: string
  email: string
  address: string
  operator: string
  connectionType: string
  delay: string
  details: string
  status: 'PENDING' | 'ASSIGNED' | 'COMPLETED' | 'FAILED' | 'CANCELED'
  stripeSessionId: string | null
  paymentIntentId: string | null
  assignedTechnician: string | null
  createdAt: string
  updatedAt: string
}

export interface RequestsResponse {
  data: SOSRequest[]
}

// Auth
export const login = async (credentials: LoginRequest) => {
  const response = await adminApi.post('/auth/login', credentials)
  return response.data
}

// Requests
export const getRequests = async (status?: string) => {
  const params = status ? { status } : {}
  const response = await adminApi.get<RequestsResponse>('/admin/requests', { params })
  return response.data
}

export const getRequestById = async (id: string) => {
  const response = await adminApi.get<{ data: SOSRequest }>(`/admin/requests/${id}`)
  return response.data
}

// Payment actions
export const capturePayment = async (paymentIntentId: string) => {
  const response = await adminApi.post('/admin/capture', { payment_intent_id: paymentIntentId })
  return response.data
}

export const cancelPayment = async (paymentIntentId: string) => {
  const response = await adminApi.post('/admin/cancel', { payment_intent_id: paymentIntentId })
  return response.data
}

// Technician assignment
export const assignTechnician = async (requestId: string) => {
  const response = await adminApi.post(`/admin/requests/${requestId}/assign`, { technician: 'Technicien SOS' })
  return response.data
}

