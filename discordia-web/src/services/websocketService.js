import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAuthToken } from './authSession'

let stompClient = null

export function connectWebSocket() {
  const token = getAuthToken()

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS('http://localhost:8080/ws'),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,

    onConnect: () => {
      console.log('Conectado ao WebSocket')
    },

    onStompError: (frame) => {
      console.error('Erro STOMP:', frame)
    },
  })

  stompClient.activate()

  return stompClient
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate()
  }
}

export function subscribeToRoom(roomId, callback) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  return stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
    const body = JSON.parse(message.body)
    callback(body)
  })
}

export function subscribeToTyping(roomId, callback) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  return stompClient.subscribe(`/topic/room/${roomId}/typing`, (message) => {
    const body = JSON.parse(message.body)
    callback(body)
  })
}

export function subscribeToDeletedMessages(roomId, callback) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  return stompClient.subscribe(
    `/topic/room/${roomId}/messages/deleted`,
    (message) => {
      const body = JSON.parse(message.body)
      callback(body)
    }
  )
}

export function subscribeToChallengeEvents(callback) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  return stompClient.subscribe('/user/queue/challenges', (message) => {
    const body = JSON.parse(message.body)
    callback(body)
  })
}

export function subscribeToGameResults(callback) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  return stompClient.subscribe('/user/queue/game-results', (message) => {
    const body = JSON.parse(message.body)
    callback(body)
  })
}

export function sendMessage(roomId, content) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  stompClient.publish({
    destination: `/app/chat/${roomId}`,
    body: JSON.stringify({
      content,
    }),
  })
}

export function sendTyping(roomId, typing) {
  if (!stompClient || !stompClient.connected) {
    return
  }

  stompClient.publish({
    destination: `/app/typing/${roomId}`,
    body: JSON.stringify({
      typing,
    }),
  })
}
