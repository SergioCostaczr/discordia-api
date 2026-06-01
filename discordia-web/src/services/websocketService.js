import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient = null

export function connectWebSocket(onMessageReceived) {
  const token = localStorage.getItem('token')

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

  stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
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