import api from '../api/axios'

export async function login(username, password) {
  const response = await api.post('/api/auth/login', {
    username,
    password,
  })

  return response.data
}

export async function register(username, password) {
  const response = await api.post('/api/auth/register', {
    username,
    password,
  })

  return response.data
}