export function decodeJwt(token) {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(normalizedPayload)

    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return null
  }
}

export function saveAuthSession(token, fallbackUsername) {
  const payload = decodeJwt(token)
  const username = payload?.sub || fallbackUsername
  const role = payload?.role || 'USER'

  clearLegacyLocalSession()
  sessionStorage.setItem('token', token)
  sessionStorage.setItem('username', username)
  sessionStorage.setItem('role', role)
}

export function getAuthToken() {
  return sessionStorage.getItem('token')
}

export function getCurrentUsername() {
  return sessionStorage.getItem('username') || decodeJwt(getAuthToken())?.sub || ''
}

export function getCurrentUserRole() {
  return sessionStorage.getItem('role') || decodeJwt(getAuthToken())?.role || 'USER'
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function clearAuthSession() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('role')
  sessionStorage.removeItem('selectedRoomName')
  sessionStorage.removeItem('selectedRoomDescription')
  clearLegacyLocalSession()
}

export function saveSelectedRoom(room) {
  sessionStorage.setItem('selectedRoomName', room.name)
  sessionStorage.setItem('selectedRoomDescription', room.description || '')
}

export function getSelectedRoomName() {
  return sessionStorage.getItem('selectedRoomName') || 'geral'
}

export function getSelectedRoomDescription() {
  return sessionStorage.getItem('selectedRoomDescription') || ''
}

function clearLegacyLocalSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  localStorage.removeItem('selectedRoomName')
  localStorage.removeItem('selectedRoomDescription')
}
