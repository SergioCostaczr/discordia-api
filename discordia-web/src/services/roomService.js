import api from '../api/axios'

export async function getRooms() {
  const response = await api.get('/api/rooms')
  return response.data
}

export async function joinRoom(roomId) {
  await api.post(`/api/rooms/${roomId}/join`)
}

export async function createRoom(name, description) {
  const response = await api.post('/api/rooms', {
    name,
    description,
  })

  return response.data
}

export async function deleteRoom(roomId) {
  await api.delete(`/api/rooms/${roomId}`)
}

export async function getRoomMembers(roomId) {
  const response = await api.get(`/api/rooms/${roomId}/members`)
  return response.data
}

export async function getRoomMessages(roomId) {
  const response = await api.get(`/api/rooms/${roomId}/messages?page=0&size=20`)
  return response.data
}

export async function deleteMessage(messageId) {
  await api.delete(`/api/messages/${messageId}`)
}
