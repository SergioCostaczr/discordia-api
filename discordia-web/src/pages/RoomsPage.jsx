import { useEffect, useState } from 'react'
import { getRooms } from '../services/roomService'

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getRooms()
        setRooms(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    loadRooms()
  }, [])

  if (loading) {
    return <h2>Carregando salas...</h2>
  }

  return (
    <div>
      <h1>Salas Disponíveis</h1>

      {rooms.map((room) => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <p>{room.description}</p>
        </div>
      ))}
    </div>
  )
}

export default RoomsPage