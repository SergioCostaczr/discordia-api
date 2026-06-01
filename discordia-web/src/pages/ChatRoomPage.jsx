import { useEffect, useRef, useState } from 'react'
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

  const messagesWrapperRef = useRef(null)
  const messagesEndRef = useRef(null)
  const shouldAutoScrollRef = useRef(true)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  const username = localStorage.getItem('username') || 'Você'
  const roomName = localStorage.getItem('selectedRoomName') || 'geral'
  const roomDescription = localStorage.getItem('selectedRoomDescription') || ''

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true)

        const data = await getRoomMessages(roomId)

        setMessages([...data.content].reverse())

        setTimeout(() => {
          scrollToBottom('auto')
        }, 100)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    const client = connectWebSocket()

    client.onConnect = () => {
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

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom('smooth')
    }
  }, [messages])

  function scrollToBottom(behavior = 'smooth') {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: 'end',
    })
  }

  function handleMessagesScroll() {
    const container = messagesWrapperRef.current

    if (!container) return

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    shouldAutoScrollRef.current = distanceFromBottom < 120
  }

  function handleSendMessage(event) {
    event.preventDefault()

    if (!newMessage.trim()) return

    shouldAutoScrollRef.current = true

    sendMessage(roomId, newMessage)
    setNewMessage('')
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  function formatTime(dateString) {
    if (!dateString) return ''

    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getInitials(name) {
    if (!name) return '?'

    return name.charAt(0).toUpperCase()
  }

  return (
    <div style={styles.app}>
      <style>
        {`
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

          @keyframes messageAppear {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
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

          .chat-scroll::-webkit-scrollbar {
            width: 10px;
          }

          .chat-scroll::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.35);
          }

          .chat-scroll::-webkit-scrollbar-thumb {
            background: rgba(129, 140, 248, 0.34);
            border-radius: 999px;
          }

          .chat-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(129, 140, 248, 0.56);
          }

          .chat-button:hover,
          .chat-back-button:hover,
          .chat-logout-button:hover,
          .chat-server-button:hover {
            transform: translateY(-2px);
            filter: brightness(1.08);
          }

          .chat-send-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 34px rgba(88, 101, 242, 0.4);
            filter: brightness(1.08);
          }

          .chat-input::placeholder {
            color: rgba(203, 213, 225, 0.45);
          }

          .chat-input:focus {
            border-color: rgba(129, 140, 248, 0.82) !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14), 0 0 28px rgba(129, 140, 248, 0.14) !important;
            background: rgba(15, 23, 42, 0.94) !important;
          }

          .chat-message:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28) !important;
          }

          .chat-channel-item:hover {
            background: rgba(129, 140, 248, 0.12) !important;
            color: #ffffff !important;
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

        <button
          className="chat-server-button"
          style={styles.serverButton}
          onClick={() => navigate('/rooms')}
          title="Voltar para salas"
        >
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
            <p style={styles.logoSubtitle}>sala ativa</p>
          </div>

          <button
            className="chat-logout-button"
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>

        <div style={styles.roomCard}>
          <div style={styles.roomIcon}>#</div>

          <div style={styles.roomInfo}>
            <strong style={styles.roomName}>{roomName}</strong>

            <div style={styles.onlineRow}>
              <span style={styles.onlineDot} />
              <p style={styles.onlineText}>ao vivo</p>
            </div>
          </div>
        </div>

        <div style={styles.channelsContainer}>
          <p style={styles.channelsLabel}>Canais</p>

          <button className="chat-channel-item" style={styles.activeChannel}>
            <span style={styles.channelHash}>#</span>
            <span style={styles.channelName}>{roomName}</span>
          </button>
        </div>

        <div style={styles.sidebarGameCard}>
          <div style={styles.sidebarGameGlow} />

          <p style={styles.sidebarGameTitle}>Em breve</p>
          <p style={styles.sidebarGameText}>
            Jogos dentro das salas.
          </p>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileAvatar}>
            {getInitials(username)}
          </div>

          <div style={styles.profileInfo}>
            <strong style={styles.profileName}>{username}</strong>

            <div style={styles.onlineRow}>
              <span style={styles.onlineDot} />
              <p style={styles.onlineText}>online</p>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.chatContainer}>
        <header style={styles.chatHeader}>
          <div style={styles.chatHeaderLeft}>
            <div style={styles.headerRoomIcon}>#</div>

            <div>
              <h2 style={styles.chatTitle}>{roomName}</h2>

              {roomDescription && (
                <p style={styles.chatSubtitle}>{roomDescription}</p>
              )}
            </div>
          </div>

          <button
            className="chat-back-button"
            style={styles.backButton}
            onClick={() => navigate('/rooms')}
          >
            Voltar
          </button>
        </header>

        <div
          ref={messagesWrapperRef}
          className="chat-scroll"
          style={styles.messagesWrapper}
          onScroll={handleMessagesScroll}
        >
          {loading && (
            <div style={styles.centerState}>
              <div style={styles.loadingIcon}>#</div>
              <p>Carregando mensagens...</p>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>#</div>

              <h2 style={styles.emptyTitle}>
                Bem-vindo ao #{roomName}
              </h2>

              <p style={styles.emptyText}>
                Esse é o começo da conversa.
              </p>
            </div>
          )}

          {!loading &&
            messages.map((message, index) => {
              const isMine = message.senderUsername === username

              return (
                <div
                  key={message.id || index}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                  }}
                >
                  {!isMine && (
                    <div style={styles.avatar}>
                      {getInitials(message.senderUsername)}
                    </div>
                  )}

                  <div
                    className="chat-message"
                    style={{
                      ...styles.messageBubble,
                      ...(isMine ? styles.myMessage : styles.otherMessage),
                    }}
                  >
                    <div style={styles.messageMeta}>
                      <strong style={styles.messageAuthor}>
                        {message.senderUsername}
                      </strong>

                      <span style={styles.messageTime}>
                        {formatTime(message.sentAt)}
                      </span>
                    </div>

                    <p style={styles.messageContent}>
                      {message.content}
                    </p>
                  </div>
                </div>
              )
            })}

          <div ref={messagesEndRef} />
        </div>

        <form
          style={styles.inputContainer}
          onSubmit={handleSendMessage}
        >
          <button
            className="chat-button"
            type="button"
            style={styles.plusButton}
            title="Anexos em breve"
          >
            +
          </button>

          <input
            className="chat-input"
            type="text"
            placeholder={`Conversar em #${roomName}`}
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            style={styles.input}
          />

          <button
            className="chat-send-button"
            type="submit"
            style={{
              ...styles.sendButton,
              opacity: newMessage.trim() ? 1 : 0.6,
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Enviar
          </button>
        </form>
      </main>

      <aside style={styles.rightPanel}>
        <div style={styles.rightHeader}>
          <h3 style={styles.rightTitle}>Online</h3>
          <span style={styles.memberCount}>1</span>
        </div>

        <div style={styles.memberCard}>
          <div style={styles.memberAvatar}>
            {getInitials(username)}
          </div>

          <div style={styles.memberInfo}>
            <strong style={styles.memberName}>{username}</strong>

            <div style={styles.onlineRow}>
              <span style={styles.onlineDot} />
              <p style={styles.memberStatus}>Disponível</p>
            </div>
          </div>
        </div>

        <div style={styles.gameCard}>
          <div style={styles.gameGlow} />

          <div style={styles.gameIcon}>✦</div>

          <h2 style={styles.gameTitle}>
            Pedra, Papel e Tesoura
          </h2>

          <p style={styles.gameText}>
            Desafios em tempo real vão aparecer aqui.
          </p>

          <button style={styles.gameButton} disabled>
            Em breve
          </button>
        </div>
      </aside>
    </div>
  )
}

const styles = {
  app: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '76px 292px 1fr 310px',
    width: '100%',
    height: '100vh',
    background:
      'radial-gradient(circle at top left, rgba(88, 101, 242, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.14), transparent 34%), linear-gradient(135deg, #020617 0%, #0f172a 48%, #111827 100%)',
    overflow: 'hidden',
    color: '#f8fafc',
  },

  backgroundOrbOne: {
    position: 'absolute',
    width: '340px',
    height: '340px',
    borderRadius: '999px',
    background: 'rgba(88, 101, 242, 0.18)',
    filter: 'blur(88px)',
    top: '-120px',
    left: '190px',
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
    right: '-90px',
    animation: 'floatGlow 10s ease-in-out infinite',
    pointerEvents: 'none',
  },

  backgroundOrbThree: {
    position: 'absolute',
    width: '260px',
    height: '260px',
    borderRadius: '999px',
    background: 'rgba(34, 211, 238, 0.08)',
    filter: 'blur(80px)',
    top: '44%',
    left: '52%',
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
    transition: '0.22s ease',
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
  },

  sidebarHeader: {
    minHeight: '86px',
    padding: '0 20px',
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

  logoutButton: {
    height: '38px',
    padding: '0 13px',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: '13px',
    background: 'rgba(2, 6, 23, 0.55)',
    color: '#f8fafc',
    fontWeight: '800',
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  roomCard: {
    margin: '18px',
    padding: '16px',
    borderRadius: '22px',
    background:
      'linear-gradient(135deg, rgba(88, 101, 242, 0.16), rgba(15, 23, 42, 0.52))',
    border: '1px solid rgba(129, 140, 248, 0.18)',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 18px 46px rgba(0, 0, 0, 0.18)',
  },

  roomIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '17px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    display: 'grid',
    placeItems: 'center',
    fontSize: '24px',
    fontWeight: 950,
    boxShadow: '0 14px 32px rgba(88, 101, 242, 0.28)',
  },

  roomInfo: {
    minWidth: 0,
  },

  roomName: {
    display: 'block',
    maxWidth: '180px',
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

  channelsContainer: {
    flex: 1,
    padding: '8px 18px 18px',
  },

  channelsLabel: {
    margin: '0 0 12px',
    color: 'rgba(203, 213, 225, 0.5)',
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },

  activeChannel: {
    width: '100%',
    height: '44px',
    border: 'none',
    borderRadius: '14px',
    background: 'rgba(129, 140, 248, 0.14)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 13px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: '0.2s ease',
    textAlign: 'left',
  },

  channelHash: {
    color: '#a5b4fc',
    fontSize: '20px',
    fontWeight: 950,
  },

  channelName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  sidebarGameCard: {
    position: 'relative',
    overflow: 'hidden',
    margin: '0 18px 18px',
    padding: '16px',
    borderRadius: '20px',
    background: 'rgba(2, 6, 23, 0.44)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },

  sidebarGameGlow: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(129, 140, 248, 0.24), transparent 68%)',
    top: '-45px',
    right: '-35px',
    filter: 'blur(10px)',
  },

  sidebarGameTitle: {
    position: 'relative',
    margin: 0,
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 900,
  },

  sidebarGameText: {
    position: 'relative',
    margin: '6px 0 0',
    color: 'rgba(203, 213, 225, 0.55)',
    fontSize: '12px',
    lineHeight: 1.5,
  },

  profileCard: {
    minHeight: '78px',
    padding: '14px 18px',
    background: 'rgba(2, 6, 23, 0.58)',
    borderTop: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
  },

  profileAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #5865f2, #22c55e)',
    display: 'grid',
    placeItems: 'center',
    fontWeight: '900',
    boxShadow: '0 14px 32px rgba(88, 101, 242, 0.24)',
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

  chatContainer: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },

  chatHeader: {
    minHeight: '86px',
    padding: '0 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
    background: 'rgba(15, 23, 42, 0.66)',
    backdropFilter: 'blur(18px)',
  },

  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
  },

  headerRoomIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '16px',
    background: 'rgba(2, 6, 23, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'grid',
    placeItems: 'center',
    color: '#a5b4fc',
    fontSize: '24px',
    fontWeight: 950,
  },

  chatTitle: {
    margin: 0,
    fontSize: '27px',
    fontWeight: '950',
    letterSpacing: '-0.8px',
  },

  chatSubtitle: {
    maxWidth: '640px',
    margin: '5px 0 0',
    color: 'rgba(203, 213, 225, 0.58)',
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  backButton: {
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

  messagesWrapper: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  centerState: {
    margin: 'auto',
    minWidth: '280px',
    minHeight: '210px',
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
    margin: 'auto',
    textAlign: 'center',
    color: 'rgba(203, 213, 225, 0.64)',
    padding: '34px',
  },

  emptyIcon: {
    width: '88px',
    height: '88px',
    margin: '0 auto 24px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #5865f2, #9333ea)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '42px',
    fontWeight: 950,
    boxShadow: '0 20px 46px rgba(88, 101, 242, 0.3)',
  },

  emptyTitle: {
    margin: 0,
    color: '#ffffff',
    fontSize: '30px',
    letterSpacing: '-1px',
  },

  emptyText: {
    marginTop: '10px',
    lineHeight: 1.6,
  },

  messageRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    animation: 'messageAppear 0.22s ease',
  },

  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '15px',
    background:
      'linear-gradient(135deg, rgba(129, 140, 248, 0.8), rgba(34, 211, 238, 0.72))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
    color: '#ffffff',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22)',
  },

  messageBubble: {
    maxWidth: '66%',
    padding: '14px 16px',
    borderRadius: '20px',
    boxShadow: '0 12px 34px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
  },

  myMessage: {
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    borderBottomRightRadius: '7px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },

  otherMessage: {
    background: 'rgba(15, 23, 42, 0.76)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    borderBottomLeftRadius: '7px',
  },

  messageMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    fontSize: '13px',
  },

  messageAuthor: {
    color: '#ffffff',
  },

  messageTime: {
    color: 'rgba(226, 232, 240, 0.55)',
    fontSize: '12px',
    fontWeight: 700,
  },

  messageContent: {
    margin: 0,
    lineHeight: 1.55,
    fontSize: '15px',
    color: 'rgba(248, 250, 252, 0.92)',
    wordBreak: 'break-word',
  },

  inputContainer: {
    padding: '18px 24px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderTop: '1px solid rgba(148, 163, 184, 0.08)',
    background: 'rgba(15, 23, 42, 0.42)',
    backdropFilter: 'blur(16px)',
  },

  plusButton: {
    width: '50px',
    height: '50px',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: '17px',
    background: 'rgba(2, 6, 23, 0.52)',
    color: '#f8fafc',
    fontSize: '28px',
    cursor: 'pointer',
    transition: '0.22s ease',
  },

  input: {
    flex: 1,
    height: '54px',
    background: 'rgba(2, 6, 23, 0.58)',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    borderRadius: '18px',
    padding: '0 20px',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    transition: '0.22s ease',
  },

  sendButton: {
    height: '54px',
    padding: '0 26px',
    border: 'none',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    color: 'white',
    fontWeight: '950',
    letterSpacing: '0.3px',
    boxShadow: '0 12px 28px rgba(88, 101, 242, 0.34)',
    transition: '0.18s ease',
  },

  rightPanel: {
    position: 'relative',
    zIndex: 3,
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.68))',
    borderLeft: '1px solid rgba(148, 163, 184, 0.12)',
    backdropFilter: 'blur(24px)',
    padding: '24px 18px',
  },

  rightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },

  rightTitle: {
    margin: 0,
    color: 'rgba(203, 213, 225, 0.58)',
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },

  memberCount: {
    minWidth: '26px',
    height: '26px',
    borderRadius: '999px',
    background: 'rgba(2, 6, 23, 0.52)',
    color: '#c7d2fe',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    fontSize: '12px',
  },

  memberCard: {
    background:
      'linear-gradient(135deg, rgba(88, 101, 242, 0.14), rgba(15, 23, 42, 0.52))',
    border: '1px solid rgba(129, 140, 248, 0.16)',
    borderRadius: '20px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    marginBottom: '22px',
    boxShadow: '0 18px 46px rgba(0, 0, 0, 0.18)',
  },

  memberAvatar: {
    width: '46px',
    height: '46px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #22c55e, #5865f2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
  },

  memberInfo: {
    minWidth: 0,
  },

  memberName: {
    display: 'block',
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  memberStatus: {
    margin: 0,
    color: '#86efac',
    fontSize: '13px',
    fontWeight: 700,
  },

  gameCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '26px',
    padding: '22px',
    background:
      'radial-gradient(circle at top right, rgba(129, 140, 248, 0.24), transparent 38%), linear-gradient(135deg, rgba(88, 101, 242, 0.18), rgba(15, 23, 42, 0.52))',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    boxShadow: '0 22px 60px rgba(0, 0, 0, 0.24)',
  },

  gameGlow: {
    position: 'absolute',
    top: '-56px',
    right: '-52px',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(123, 92, 255, 0.42), transparent 68%)',
    filter: 'blur(16px)',
  },

  gameIcon: {
    position: 'relative',
    zIndex: 1,
    width: '44px',
    height: '44px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #5865f2, #9333ea)',
    display: 'grid',
    placeItems: 'center',
    color: '#ffffff',
    fontWeight: 950,
    marginBottom: '18px',
    boxShadow: '0 14px 32px rgba(88, 101, 242, 0.26)',
  },

  gameTitle: {
    position: 'relative',
    zIndex: 1,
    margin: 0,
    fontSize: '28px',
    lineHeight: 1.08,
    letterSpacing: '-1px',
  },

  gameText: {
    position: 'relative',
    zIndex: 1,
    color: 'rgba(226, 232, 240, 0.68)',
    lineHeight: 1.6,
    margin: '12px 0 18px',
    fontSize: '14px',
  },

  gameButton: {
    position: 'relative',
    zIndex: 1,
    height: '42px',
    padding: '0 16px',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    borderRadius: '14px',
    background: 'rgba(2, 6, 23, 0.45)',
    color: 'rgba(226, 232, 240, 0.72)',
    fontWeight: 900,
    cursor: 'not-allowed',
  },
}

export default ChatRoomPage