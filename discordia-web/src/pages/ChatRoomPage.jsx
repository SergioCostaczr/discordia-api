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

  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  const username =
    localStorage.getItem('username') || 'Você'

  const roomName =
    localStorage.getItem('selectedRoomName') || 'geral'

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getRoomMessages(roomId)

        setMessages([...data.content].reverse())
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
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  function handleSendMessage(event) {
    event.preventDefault()

    if (!newMessage.trim()) return

    sendMessage(roomId, newMessage)
    setNewMessage('')
  }

  function formatTime(dateString) {
    if (!dateString) return ''

    return new Date(dateString).toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  return (
    <div style={styles.app}>
      <aside style={styles.serverBar}>
        <div style={styles.serverLogo}>
          D
        </div>

        <div style={styles.serverDivider} />

        <button
          style={styles.serverButton}
          onClick={() => navigate('/rooms')}
        >
          #
        </button>
      </aside>

      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.logo}>
            Discordia
          </h1>

          <div style={styles.onlineDot} />
        </div>

        <div style={styles.channelsContainer}>
          <p style={styles.channelsLabel}>
            CANAIS DE TEXTO
          </p>

          <div style={styles.activeChannel}>
            <span>#</span>
            <span>{roomName}</span>
          </div>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileAvatar}>
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{username}</strong>

            <p style={styles.onlineText}>
              online
            </p>
          </div>
        </div>
      </aside>

      <main style={styles.chatContainer}>
        <header style={styles.chatHeader}>
          <div>
            <h2 style={styles.chatTitle}>
              # {roomName}
            </h2>
          </div>

          <button
            style={styles.backButton}
            onClick={() => navigate('/rooms')}
          >
            Voltar
          </button>
        </header>

        <div style={styles.messagesWrapper}>
          {loading && (
            <div style={styles.centerState}>
              <p>Carregando mensagens...</p>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                #
              </div>

              <h2>
                Bem-vindo ao canal #{roomName}
              </h2>

              <p>
                Esse é o começo da conversa.
              </p>
            </div>
          )}

          {!loading &&
            messages.map((message) => {
              const isMine =
                message.senderUsername === username

              return (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isMine
                      ? 'flex-end'
                      : 'flex-start',
                  }}
                >
                  {!isMine && (
                    <div style={styles.avatar}>
                      {message.senderUsername
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(isMine
                        ? styles.myMessage
                        : styles.otherMessage),
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform = 'translateY(-2px)'
                      event.currentTarget.style.boxShadow =
                        '0 18px 36px rgba(0,0,0,0.28)'
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform = 'translateY(0)'
                      event.currentTarget.style.boxShadow =
                        '0 10px 30px rgba(0,0,0,0.18)'
                    }}
                  >
                    <div style={styles.messageMeta}>
                      <strong>
                        {message.senderUsername}
                      </strong>

                      <span>
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
            type="button"
            style={styles.plusButton}
          >
            +
          </button>

          <input
            type="text"
            placeholder={`Conversar em # ${roomName}`}
            value={newMessage}
            onChange={(event) =>
              setNewMessage(event.target.value)
            }
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.sendButton}
          >
            Enviar
          </button>
        </form>
      </main>

      <aside style={styles.rightPanel}>
        <h3 style={styles.rightTitle}>
          ONLINE — 1
        </h3>

        <div style={styles.memberCard}>
          <div style={styles.memberAvatar}>
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{username}</strong>

            <p style={styles.memberStatus}>
              Disponível
            </p>
          </div>
        </div>

        <div style={styles.gameCard}>
          <div style={styles.gameGlow} />

          <h2 style={styles.gameTitle}>
            Pedra, Papel e Tesoura
          </h2>

          <p style={styles.gameText}>
            Em breve você poderá desafiar
            usuários da sala em partidas em
            tempo real.
          </p>
        </div>
      </aside>
    </div>
  )
}

const styles = {
  app: {
    display: 'grid',
    gridTemplateColumns: '72px 280px 1fr 320px',
    width: '100%',
    height: '100vh',
    background:
      'linear-gradient(to bottom, #313338, #2b2d31)',
    overflow: 'hidden',
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

    background:
      'linear-gradient(135deg, #7b5cff, #5865f2)',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    fontWeight: '900',
    fontSize: '22px',

    boxShadow:
      '0 10px 30px rgba(88,101,242,0.45)',
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

    fontSize: '22px',
    fontWeight: 'bold',
  },

  sidebar: {
    backgroundColor: '#2b2d31',
    borderRight: '1px solid #3f4147',

    display: 'flex',
    flexDirection: 'column',
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

    boxShadow:
      '0 0 12px rgba(35,165,89,0.9)',
  },

  channelsContainer: {
    flex: 1,
    padding: '24px 14px',
  },

  channelsLabel: {
    fontSize: '12px',
    fontWeight: '800',

    color: '#b5bac1',

    marginBottom: '14px',
  },

  activeChannel: {
    height: '52px',

    borderRadius: '14px',

    background:
      'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',

    display: 'flex',
    alignItems: 'center',
    gap: '12px',

    padding: '0 16px',

    fontSize: '22px',
    fontWeight: '700',

    boxShadow:
      '0 8px 20px rgba(0,0,0,0.18)',
  },

  profileCard: {
    height: '76px',

    backgroundColor: '#1e1f22',

    display: 'flex',
    alignItems: 'center',
    gap: '14px',

    padding: '14px',
  },

  profileAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',

    background:
      'linear-gradient(135deg, #5865f2, #23a559)',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    fontWeight: '900',
  },

  onlineText: {
    color: '#23a559',
    fontSize: '13px',
  },

  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },

  chatHeader: {
    height: '72px',

    padding: '0 28px',

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottom: '1px solid #3f4147',

    backgroundColor:
      'rgba(43,45,49,0.85)',

    backdropFilter: 'blur(12px)',
  },

  chatTitle: {
    fontSize: '28px',
    fontWeight: '900',
  },

  backButton: {
    backgroundColor: '#232428',
    color: '#f2f3f5',

    padding: '12px 18px',

    borderRadius: '12px',

    fontWeight: '700',
  },

  messagesWrapper: {
    flex: 1,
    overflowY: 'auto',

    padding: '28px',

    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  centerState: {
    margin: 'auto',
    color: '#b5bac1',
  },

  emptyState: {
    margin: 'auto',
    textAlign: 'center',
    color: '#b5bac1',
  },

  emptyIcon: {
    width: '88px',
    height: '88px',

    margin: '0 auto 24px',

    borderRadius: '28px',

    backgroundColor: '#232428',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    fontSize: '40px',

    boxShadow:
      '0 12px 30px rgba(0,0,0,0.3)',
  },

  messageRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },

  avatar: {
    width: '40px',
    height: '40px',

    borderRadius: '50%',

    backgroundColor: '#232428',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    fontWeight: '900',
    color: '#b5bac1',
  },

messageBubble: {
  maxWidth: '65%',

  padding: '14px 16px',

  borderRadius: '18px',

  boxShadow:
    '0 10px 30px rgba(0,0,0,0.18)',

  backdropFilter: 'blur(10px)',

  transition:
    'transform 0.18s ease, box-shadow 0.18s ease',

  animation:
    'messageAppear 0.22s ease',
},

  myMessage: {
    background:
      'linear-gradient(135deg, #5865f2, #6d74ff)',

    borderBottomRightRadius: '6px',
  },

  otherMessage: {
    backgroundColor: '#232428',
    borderBottomLeftRadius: '6px',
  },

  messageMeta: {
    display: 'flex',
    gap: '10px',

    marginBottom: '8px',

    fontSize: '13px',

    opacity: 0.9,
  },

  messageContent: {
    lineHeight: 1.5,
    fontSize: '15px',
  },

  inputContainer: {
    padding: '18px 24px 24px',

    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  plusButton: {
    width: '48px',
    height: '48px',

    borderRadius: '50%',

    backgroundColor: '#232428',
    color: '#f2f3f5',

    fontSize: '28px',
  },

input: {
  flex: 1,

  height: '54px',

  background:
    'linear-gradient(180deg, #232428, #1e1f22)',

  border: '1px solid #3f4147',

  borderRadius: '18px',

  padding: '0 20px',

  color: '#f2f3f5',

  fontSize: '15px',

  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.03)',

  transition:
    'all 0.2s ease',
},

sendButton: {
  height: '54px',

  padding: '0 26px',

  borderRadius: '18px',

  background:
    'linear-gradient(135deg, #5865f2, #7b5cff)',

  color: 'white',

  fontWeight: '900',

  letterSpacing: '0.3px',

  boxShadow:
    '0 12px 28px rgba(88,101,242,0.38)',

  transition:
    'transform 0.18s ease, box-shadow 0.18s ease',
},

  rightPanel: {
    backgroundColor: '#2b2d31',

    borderLeft: '1px solid #3f4147',

    padding: '24px 18px',
  },

  rightTitle: {
    color: '#b5bac1',
    fontSize: '12px',
    marginBottom: '14px',
  },

  memberCard: {
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',

    borderRadius: '18px',

    padding: '18px',

    display: 'flex',
    alignItems: 'center',
    gap: '14px',

    marginBottom: '28px',
  },

  memberAvatar: {
    width: '46px',
    height: '46px',

    borderRadius: '50%',

    background:
      'linear-gradient(135deg, #23a559, #2dc770)',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    fontWeight: '900',
  },

  memberStatus: {
    color: '#b5bac1',
    fontSize: '13px',
  },

  gameCard: {
    position: 'relative',

    overflow: 'hidden',

    borderRadius: '22px',

    padding: '24px',

    background:
      'linear-gradient(135deg, rgba(88,101,242,0.2), rgba(35,165,89,0.12))',

    border: '1px solid rgba(255,255,255,0.08)',
  },

  gameGlow: {
    position: 'absolute',

    top: '-40px',
    right: '-40px',

    width: '120px',
    height: '120px',

    borderRadius: '50%',

    background:
      'radial-gradient(circle, rgba(123,92,255,0.35), transparent)',

    filter: 'blur(12px)',
  },

  gameTitle: {
    position: 'relative',
    zIndex: 1,

    marginBottom: '14px',

    fontSize: '28px',
    lineHeight: 1.1,
  },

  gameText: {
    position: 'relative',
    zIndex: 1,

    color: '#d7d9dc',
    lineHeight: 1.7,
  },
}

export default ChatRoomPage