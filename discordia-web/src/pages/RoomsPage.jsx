import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRooms, joinRoom, createRoom } from '../services/roomService'

function RoomsPage() {
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getRooms()
        setRooms(data)
      } catch (error) {
        setError('Erro ao carregar salas.')
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [])

  async function handleJoinRoom(roomId) {
  try {
    await joinRoom(roomId)
  } catch (error) {
    const message = error.response?.data?.message || ''

    if (!message.toLowerCase().includes('já está na sala')) {
      console.error(error)
      alert(message || 'Erro ao entrar na sala.')
      return
    }
  }

  navigate(`/rooms/${roomId}`)
}

  async function handleCreateRoom() {
  try {
    await createRoom(newRoomName, newRoomDescription)

    const updatedRooms = await getRooms()
    setRooms(updatedRooms)

    setNewRoomName('')
    setNewRoomDescription('')
  } catch (error) {
    console.error(error)
    alert('Erro ao criar sala')
  } 
}

  if (loading) {
    return <h2>Carregando salas...</h2>
  }

  return (
    <div>
      <h1>Salas Disponíveis</h1>
      <div>
  <h2>Criar nova sala</h2>

  <input
    type="text"
    placeholder="Nome da sala"
    value={newRoomName}
    onChange={(event) => setNewRoomName(event.target.value)}
  />

  <input
    type="text"
    placeholder="Descrição da sala"
    value={newRoomDescription}
    onChange={(event) => setNewRoomDescription(event.target.value)}
  />

  <button onClick={handleCreateRoom}>
    Criar sala
  </button>
</div>

      {error && <p>{error}</p>}

      {rooms.length === 0 && <p>Nenhuma sala disponível.</p>}

      {rooms.map((room) => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <p>{room.description}</p>

          <button onClick={() => handleJoinRoom(room.id)}>
            Entrar
          </button>
        </div>
      ))}
    </div>
  )
}

export default RoomsPage