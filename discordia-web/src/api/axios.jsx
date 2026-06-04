import axios from 'axios'
import { clearAuthSession, getAuthToken } from '../services/authSession'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession()
    }

    return Promise.reject(error)
  }
)

export default api
