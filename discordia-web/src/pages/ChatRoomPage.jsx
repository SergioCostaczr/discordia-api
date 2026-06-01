import { useParams, useNavigate } from 'react-router-dom'

function ChatRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate('/rooms')}>
        Voltar para salas
      </button>

      <h1>Sala de Chat</h1>
      <p>ID da sala: {roomId}</p>

      <hr />

      <h2>Mensagens</h2>
      <p>O chat em tempo real será carregado aqui.</p>
    </div>
  )
}

export default ChatRoomPage