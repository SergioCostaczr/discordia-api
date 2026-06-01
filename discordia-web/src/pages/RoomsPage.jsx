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

  const username = localStorage.getItem('username') || 'Você'

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

  async function handleJoinRoom(room) {
    try {
      await joinRoom(room.id)
    } catch (error) {
      const message = error.response?.data?.message || ''

      if (!message.toLowerCase().includes('já está na sala')) {
        console.error(error)
        alert(message || 'Erro ao entrar na sala.')
        return
      }
    }

    localStorage.setItem('selectedRoomName', room.name)
    localStorage.setItem('selectedRoomDescription', room.description || '')

    navigate(`/rooms/${room.id}`)
  }

  async function handleCreateRoom(event) {
    event.preventDefault()

    if (!newRoomName.trim()) {
      alert('Informe o nome da sala.')
      return
    }

    try {
      await createRoom(newRoomName, newRoomDescription)

      setNewRoomName('')
      setNewRoomDescription('')

      loadRooms()
    } catch (error) {
      console.error(error)
      alert('Erro ao criar sala.')
    }
  }

  return (
    <div style={styles.app}>
      <aside style={styles.serverBar}>
        <div style={styles.serverLogo}>D</div>

        <div style={styles.serverDivider} />

        <div style={styles.serverButton}>#</div>
      </aside>

      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.logo}>Discordia</h1>
          <div style={styles.onlineDot} />
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileAvatar}>
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{username}</strong>
            <p style={styles.onlineText}>online</p>
          </div>
        </div>

        <form style={styles.createCard} onSubmit={handleCreateRoom}>
          <div style={styles.createGlow} />

          <h2 style={styles.createTitle}>Criar nova sala</h2>

          <p style={styles.createText}>
            Abra um espaço para conversar, testar o chat ou jogar com seus amigos.
          </p>

          <input
            type="text"
            placeholder="Nome da sala"
            value={newRoomName}
            onChange={(event) => setNewRoomName(event.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Descrição"
            value={newRoomDescription}
            onChange={(event) => setNewRoomDescription(event.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.createButton}>
            Criar sala
          </button>
        </form>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.pageTitle}>Escolha uma sala</h2>
            <p style={styles.pageSubtitle}>
              Entre em um canal disponível e comece a conversar em tempo real.
            </p>
          </div>

          <button style={styles.refreshButton} onClick={loadRooms}>
            Atualizar
          </button>
        </header>

        <section style={styles.hero}>
          <div>
            <p style={styles.heroEyebrow}>DISCORDIA WEB</p>
            <h1 style={styles.heroTitle}>
              Conversas rápidas, salas simples e tempo real de verdade.
            </h1>
            <p style={styles.heroText}>
              Escolha uma sala para entrar no chat ou crie um novo espaço para testar a aplicação.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeNumber}>{rooms.length}</span>
            <span style={styles.heroBadgeLabel}>
              {rooms.length === 1 ? 'sala ativa' : 'salas ativas'}
            </span>
          </div>
        </section>

        <section style={styles.roomsSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Salas disponíveis</h3>
            <span style={styles.sectionCount}>{rooms.length}</span>
          </div>

          {loading && (
            <div style={styles.centerState}>
              <p>Carregando salas...</p>
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>#</div>

              <h2>Nenhuma sala disponível</h2>

              <p>
                Crie a primeira sala na barra lateral para começar a testar o Discordia.
              </p>
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <div style={styles.roomsGrid}>
              {rooms.map((room, index) => (
                <article
  key={room.id}
  style={styles.roomCard}
  onMouseEnter={(event) => {
    event.currentTarget.style.transform =
      'translateY(-6px)'

    event.currentTarget.style.boxShadow =
      '0 24px 50px rgba(0,0,0,0.32)'

    event.currentTarget.style.border =
      '1px solid rgba(88,101,242,0.35)'
  }}
  onMouseLeave={(event) => {
    event.currentTarget.style.transform =
      'translateY(0)'

    event.currentTarget.style.boxShadow =
      '0 14px 35px rgba(0,0,0,0.18)'

    event.currentTarget.style.border =
      '1px solid rgba(255,255,255,0.07)'
  }}
>
                  <div style={styles.cardGlow} />

                  <div style={styles.roomTop}>
                    <div style={styles.roomIcon}>#</div>

                    <span style={styles.roomTag}>
                      canal {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 style={styles.roomName}>{room.name}</h3>

                  <p style={styles.roomDescription}>
                    {room.description || 'Sala sem descrição.'}
                  </p>

                  <div style={styles.roomFooter}>
                    <div style={styles.roomMeta}>
                      <span style={styles.liveDot} />
                      <span>tempo real</span>
                    </div>

                    <button
                      style={styles.joinButton}
                      onClick={() => handleJoinRoom(room)}
                    >
                      Entrar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

const styles = {
  app: {
    display: 'grid',
    gridTemplateColumns: '72px 340px 1fr',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #313338, #26282d)',
    color: '#f2f3f5',
  },

  serverBar: {
    backgroundColor: '#1e1f22',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '16px',
    gap: '14px',
  },

  serverLogo: {
    width: '50px',
    height: '50px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #7b5cff, #5865f2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
    fontSize: '22px',
    boxShadow: '0 10px 30px rgba(88,101,242,0.45)',
  },

  serverDivider: {
    width: '34px',
    height: '2px',
    backgroundColor: '#3f4147',
  },

  serverButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#2b2d31',
    color: '#f2f3f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
  },

  sidebar: {
    backgroundColor: '#2b2d31',
    borderRight: '1px solid #3f4147',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  sidebarHeader: {
    height: '72px',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #3f4147',
  },

  logo: {
    fontSize: '32px',
    fontWeight: '900',
    letterSpacing: '-1px',
  },

  onlineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#23a559',
    boxShadow: '0 0 12px rgba(35,165,89,0.9)',
  },

  profileCard: {
    margin: '18px',
    padding: '16px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  profileAvatar: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #5865f2, #23a559)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
  },

  onlineText: {
    color: '#23a559',
    fontSize: '13px',
  },

  createCard: {
    position: 'relative',
    overflow: 'hidden',
    margin: '0 18px 18px',
    padding: '22px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(88,101,242,0.18), rgba(35,165,89,0.08))',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  createGlow: {
    position: 'absolute',
    top: '-45px',
    right: '-45px',
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(123,92,255,0.4), transparent)',
    filter: 'blur(12px)',
  },

  createTitle: {
    position: 'relative',
    zIndex: 1,
    fontSize: '24px',
    lineHeight: 1.1,
  },

  createText: {
    position: 'relative',
    zIndex: 1,
    color: '#d7d9dc',
    lineHeight: 1.5,
    fontSize: '14px',
    marginBottom: '4px',
  },

  input: {
    position: 'relative',
    zIndex: 1,
    height: '46px',
    borderRadius: '14px',
    border: '1px solid #3f4147',
    backgroundColor: '#232428',
    color: '#f2f3f5',
    padding: '0 14px',
    fontSize: '14px',
  },

  createButton: {
    position: 'relative',
    zIndex: 1,
    height: '46px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #5865f2, #7b5cff)',
    color: 'white',
    fontWeight: '800',
    boxShadow: '0 10px 25px rgba(88,101,242,0.35)',
  },

  main: {
    height: '100vh',
    overflowY: 'auto',
    paddingBottom: '32px',
  },

  header: {
    height: '72px',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #3f4147',
    backgroundColor: 'rgba(43,45,49,0.85)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },

  pageTitle: {
    fontSize: '26px',
    fontWeight: '900',
  },

  pageSubtitle: {
    color: '#b5bac1',
    marginTop: '4px',
    fontSize: '14px',
  },

  refreshButton: {
    height: '44px',
    padding: '0 18px',
    borderRadius: '14px',
    backgroundColor: '#232428',
    color: '#f2f3f5',
    fontWeight: '800',
  },

  hero: {
    margin: '32px',
    padding: '34px',
    minHeight: '220px',
    borderRadius: '30px',
    background:
      'radial-gradient(circle at top right, rgba(123,92,255,0.28), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px',
  },

  heroEyebrow: {
    color: '#9b9dff',
    fontWeight: '900',
    fontSize: '13px',
    marginBottom: '12px',
    letterSpacing: '1px',
  },

  heroTitle: {
    maxWidth: '780px',
    fontSize: '44px',
    lineHeight: 1.05,
    letterSpacing: '-1.8px',
    marginBottom: '14px',
  },

  heroText: {
    maxWidth: '620px',
    color: '#d7d9dc',
    lineHeight: 1.6,
    fontSize: '16px',
  },

  heroBadge: {
    minWidth: '150px',
    height: '150px',
    borderRadius: '34px',
    backgroundColor: '#232428',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 14px 35px rgba(0,0,0,0.28)',
  },

  heroBadgeNumber: {
    fontSize: '48px',
    fontWeight: '900',
  },

  heroBadgeLabel: {
    color: '#b5bac1',
    fontWeight: '700',
  },

  roomsSection: {
    padding: '0 32px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
  },

  sectionTitle: {
    fontSize: '22px',
    fontWeight: '900',
  },

  sectionCount: {
    minWidth: '30px',
    height: '30px',
    padding: '0 10px',
    borderRadius: '999px',
    backgroundColor: '#232428',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b5bac1',
    fontWeight: '800',
  },

  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '18px',
  },

roomCard: {
  position: 'relative',
  overflow: 'hidden',
  minHeight: '230px',
  borderRadius: '24px',
  padding: '22px',

  background:
    'linear-gradient(180deg, rgba(43,45,49,1), rgba(35,36,40,1))',

  border: '1px solid rgba(255,255,255,0.07)',

  boxShadow:
    '0 14px 35px rgba(0,0,0,0.18)',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  transition:
    'transform 0.22s ease, box-shadow 0.22s ease, border 0.22s ease',
},

  cardGlow: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(88,101,242,0.25), transparent)',
    filter: 'blur(12px)',
  },

  roomTop: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  roomIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    backgroundColor: '#232428',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '26px',
    fontWeight: '900',
  },

  roomTag: {
    color: '#b5bac1',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  roomName: {
    position: 'relative',
    zIndex: 1,
    fontSize: '30px',
    lineHeight: 1.1,
    marginTop: '20px',
  },

  roomDescription: {
    position: 'relative',
    zIndex: 1,
    color: '#d7d9dc',
    lineHeight: 1.5,
    marginTop: '10px',
    flex: 1,
  },

  roomFooter: {
    position: 'relative',
    zIndex: 1,
    marginTop: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },

  roomMeta: {
    color: '#b5bac1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '700',
  },

  liveDot: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#23a559',
    boxShadow: '0 0 10px rgba(35,165,89,0.8)',
  },

  joinButton: {
    height: '44px',
    padding: '0 18px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #23a559, #2dc770)',
    color: 'white',
    fontWeight: '900',
    boxShadow: '0 10px 24px rgba(35,165,89,0.25)',
  },

  centerState: {
    minHeight: '280px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b5bac1',
  },

  emptyState: {
    minHeight: '360px',
    borderRadius: '26px',
    backgroundColor: '#2b2d31',
    border: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b5bac1',
    textAlign: 'center',
    padding: '32px',
  },

  emptyIcon: {
    width: '88px',
    height: '88px',
    borderRadius: '28px',
    backgroundColor: '#232428',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    marginBottom: '20px',
  },
}

export default RoomsPage