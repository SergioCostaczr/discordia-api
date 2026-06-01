import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getRooms,
  joinRoom,
  createRoom,
} from '../services/roomService'

function RoomsPage() {
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')

  useEffect(() => {
    loadRooms()
  }, [])

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

      setNewRoomName('')
      setNewRoomDescription('')

      loadRooms()
    } catch (error) {
      console.error(error)
      alert('Erro ao criar sala')
    }
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h1 style={styles.logo}>Discordia</h1>

        <div style={styles.createRoomContainer}>
          <h2 style={styles.sectionTitle}>
            Criar Sala
          </h2>

          <input
            type="text"
            placeholder="Nome da sala"
            value={newRoomName}
            onChange={(event) =>
              setNewRoomName(event.target.value)
            }
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Descrição"
            value={newRoomDescription}
            onChange={(event) =>
              setNewRoomDescription(event.target.value)
            }
            style={styles.input}
          />

          <button
            onClick={handleCreateRoom}
            style={styles.createButton}
          >
            Criar sala
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Salas Disponíveis</h2>
        </div>

        {loading && (
          <p style={styles.emptyText}>
            Carregando salas...
          </p>
        )}

        {!loading && rooms.length === 0 && (
          <p style={styles.emptyText}>
            Nenhuma sala disponível.
          </p>
        )}

        <div style={styles.roomsContainer}>
          {rooms.map((room) => (
            <div key={room.id} style={styles.roomCard}>
              <div>
                <h3 style={styles.roomName}>
                  # {room.name}
                </h3>

                <p style={styles.roomDescription}>
                  {room.description}
                </p>
              </div>

              <button
                onClick={() => handleJoinRoom(room.id)}
                style={styles.joinButton}
              >
                Entrar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--background-primary)',
  },

  sidebar: {
    width: '320px',
    backgroundColor: 'var(--background-secondary)',

    padding: '24px',

    borderRight: '1px solid var(--border-color)',
  },

  logo: {
    fontSize: '28px',
    marginBottom: '32px',
  },

  createRoomContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  sectionTitle: {
    marginBottom: '8px',
    color: 'var(--text-secondary)',
  },

  input: {
    backgroundColor: 'var(--background-primary)',
    border: '1px solid var(--border-color)',

    padding: '14px',
    borderRadius: '10px',

    color: 'var(--text-primary)',
  },

  createButton: {
    backgroundColor: 'var(--brand-color)',
    color: 'white',

    padding: '14px',
    borderRadius: '10px',

    fontWeight: 'bold',
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    padding: '24px',
    borderBottom: '1px solid var(--border-color)',
  },

  roomsContainer: {
    padding: '24px',

    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  roomCard: {
    backgroundColor: 'var(--background-secondary)',

    padding: '20px',
    borderRadius: '14px',

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    boxShadow: 'var(--shadow-default)',
  },

  roomName: {
    fontSize: '20px',
    marginBottom: '6px',
  },

  roomDescription: {
    color: 'var(--text-secondary)',
  },

  joinButton: {
    backgroundColor: 'var(--success-color)',
    color: 'white',

    padding: '12px 20px',
    borderRadius: '10px',

    fontWeight: 'bold',
  },

  emptyText: {
    padding: '24px',
    color: 'var(--text-secondary)',
  },
}

export default RoomsPage