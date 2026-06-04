export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const WS_URL = `${API_BASE_URL}/ws`
