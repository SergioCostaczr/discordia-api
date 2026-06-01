import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoomMessages } from '../services/roomService'
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToRoom,
  sendMessage,
} from '../services/websocketService'

function ChatRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getRoomMessages(roomId)

        const orderedMessages = [...data.content].reverse()
        setMessages(orderedMessages)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    const client = connectWebSocket()

    client.onConnect = () => {
      console.log('Conectado ao WebSocket')

      subscribeToRoom(roomId, (message) => {
        setMessages((previousMessages) => [
          ...previousMessages,
          message,
        ])
      })
    }

    return () => {
      disconnectWebSocket()
    }
  }, [roomId])

  function handleSendMessage(event) {
    event.preventDefault()

    if (!newMessage.trim()) {
      return
    }

    sendMessage(roomId, newMessage)
    setNewMessage('')
  }

  return (
    <div>
      <button onClick={() => navigate('/rooms')}>
        Voltar para salas
      </button>

      <h1>Sala de Chat</h1>
      <p>ID da sala: {roomId}</p>

      <hr />

      <h2>Mensagens</h2>

      {loading && <p>Carregando mensagens...</p>}

      {!loading && messages.length === 0 && (
        <p>Nenhuma mensagem ainda.</p>
      )}

      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.senderUsername}</strong>
          <p>{message.content}</p>
        </div>
      ))}

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}

export default ChatRoomPage