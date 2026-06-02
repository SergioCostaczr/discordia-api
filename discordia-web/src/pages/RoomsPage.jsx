import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getRooms,
  joinRoom,
  createRoom,
  deleteRoom,
} from '../services/roomService'

function RoomsPage() {
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [deletingRoomId, setDeletingRoomId] = useState(null)

  const username = localStorage.getItem('username') || 'Você'

  useEffect(() => {
    loadRooms()
  }, [])

  async function loadRooms() {
    try {
      setLoading(true)
      const data = await getRooms()
      setRooms(data)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar salas.')
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
      setCreatingRoom(true)

      await createRoom(newRoomName, newRoomDescription)

      setNewRoomName('')
      setNewRoomDescription('')
      setShowCreateModal(false)

      loadRooms()
    } catch (error) {
      console.error(error)
      alert('Erro ao criar sala.')
    } finally {
      setCreatingRoom(false)
    }
  }

  async function handleDeleteRoom(event, room) {
  event.stopPropagation()

  const confirmed = window.confirm(
    `Tem certeza que deseja excluir a sala "${room.name}"? Essa ação não pode ser desfeita.`
  )

  if (!confirmed) return

  try {
    setDeletingRoomId(room.id)

    await deleteRoom(room.id)

    await loadRooms()
  } catch (error) {
    console.error(error)

    if (error.response?.status === 403) {
      alert('Você não tem permissão para excluir salas.')
      return
    }

    alert('Erro ao excluir sala.')
  } finally {
    setDeletingRoomId(null)
  }
}

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div style={styles.app}>
        <style>
          {`
            @keyframes fadeUp {
              from {
                opacity: 0;
                transform: translateY(18px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes floatGlow {
              0% {
                transform: translateY(0px);
                opacity: 0.75;
              }

              50% {
                transform: translateY(-14px);
                opacity: 1;
              }

              100% {
                transform: translateY(0px);
                opacity: 0.75;
              }
            }

            @keyframes pulseOnline {
              0% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55);
              }

              70% {
                box-shadow: 0 0 0 9px rgba(34, 197, 94, 0);
              }

              100% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
              }
            }

            .rooms-main-scroll::-webkit-scrollbar {
              width: 10px;
            }

            .rooms-main-scroll::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.45);
            }

            .rooms-main-scroll::-webkit-scrollbar-thumb {
              background: rgba(129, 140, 248, 0.35);
              border-radius: 999px;
            }

            .rooms-main-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(129, 140, 248, 0.58);
            }

            .rooms-card:hover {
              transform: translateY(-7px);
              border-color: rgba(129, 140, 248, 0.42) !important;
              box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35), 0 0 36px rgba(88, 101, 242, 0.14) !important;
            }

            .rooms-card:hover .room-card-glow {
              opacity: 1;
              transform: scale(1.18);
            }
              .rooms-delete-button:hover {
            transform: translateY(-2px);
            background: rgba(127, 29, 29, 0.28) !important;
            border-color: rgba(248, 113, 113, 0.42) !important;
            }

            .rooms-action-button:hover,
            .rooms-refresh-button:hover,
            .rooms-logout-button:hover,
            .rooms-modal-close:hover {
              transform: translateY(-2px);
              filter: brightness(1.08);
            }

            .rooms-join-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 16px 34px rgba(34, 197, 94, 0.35);
              filter: brightness(1.08);
            }

            .rooms-modal-input::placeholder,
            .rooms-modal-textarea::placeholder {
              color: rgba(203, 213, 225, 0.42);
            }

            .rooms-modal-input:focus,
            .rooms-modal-textarea:focus {
              border-color: rgba(129, 140, 248, 0.82) !important;
              box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14), 0 0 28px rgba(129, 140, 248, 0.14);
              background: rgba(15, 23, 42, 0.94) !important;
            }
          `}
        </style>

        <div style={styles.backgroundOrbOne} />
        <div style={styles.backgroundOrbTwo} />
        <div style={styles.backgroundOrbThree} />

        <aside style={styles.serverBar}>
          <button style={styles.serverLogo} title="Discordia">
            D
          </button>

          <div style={styles.serverDivider} />

          <button style={styles.serverButton} title="Salas">
            #
          </button>

          <button style={styles.serverGhostButton} title="Jogos em breve">
            ▶
          </button>
        </aside>

        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div>
              <h1 style={styles.logo}>Discordia</h1>
              <p style={styles.logoSubtitle}>painel de salas</p>
            </div>

            <button
              className="rooms-logout-button"
              style={styles.topLogoutButton}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>

          <div style={styles.profileCard}>
            <div style={styles.profileAvatar}>
              {username.charAt(0).toUpperCase()}
            </div>

            <div style={styles.profileInfo}>
              <strong style={styles.profileName}>{username}</strong>

              <div style={styles.onlineRow}>
                <span style={styles.onlineDot} />
                <p style={styles.onlineText}>online agora</p>
              </div>
            </div>
          </div>

          <div style={styles.sidebarButtons}>
            <button
              className="rooms-action-button"
              style={styles.primarySidebarButton}
              onClick={() => setShowCreateModal(true)}
            >
              <span style={styles.buttonIcon}>+</span>
              Nova sala
            </button>
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span>Canais</span>
              <span style={styles.sidebarCounter}>{rooms.length}</span>
            </div>

            <div style={styles.sidebarRoomList}>
              {rooms.slice(0, 6).map((room) => (
                <button
                  key={room.id}
                  style={styles.sidebarRoomItem}
                  onClick={() => handleJoinRoom(room)}
                >
                  <span style={styles.sidebarHash}>#</span>
                  <span style={styles.sidebarRoomName}>{room.name}</span>
                </button>
              ))}

              {!loading && rooms.length === 0 && (
                <p style={styles.sidebarEmptyText}>
                  Nenhuma sala criada ainda.
                </p>
              )}
            </div>
          </div>

          <div style={styles.sidebarFooter}>
            <p style={styles.sidebarFooterTitle}>Próximo recurso</p>
            <p style={styles.sidebarFooterText}>
              Jogos realtime dentro das salas.
            </p>
          </div>
        </aside>

        <main className="rooms-main-scroll" style={styles.main}>
          <header style={styles.header}>
            <div>
              <h2 style={styles.pageTitle}>Escolha uma sala</h2>

              <p style={styles.pageSubtitle}>
                Entre em um canal e comece a conversar.
              </p>
            </div>

            <button
              className="rooms-refresh-button"
              style={styles.refreshButton}
              onClick={loadRooms}
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </header>

          <section style={styles.hero}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>
                Encontre sua sala e entre na conversa.
              </h1>

              <p style={styles.heroText}>
                Crie canais, participe de conversas ao vivo e reúna sua comunidade em um só lugar.
              </p>

              <div style={styles.heroActions}>
                <button
                  className="rooms-action-button"
                  style={styles.heroPrimaryButton}
                  onClick={() => setShowCreateModal(true)}
                >
                  Criar sala
                </button>

                <button
                  className="rooms-refresh-button"
                  style={styles.heroSecondaryButton}
                  onClick={loadRooms}
                >
                  Atualizar
                </button>
              </div>
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
                <div style={styles.loadingIcon}>#</div>
                <p>Carregando salas...</p>
              </div>
            )}

            {!loading && rooms.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>#</div>
                <h2 style={styles.emptyTitle}>Nenhuma sala disponível</h2>

                <p style={styles.emptyText}>
                  Crie a primeira sala para começar a testar o Discordia em tempo real.
                </p>

                <button
                  className="rooms-action-button"
                  style={styles.emptyButton}
                  onClick={() => setShowCreateModal(true)}
                >
                  Criar primeira sala
                </button>
              </div>
            )}

            {!loading && rooms.length > 0 && (
              <div style={styles.roomsGrid}>
                {rooms.map((room, index) => (
<article
  className="rooms-card"
  key={room.id}
  style={styles.roomCard}
>
  <div
    className="room-card-glow"
    style={styles.cardGlow}
  />

  <div style={styles.roomTop}>
    <div style={styles.roomIcon}>#</div>

    <span style={styles.roomTag}>
      canal {String(index + 1).padStart(2, '0')}
    </span>
  </div>

  <div style={styles.roomBody}>
    <h3 style={styles.roomName}>{room.name}</h3>

    <p style={styles.roomDescription}>
      {room.description || 'Sala sem descrição.'}
    </p>
  </div>

  <div style={styles.roomFooter}>
    <div style={styles.roomMeta}>
      <span style={styles.liveDot} />
      <span>tempo real</span>
    </div>

    <div style={styles.roomActions}>
      <button
        className="rooms-delete-button"
        style={{
          ...styles.deleteButton,
          opacity: deletingRoomId === room.id ? 0.65 : 1,
          cursor: deletingRoomId === room.id ? 'not-allowed' : 'pointer',
        }}
        onClick={(event) => handleDeleteRoom(event, room)}
        disabled={deletingRoomId === room.id}
        title="Excluir sala"
      >
        {deletingRoomId === room.id ? '...' : 'Excluir'}
      </button>

      <button
        className="rooms-join-button"
        style={styles.joinButton}
        onClick={() => handleJoinRoom(room)}
      >
        Entrar
      </button>
    </div>
  </div>
</article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalGlow} />

            <div style={styles.modalHeader}>
              <div>
                <p style={styles.modalEyebrow}>Novo canal</p>

                <h2 style={styles.modalTitle}>Criar nova sala</h2>

                <p style={styles.modalSubtitle}>
                  Configure um espaço para conversa em tempo real.
                </p>
              </div>

              <button
                className="rooms-modal-close"
                style={styles.closeButton}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form style={styles.modalForm} onSubmit={handleCreateRoom}>
              <label style={styles.modalLabel}>
                Nome da sala
                <input
                  className="rooms-modal-input"
                  type="text"
                  placeholder="Ex: geral, estudos, jogos..."
                  value={newRoomName}
                  onChange={(event) => setNewRoomName(event.target.value)}
                  style={styles.modalInput}
                />
              </label>

              <label style={styles.modalLabel}>
                Descrição
                <textarea
                  className="rooms-modal-textarea"
                  placeholder="Descreva rapidamente o objetivo dessa sala"
                  value={newRoomDescription}
                  onChange={(event) =>
                    setNewRoomDescription(event.target.value)
                  }
                  style={styles.textarea}
                />
              </label>

              <button
                type="submit"
                style={{
                  ...styles.modalButton,
                  opacity: creatingRoom ? 0.75 : 1,
                  cursor: creatingRoom ? 'not-allowed' : 'pointer',
                }}
                disabled={creatingRoom}
              >
                {creatingRoom ? 'Criando sala...' : 'Criar sala'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  app: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '76px 330px 1fr',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background:
      'radial-gradient(circle at top left, rgba(88, 101, 242, 0.2), transparent 28%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.16), transparent 34%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)',
    color: '#f8fafc',
  },

  backgroundOrbOne: {
    position: 'absolute',
    width: '360px',
    height: '360px',
    borderRadius: '999px',
    background: 'rgba(88, 101, 242, 0.2)',
    filter: 'blur(90px)',
    top: '-120px',
    left: '180px',
    animation: 'floatGlow 8s ease-in-out infinite',
    pointerEvents: 'none',
  },

  backgroundOrbTwo: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '999px',
    background: 'rgba(168, 85, 247, 0.14)',
    filter: 'blur(96px)',
    bottom: '-160px',
    right: '-80px',
    animation: 'floatGlow 10s ease-in-out infinite',
    pointerEvents: 'none',
  },

  backgroundOrbThree: {
    position: 'absolute',
    width: '260px',
    height: '260px',
    borderRadius: '999px',
    background: 'rgba(34, 211, 238, 0.1)',
    filter: 'blur(80px)',
    top: '42%',
    left: '54%',
    animation: 'floatGlow 9s ease-in-out infinite',
    pointerEvents: 'none',
  },

  serverBar: {
    position: 'relative',
    zIndex: 3,
    background: 'rgba(2, 6, 23, 0.78)',
    borderRight: '1px solid rgba(148, 163, 184, 0.12)',
    backdropFilter: 'blur(22px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '18px',
    gap: '14px',
  },

  serverLogo: {
    width: '52px',
    height: '52px',
    border: 'none',
    borderRadius: '19px',
    background: 'linear-gradient(135deg, #5865f2, #9333ea)',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
    fontSize: '23px',
    boxShadow: '0 16px 38px rgba(88, 101, 242, 0.42)',
    cursor: 'pointer',
  },

  serverDivider: {
    width: '34px',
    height: '2px',
    borderRadius: '999px',
    background: 'rgba(148, 163, 184, 0.22)',
  },

  serverButton: {
    width: '48px',
    height: '48px',
    border: '1px solid rgba(129, 140, 248, 0.22)',
    borderRadius: '17px',
    background: 'rgba(30, 41, 59, 0.7)',
    color: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '22px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '0 0 26px rgba(88, 101, 242, 0.12)',
  },

  serverGhostButton: {
    width: '48px',
    height: '48px',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    borderRadius: '50%',
    background: 'rgba(15, 23, 42, 0.72)',
    color: 'rgba(226, 232, 240, 0.72)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '900',
    cursor: 'not-allowed',
  },

  sidebar: {
    position: 'relative',
    zIndex: 3,
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.72))',
    borderRight: '1px solid rgba(148, 163, 184, 0.12)',
    backdropFilter: 'blur(24px)',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '20px',
  },

  sidebarHeader: {
    minHeight: '86px',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
  },

  logo: {
    margin: 0,
    fontSize: '29px',
    fontWeight: '950',
    letterSpacing: '-1px',
  },

  logoSubtitle: {
    margin: '3px 0 0',
    color: 'rgba(203, 213, 225, 0.48)',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },

  topLogoutButton: {
    height: '38px',
    padding: '0 14px',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: '13px',
    background: 'rgba(2, 6, 23, 0.55)',
    color: '#f8fafc',
    fontWeight: '800',
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  profileCard: {
    margin: '18px',
    padding: '16px',
    borderRadius: '22px',
    background:
      'linear-gradient(135deg, rgba(88, 101, 242, 0.14), rgba(15, 23, 42, 0.52))',
    border: '1px solid rgba(129, 140, 248, 0.18)',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 18px 46px rgba(0, 0, 0, 0.18)',
  },

  profileAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '17px',
    background: 'linear-gradient(135deg, #5865f2, #22c55e)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
    boxShadow: '0 14px 32px rgba(88, 101, 242, 0.26)',
  },

  profileInfo: {
    minWidth: 0,
  },

  profileName: {
    display: 'block',
    maxWidth: '190px',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  onlineRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '5px',
  },

  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    background: '#22c55e',
    animation: 'pulseOnline 1.8s infinite',
  },

  onlineText: {
    margin: 0,
    color: '#86efac',
    fontSize: '13px',
    fontWeight: 700,
  },

  sidebarButtons: {
    padding: '0 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  primarySidebarButton: {
    height: '52px',
    border: 'none',
    borderRadius: '17px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    color: 'white',
    fontWeight: '900',
    fontSize: '15px',
    cursor: 'pointer',
    transition: '0.22s ease',
    boxShadow: '0 16px 34px rgba(88, 101, 242, 0.32)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  buttonIcon: {
    fontSize: '20px',
    lineHeight: 1,
  },

  sidebarSection: {
    padding: '22px 18px 0',
  },

  sidebarSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'rgba(203, 213, 225, 0.5)',
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '12px',
  },

  sidebarCounter: {
    minWidth: '24px',
    height: '24px',
    padding: '0 8px',
    borderRadius: '999px',
    background: 'rgba(2, 6, 23, 0.5)',
    display: 'grid',
    placeItems: 'center',
    color: 'rgba(226, 232, 240, 0.7)',
  },

  sidebarRoomList: {
    display: 'grid',
    gap: '7px',
  },

  sidebarRoomItem: {
    height: '38px',
    border: 'none',
    borderRadius: '12px',
    background: 'transparent',
    color: 'rgba(226, 232, 240, 0.68)',
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '0 10px',
    cursor: 'pointer',
    fontWeight: 700,
    textAlign: 'left',
  },

  sidebarHash: {
    color: 'rgba(129, 140, 248, 0.82)',
    fontSize: '18px',
    fontWeight: 900,
  },

  sidebarRoomName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  sidebarEmptyText: {
    margin: 0,
    color: 'rgba(203, 213, 225, 0.44)',
    fontSize: '13px',
    lineHeight: 1.5,
  },

  sidebarFooter: {
    margin: 'auto 18px 0',
    padding: '16px',
    borderRadius: '20px',
    background: 'rgba(2, 6, 23, 0.44)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },

  sidebarFooterTitle: {
    margin: 0,
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 900,
  },

  sidebarFooterText: {
    margin: '6px 0 0',
    color: 'rgba(203, 213, 225, 0.55)',
    fontSize: '12px',
    lineHeight: 1.5,
  },

  main: {
    position: 'relative',
    zIndex: 2,
    height: '100vh',
    overflowY: 'auto',
    paddingBottom: '36px',
  },

  header: {
    minHeight: '86px',
    padding: '0 34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
    background: 'rgba(15, 23, 42, 0.66)',
    backdropFilter: 'blur(18px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },

  pageTitle: {
    margin: 0,
    fontSize: '27px',
    fontWeight: '950',
    letterSpacing: '-0.8px',
  },

  pageSubtitle: {
    color: 'rgba(203, 213, 225, 0.62)',
    margin: '5px 0 0',
    fontSize: '14px',
  },

  refreshButton: {
    height: '44px',
    padding: '0 18px',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: '15px',
    background: 'rgba(2, 6, 23, 0.48)',
    color: '#f8fafc',
    fontWeight: '900',
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  hero: {
    margin: '34px',
    padding: '38px',
    minHeight: '230px',
    borderRadius: '34px',
    background:
      'radial-gradient(circle at top right, rgba(129, 140, 248, 0.24), transparent 34%), radial-gradient(circle at bottom left, rgba(34, 211, 238, 0.08), transparent 30%), linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.46))',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    boxShadow:
      '0 28px 80px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '42px',
    animation: 'fadeUp 0.7s ease forwards',
  },

  heroContent: {
    maxWidth: '760px',
  },

  heroTitle: {
    maxWidth: '760px',
    fontSize: 'clamp(38px, 4vw, 58px)',
    lineHeight: 1.02,
    letterSpacing: '-2px',
    margin: 0,
    fontWeight: 950,
  },

  heroText: {
    maxWidth: '560px',
    color: 'rgba(226, 232, 240, 0.68)',
    lineHeight: 1.6,
    fontSize: '16px',
    margin: '16px 0 0',
  },

  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '26px',
    flexWrap: 'wrap',
  },

  heroPrimaryButton: {
    height: '48px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    color: '#ffffff',
    fontWeight: 900,
    cursor: 'pointer',
    transition: '0.22s ease',
    boxShadow: '0 14px 34px rgba(88, 101, 242, 0.3)',
  },

  heroSecondaryButton: {
    height: '48px',
    padding: '0 20px',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    borderRadius: '16px',
    background: 'rgba(2, 6, 23, 0.46)',
    color: '#f8fafc',
    fontWeight: 900,
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  heroBadge: {
    minWidth: '160px',
    height: '150px',
    borderRadius: '32px',
    background:
      'linear-gradient(180deg, rgba(2, 6, 23, 0.7), rgba(15, 23, 42, 0.7))',
    border: '1px solid rgba(148, 163, 184, 0.13)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 18px 46px rgba(0, 0, 0, 0.3)',
  },

  heroBadgeNumber: {
    fontSize: '54px',
    fontWeight: '950',
    lineHeight: 1,
    background: 'linear-gradient(135deg, #ffffff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  heroBadgeLabel: {
    marginTop: '8px',
    color: 'rgba(203, 213, 225, 0.62)',
    fontWeight: '800',
  },

  roomsSection: {
    padding: '0 34px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    marginBottom: '20px',
  },

  sectionTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '950',
    letterSpacing: '-0.6px',
  },

  sectionCount: {
    minWidth: '36px',
    height: '36px',
    padding: '0 12px',
    borderRadius: '999px',
    background: 'rgba(2, 6, 23, 0.48)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#c7d2fe',
    fontWeight: '900',
  },

  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
    gap: '20px',
    animation: 'fadeUp 0.7s ease forwards',
  },

  roomCard: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '246px',
    borderRadius: '28px',
    padding: '23px',
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.62))',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.23)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition:
      'transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease',
    cursor: 'default',
  },

  cardGlow: {
    position: 'absolute',
    top: '-60px',
    right: '-60px',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(88, 101, 242, 0.32), transparent 68%)',
    filter: 'blur(12px)',
    opacity: 0.62,
    transition: '0.28s ease',
  },

  roomTop: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  roomIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '18px',
    background: 'rgba(2, 6, 23, 0.52)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '27px',
    fontWeight: '950',
    color: '#a5b4fc',
  },

  roomTag: {
    color: 'rgba(203, 213, 225, 0.48)',
    fontSize: '12px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },

  roomBody: {
    position: 'relative',
    zIndex: 1,
    marginTop: '22px',
    flex: 1,
  },

  roomName: {
    fontSize: '30px',
    lineHeight: 1.08,
    margin: 0,
    letterSpacing: '-1px',
  },

  roomDescription: {
    color: 'rgba(226, 232, 240, 0.66)',
    lineHeight: 1.55,
    margin: '12px 0 0',
    fontSize: '14px',
  },

  roomFooter: {
    position: 'relative',
    zIndex: 1,
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },

  roomMeta: {
    color: 'rgba(203, 213, 225, 0.56)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '800',
  },

  liveDot: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 12px rgba(34, 197, 94, 0.8)',
  },

  joinButton: {
    height: '44px',
    padding: '0 19px',
    border: 'none',
    borderRadius: '15px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    fontWeight: '950',
    cursor: 'pointer',
    transition: '0.22s ease',
    boxShadow: '0 12px 26px rgba(34, 197, 94, 0.24)',
  },

  roomActions: {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
},

deleteButton: {
  height: '44px',
  padding: '0 15px',
  border: '1px solid rgba(248, 113, 113, 0.24)',
  borderRadius: '15px',
  background: 'rgba(127, 29, 29, 0.18)',
  color: '#fecaca',
  fontWeight: '900',
  cursor: 'pointer',
  transition: '0.22s ease',
},

  centerState: {
    minHeight: '300px',
    borderRadius: '28px',
    background: 'rgba(15, 23, 42, 0.52)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(203, 213, 225, 0.65)',
    gap: '12px',
  },

  loadingIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    display: 'grid',
    placeItems: 'center',
    fontSize: '30px',
    fontWeight: 950,
    boxShadow: '0 18px 40px rgba(88, 101, 242, 0.26)',
  },

  emptyState: {
    minHeight: '380px',
    borderRadius: '30px',
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(203, 213, 225, 0.64)',
    textAlign: 'center',
    padding: '34px',
    boxShadow: '0 22px 60px rgba(0, 0, 0, 0.24)',
  },

  emptyIcon: {
    width: '88px',
    height: '88px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #5865f2, #9333ea)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '42px',
    fontWeight: 950,
    marginBottom: '22px',
    boxShadow: '0 20px 46px rgba(88, 101, 242, 0.3)',
  },

  emptyTitle: {
    margin: 0,
    color: '#ffffff',
    fontSize: '28px',
  },

  emptyText: {
    maxWidth: '420px',
    lineHeight: 1.6,
  },

  emptyButton: {
    marginTop: '12px',
    height: '48px',
    padding: '0 22px',
    border: 'none',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2, 6, 23, 0.78)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: '24px',
  },

  modal: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '570px',
    borderRadius: '32px',
    padding: '31px',
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.78))',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    boxShadow:
      '0 34px 90px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    animation: 'fadeUp 0.35s ease forwards',
  },

  modalGlow: {
    position: 'absolute',
    top: '-70px',
    right: '-70px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(129, 140, 248, 0.42), transparent 68%)',
    filter: 'blur(18px)',
  },

  modalHeader: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '24px',
  },

  modalEyebrow: {
    margin: '0 0 9px',
    color: '#a5b4fc',
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.9px',
  },

  modalTitle: {
    margin: 0,
    fontSize: '36px',
    lineHeight: 1,
    letterSpacing: '-1.3px',
  },

  modalSubtitle: {
    margin: '10px 0 0',
    color: 'rgba(203, 213, 225, 0.62)',
    lineHeight: 1.5,
  },

  closeButton: {
    minWidth: '44px',
    height: '44px',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: '15px',
    background: 'rgba(2, 6, 23, 0.55)',
    color: '#f8fafc',
    fontSize: '25px',
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  modalForm: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '17px',
  },

  modalLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    color: 'rgba(226, 232, 240, 0.82)',
    fontSize: '13px',
    fontWeight: 800,
  },

  modalInput: {
    height: '55px',
    borderRadius: '17px',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    background: 'rgba(2, 6, 23, 0.58)',
    color: '#f8fafc',
    padding: '0 18px',
    fontSize: '15px',
    outline: 'none',
    transition: '0.22s ease',
  },

  textarea: {
    minHeight: '124px',
    resize: 'none',
    borderRadius: '18px',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    background: 'rgba(2, 6, 23, 0.58)',
    color: '#f8fafc',
    padding: '16px 18px',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: '0.22s ease',
  },

  modalButton: {
    height: '57px',
    border: 'none',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    color: 'white',
    fontWeight: '950',
    fontSize: '15px',
    boxShadow: '0 16px 34px rgba(88, 101, 242, 0.34)',
  },
}

export default RoomsPage