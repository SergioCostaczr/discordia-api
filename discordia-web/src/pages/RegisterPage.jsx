import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authService'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      alert('Preencha usuário e senha')
      return
    }

    if (password.length < 4) {
      alert('A senha precisa ter pelo menos 4 caracteres')
      return
    }

    try {
      setLoading(true)

      const data = await register(username, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username)

      navigate('/rooms')
    } catch (error) {
      console.error(error)
      alert('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes floatGlow {
            0% {
              transform: translateY(0px);
              opacity: 0.75;
            }

            50% {
              transform: translateY(-18px);
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
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .register-input::placeholder {
            color: rgba(229, 231, 235, 0.45);
          }

          .register-input:focus {
            border-color: rgba(34, 211, 238, 0.95) !important;
            box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.14), 0 0 26px rgba(34, 211, 238, 0.18) !important;
            background: rgba(15, 23, 42, 0.9) !important;
          }

          .register-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 45px rgba(34, 211, 238, 0.32);
            filter: brightness(1.08);
          }

          .register-link:hover {
            color: #ffffff !important;
            text-shadow: 0 0 18px rgba(34, 211, 238, 0.7);
          }
        `}
      </style>

      <div style={styles.backgroundOrbOne} />
      <div style={styles.backgroundOrbTwo} />
      <div style={styles.backgroundOrbThree} />

      <main style={styles.content}>
        <section style={styles.card}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>D</div>
            <div>
              <h2 style={styles.title}>Crie sua conta</h2>
              <p style={styles.subtitle}>Comece sua experiência no Discordia</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Usuário
              <input
                className="register-input"
                type="text"
                placeholder="Escolha um nome de usuário"
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
              {loading ? 'Criando conta...' : 'Entrar para o Discordia'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>já faz parte?</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.footerText}>
            Já possui uma conta?{' '}
            <Link className="register-link" to="/" style={styles.link}>
              Fazer login
            </Link>
          </p>
        </section>

        <section style={styles.rightPanel}>
          <div style={styles.badge}>Nova comunidade</div>

          <h1 style={styles.heroTitle}>
            Sua sala.
            <br />
            Sua voz.
            <br />
            <span style={styles.heroHighlight}>Seu espaço.</span>
          </h1>

          <p style={styles.heroText}>
            Crie sua conta para entrar em salas ao vivo, conversar em tempo real e participar de uma experiência social mais dinâmica.
          </p>

          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <div style={styles.previewServerIcon}>D</div>
              <div>
                <strong style={styles.previewTitle}>discordia/general</strong>
                <p style={styles.previewSubtitle}>comunidade online</p>
              </div>
            </div>

            <div style={styles.messageList}>
              <div style={styles.messageItem}>
                <div style={styles.avatarOne}>R</div>
                <div style={styles.messageBubble}>
                  <strong>Renato</strong>
                  <span>alguém cria uma sala pra jogar depois?</span>
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
                <p style={styles.typingText}>alguém está digitando...</p>
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
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    background:
      'radial-gradient(circle at top right, rgba(34, 211, 238, 0.2), transparent 34%), radial-gradient(circle at bottom left, rgba(88, 101, 242, 0.24), transparent 34%), linear-gradient(135deg, #020617 0%, #0f172a 48%, #111827 100%)',
    color: '#f8fafc',
  },

  backgroundOrbOne: {
    position: 'absolute',
    width: '380px',
    height: '380px',
    borderRadius: '999px',
    background: 'rgba(34, 211, 238, 0.18)',
    filter: 'blur(85px)',
    top: '-110px',
    right: '-70px',
    animation: 'floatGlow 7s ease-in-out infinite',
  },

  backgroundOrbTwo: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '999px',
    background: 'rgba(88, 101, 242, 0.24)',
    filter: 'blur(90px)',
    bottom: '-150px',
    left: '-100px',
    animation: 'floatGlow 9s ease-in-out infinite',
  },

  backgroundOrbThree: {
    position: 'absolute',
    width: '260px',
    height: '260px',
    borderRadius: '999px',
    background: 'rgba(168, 85, 247, 0.14)',
    filter: 'blur(75px)',
    top: '46%',
    left: '46%',
    animation: 'floatGlow 8s ease-in-out infinite',
  },

  content: {
    width: '100%',
    maxWidth: '1120px',
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '48px',
    alignItems: 'center',
    animation: 'fadeUp 0.7s ease forwards',
  },

  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '34px',
    borderRadius: '30px',
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.68))',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow:
      '0 28px 90px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(24px)',
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
    borderRadius: '20px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #22d3ee, #5865f2)',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 900,
    boxShadow: '0 18px 45px rgba(34, 211, 238, 0.28)',
  },

  title: {
    margin: 0,
    fontSize: '27px',
    lineHeight: 1.1,
    letterSpacing: '-0.8px',
  },

  subtitle: {
    margin: '7px 0 0',
    color: 'rgba(203, 213, 225, 0.68)',
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
    color: 'rgba(226, 232, 240, 0.84)',
    fontSize: '13px',
    fontWeight: 700,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(2, 6, 23, 0.62)',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    outline: 'none',
    padding: '15px 16px',
    borderRadius: '15px',
    color: '#f8fafc',
    fontSize: '15px',
    transition: '0.22s ease',
  },

  button: {
    marginTop: '8px',
    width: '100%',
    border: 'none',
    background: 'linear-gradient(135deg, #22d3ee, #5865f2)',
    color: '#ffffff',
    padding: '15px',
    borderRadius: '16px',
    fontWeight: 900,
    fontSize: '15px',
    letterSpacing: '0.2px',
    transition: '0.22s ease',
    boxShadow: '0 15px 38px rgba(34, 211, 238, 0.24)',
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
    background: 'rgba(148, 163, 184, 0.18)',
  },

  dividerText: {
    color: 'rgba(203, 213, 225, 0.5)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: 800,
  },

  footerText: {
    margin: 0,
    textAlign: 'center',
    color: 'rgba(203, 213, 225, 0.72)',
    fontSize: '14px',
  },

  link: {
    color: '#67e8f9',
    fontWeight: 900,
    textDecoration: 'none',
    transition: '0.2s ease',
  },

  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  badge: {
    width: 'fit-content',
    padding: '9px 14px',
    borderRadius: '999px',
    background: 'rgba(34, 211, 238, 0.12)',
    border: '1px solid rgba(34, 211, 238, 0.3)',
    color: '#a5f3fc',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    boxShadow: '0 0 28px rgba(34, 211, 238, 0.12)',
  },

  heroTitle: {
    margin: 0,
    maxWidth: '650px',
    fontSize: 'clamp(44px, 6vw, 76px)',
    lineHeight: '0.96',
    letterSpacing: '-3px',
    fontWeight: 900,
  },

  heroHighlight: {
    background: 'linear-gradient(135deg, #22d3ee, #818cf8, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  heroText: {
    margin: 0,
    maxWidth: '560px',
    color: 'rgba(226, 232, 240, 0.76)',
    fontSize: '18px',
    lineHeight: 1.7,
  },

  previewCard: {
    maxWidth: '560px',
    padding: '18px',
    borderRadius: '26px',
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.74), rgba(2, 6, 23, 0.58))',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    boxShadow:
      '0 28px 80px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
  },

  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '10px 10px 18px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.13)',
  },

  previewServerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '15px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #5865f2, #9333ea)',
    color: '#ffffff',
    fontWeight: 900,
  },

  previewTitle: {
    display: 'block',
    color: '#ffffff',
    fontSize: '15px',
  },

  previewSubtitle: {
    margin: '4px 0 0',
    color: 'rgba(203, 213, 225, 0.55)',
    fontSize: '13px',
  },

  messageList: {
    display: 'grid',
    gap: '14px',
    padding: '18px 8px 8px',
  },

  messageItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },

  avatarOne: {
    minWidth: '38px',
    height: '38px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #f97316, #ec4899)',
    color: '#ffffff',
    fontWeight: 900,
  },

  avatarTwo: {
    minWidth: '38px',
    height: '38px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #22d3ee, #5865f2)',
    color: '#ffffff',
    fontWeight: 900,
  },

  messageBubble: {
    display: 'grid',
    gap: '4px',
    padding: '12px 14px',
    borderRadius: '16px',
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    color: 'rgba(226, 232, 240, 0.78)',
    fontSize: '13px',
  },

  typingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '50px',
    padding: '9px 12px',
    width: 'fit-content',
    borderRadius: '999px',
    background: 'rgba(15, 23, 42, 0.65)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
  },

  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    background: '#67e8f9',
    boxShadow: '0 0 14px rgba(103, 232, 249, 0.7)',
  },

  typingText: {
    margin: '0 0 0 6px',
    color: 'rgba(203, 213, 225, 0.56)',
    fontSize: '12px',
  },
}

export default RegisterPage