export interface SOSRequest {
  name: string
  phone: string
  email: string
  address: string
  operator: string
  connectionType: string
  delay: string
  details: string
}

export interface CheckoutSession {
  id: string
  url: string
}

export enum SOSStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

