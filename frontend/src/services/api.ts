import axios from 'axios'
import type { SOSRequest, CheckoutSession } from '../types/sos'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const createCheckoutSession = async (data: SOSRequest): Promise<CheckoutSession> => {
  const response = await api.post('/create-checkout-session', {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    operator: data.operator,
    connection_type: data.connectionType,
    delay: data.delay,
    details: data.details,
  })
  return response.data
}

export const getCheckoutSession = async (sessionId: string) => {
  const response = await api.get(`/checkout-session/${sessionId}`)
  return response.data
}

