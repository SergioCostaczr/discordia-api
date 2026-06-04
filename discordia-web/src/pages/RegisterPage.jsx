import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authService'
import { saveAuthSession } from '../services/authSession'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Preencha usuario e senha.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')

      const data = await register(username, password)

      saveAuthSession(data.token, username)

      navigate('/rooms')
    } catch (error) {
      console.error(error)
      const message = error.response?.data?.message || ''
      const normalizedMessage = message.toLowerCase()

      if (
        normalizedMessage.includes('exist') ||
        normalizedMessage.includes('usuario') ||
        normalizedMessage.includes('usuário')
      ) {
        setErrorMessage('Esse usuario ja existe. Tente outro nome.')
        return
      }

      setErrorMessage('Nao foi possivel criar sua conta agora.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .register-input::placeholder {
            color: #646a73;
          }

          .register-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18) !important;
            background: #121214 !important;
          }

          .register-button:hover {
            background: #2563eb !important;
          }

          .register-link:hover {
            color: #ffffff !important;
          }

          @media (max-width: 1120px) {
            .register-content {
              grid-template-columns: 1fr !important;
              max-width: 680px !important;
              gap: 28px !important;
            }

            .register-content section:first-child {
              justify-self: center !important;
              max-width: 520px !important;
            }

            .register-content section:last-child {
              display: none !important;
            }
          }

          @media (max-height: 760px) {
            .register-content {
              align-items: start !important;
            }
          }
        `}
      </style>

      <main className="register-content" style={styles.content}>
        <section style={styles.card}>
          <div style={styles.cardStatus}>
            <span style={styles.statusDot} />
            Cadastro aberto
          </div>

          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>D</div>
            <div>
              <h2 style={styles.title}>Crie sua conta</h2>
              <p style={styles.subtitle}>Entre nas salas do Discordia</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Usuario
              <input
                className="register-input"
                type="text"
                placeholder="Escolha um nome de usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Senha
              <input
                className="register-input"
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={styles.input}
              />
            </label>

            {errorMessage && (
              <p style={styles.errorMessage}>{errorMessage}</p>
            )}

            <button
              className="register-button"
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>ja faz parte?</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.footerText}>
            Ja possui uma conta?{' '}
            <Link className="register-link" to="/" style={styles.link}>
              Fazer login
            </Link>
          </p>
        </section>

        <section style={styles.rightPanel}>
          <div style={styles.badge}>Nova comunidade</div>

          <h1 style={styles.heroTitle}>
            Entre em salas ao vivo e jogue com outros membros.
          </h1>

          <p style={styles.heroText}>
            Crie sua conta para conversar em tempo real, acompanhar presenca e participar de desafios dentro do chat.
          </p>

          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <div style={styles.previewServerIcon}>#</div>
              <div>
                <strong style={styles.previewTitle}>discordia/geral</strong>
                <p style={styles.previewSubtitle}>comunidade online</p>
              </div>
            </div>

            <div style={styles.messageList}>
              <div style={styles.messageItem}>
                <div style={styles.avatarOne}>R</div>
                <div style={styles.messageBubble}>
                  <strong>Renato</strong>
                  <span>alguem cria uma sala pra jogar depois?</span>
                </div>
              </div>

              <div style={styles.messageItem}>
                <div style={styles.avatarTwo}>D</div>
                <div style={styles.messageBubble}>
                  <strong>Discordia</strong>
                  <span>nova sala criada em tempo real.</span>
                </div>
              </div>

              <div style={styles.typingRow}>
                <span style={styles.typingDot} />
                <span style={styles.typingDot} />
                <span style={styles.typingDot} />
                <p style={styles.typingText}>alguem esta digitando...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    background: '#121214',
    color: '#f1f1f3',
  },

  content: {
    width: '100%',
    maxWidth: '1080px',
    display: 'grid',
    gridTemplateColumns: '420px minmax(0, 1fr)',
    gap: '32px',
    alignItems: 'center',
    animation: 'fadeUp 0.7s ease forwards',
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '28px',
    borderRadius: '8px',
    background: '#1a1b1e',
    border: '1px solid #34363b',
    boxShadow: '0 18px 48px rgba(0, 0, 0, 0.32)',
  },

  cardStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: 'fit-content',
    marginBottom: '22px',
    padding: '6px 10px',
    borderRadius: '4px',
    background: '#14251b',
    color: '#86efac',
    border: '1px solid #1f5133',
    fontSize: '12px',
    fontWeight: 700,
  },

  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e',
  },

  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '30px',
  },

  logoIcon: {
    width: '58px',
    height: '58px',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    background: '#2563eb',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 900,
  },

  title: {
    margin: 0,
    fontSize: '25px',
    lineHeight: 1.1,
    letterSpacing: 0,
  },

  subtitle: {
    margin: '7px 0 0',
    color: '#9ca3af',
    fontSize: '14px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '17px',
  },

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    color: '#c9cdd5',
    fontSize: '13px',
    fontWeight: 700,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: '#121214',
    border: '1px solid #34363b',
    outline: 'none',
    padding: '13px 14px',
    borderRadius: '6px',
    color: '#f1f1f3',
    fontSize: '14px',
    transition: '0.22s ease',
  },

  button: {
    marginTop: '8px',
    width: '100%',
    border: 'none',
    background: '#3b82f6',
    color: '#ffffff',
    padding: '13px',
    borderRadius: '6px',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: 0,
    transition: '0.22s ease',
  },

  errorMessage: {
    margin: '-4px 0 0',
    padding: '12px 14px',
    borderRadius: '6px',
    background: '#351c1f',
    border: '1px solid #713239',
    color: '#fca5a5',
    fontSize: '13px',
    fontWeight: 800,
    textAlign: 'left',
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '28px 0 18px',
  },

  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#303239',
  },

  dividerText: {
    color: '#727780',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: 800,
  },

  footerText: {
    margin: 0,
    textAlign: 'center',
    color: '#a7acb5',
    fontSize: '14px',
  },

  link: {
    color: '#60a5fa',
    fontWeight: 900,
    textDecoration: 'none',
    transition: '0.2s ease',
  },

  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    padding: '28px',
    border: '1px solid #2f3137',
    borderRadius: '8px',
    background: '#18191c',
  },

  badge: {
    width: 'fit-content',
    padding: '6px 10px',
    borderRadius: '4px',
    background: '#202226',
    border: '1px solid #34363b',
    color: '#9ca3af',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  heroTitle: {
    margin: 0,
    maxWidth: '560px',
    fontSize: 'clamp(34px, 5vw, 54px)',
    lineHeight: 1,
    letterSpacing: 0,
    fontWeight: 800,
  },

  heroText: {
    margin: 0,
    maxWidth: '520px',
    color: '#b8bcc6',
    fontSize: '16px',
    lineHeight: 1.65,
  },

  previewCard: {
    padding: '16px',
    borderRadius: '8px',
    background: '#202226',
    border: '1px solid #303239',
  },

  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '14px',
    borderBottom: '1px solid #303239',
  },

  previewServerIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '5px',
    display: 'grid',
    placeItems: 'center',
    background: '#16171a',
    border: '1px solid #363942',
    color: '#60a5fa',
    fontWeight: 900,
  },

  previewTitle: {
    color: '#f1f1f3',
    fontSize: '15px',
  },

  previewSubtitle: {
    margin: '4px 0 0',
    color: '#9399a3',
    fontSize: '12px',
  },

  messageList: {
    display: 'grid',
    gap: '12px',
    paddingTop: '14px',
  },

  messageItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  avatarOne: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: '#334155',
    color: '#e2e8f0',
    fontWeight: 800,
    flex: '0 0 auto',
  },

  avatarTwo: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: 800,
    flex: '0 0 auto',
  },

  messageBubble: {
    display: 'grid',
    gap: '4px',
    padding: '9px 11px',
    borderRadius: '6px',
    background: '#18191c',
    border: '1px solid #303239',
    color: '#b8bcc6',
    fontSize: '13px',
  },

  typingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#8a9099',
    fontSize: '12px',
  },

  typingDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#8a9099',
  },

  typingText: {
    margin: '0 0 0 4px',
  },
}

export default RegisterPage
