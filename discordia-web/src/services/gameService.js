import api from '../api/axios'

export async function challengeUser(roomId, challengedUserId) {
  const response = await api.post('/api/games/challenge', {
    roomId,
    challengedUserId,
  })

  return response.data
}

export async function acceptChallenge(roundId) {
  const response = await api.post(`/api/games/${roundId}/accept`)
  return response.data
}

export async function declineChallenge(roundId) {
  await api.post(`/api/games/${roundId}/decline`)
}

export async function submitMove(roundId, move) {
  await api.post(`/api/games/${roundId}/move`, {
    move,
  })
}
