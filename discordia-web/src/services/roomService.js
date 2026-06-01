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