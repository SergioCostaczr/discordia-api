import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'
import { saveAuthSession } from '../services/authSession'

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Preencha usuário e senha.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')

      const data = await login(username, password)

      saveAuthSession(data.token, username)

      navigate('/rooms')
    } catch (error) {
      console.error(error)
      setErrorMessage('Usuário ou senha inválidos.')
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

          .login-input::placeholder {
            color: #646a73;
          }

          .login-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18) !important;
            background: #121214 !important;
          }

          .login-button:hover {
            background: #2563eb !important;
          }

          .login-link:hover {
            color: #ffffff !important;
          }

          @media (max-width: 1120px) {
            .login-content {
              grid-template-columns: 1fr !important;
              max-width: 680px !important;
              gap: 28px !important;
            }

            .login-content section:first-child {
              display: none !important;
            }

            .login-content section:last-child {
              justify-self: center !important;
              max-width: 520px !important;
            }
          }

          @media (max-height: 760px) {
            .login-content {
              align-items: start !important;
            }
          }
        `}
      </style>

      <main className="login-content" style={styles.content}>
        <section style={styles.leftPanel}>
          <div style={styles.badge}>Discordia / acesso</div>

          <h1 style={styles.heroTitle}>
            Chat em tempo real para salas e jogos.
          </h1>

          <p style={styles.heroText}>
            Acompanhe conversas ao vivo, entre nas salas certas e desafie outros membros quando quiser jogar.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>#</span>
              <div style={styles.featureContent}>
                <strong style={styles.featureTitle}>Salas em tempo real</strong>
                <p style={styles.featureText}>Canais com histórico, presença e troca instantânea.</p>
              </div>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>✦</span>
              <div style={styles.featureContent}>
                <strong style={styles.featureTitle}>Fluxo direto</strong>
                <p style={styles.featureText}>Entre na sua conta e continue de onde parou.</p>
              </div>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>▶</span>
              <div style={styles.featureContent}>
                <strong style={styles.featureTitle}>Jogos integrados</strong>
                <p style={styles.featureText}>Desafios multiplayer dentro da propria sala de conversa.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardStatus}>
            <span style={styles.statusDot} />
            Ambiente online
          </div>

          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>D</div>
            <div>
              <h2 style={styles.title}>Bem-vindo de volta</h2>
              <p style={styles.subtitle}>Acesse sua conta para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Usuário
              <input
                className="login-input"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Senha
              <input
                className="login-input"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={styles.input}
              />
            </label>

            {errorMessage && (
              <p style={styles.errorMessage}>{errorMessage}</p>
            )}

            <button
              className="login-button"
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>novo por aqui?</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.footerText}>
            Ainda não tem conta?{' '}
            <Link className="login-link" to="/register" style={styles.link}>
              Criar conta
            </Link>
          </p>
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
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 420px',
    gap: '32px',
    alignItems: 'center',
    animation: 'fadeUp 0.7s ease forwards',
  },

  leftPanel: {
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
    textAlign: 'left',
    fontSize: 'clamp(36px, 5vw, 58px)',
    lineHeight: 1,
    letterSpacing: 0,
    fontWeight: 800,
  },

  heroText: {
    margin: 0,
    maxWidth: '520px',
    textAlign: 'left',
    color: '#b8bcc6',
    fontSize: '16px',
    lineHeight: 1.65,
  },

  featureList: {
    display: 'grid',
    gap: '10px',
    maxWidth: '540px',
    marginTop: '4px',
  },

  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '6px',
    background: '#202226',
    border: '1px solid #303239',
  },

  featureIcon: {
    flex: '0 0 42px',
    width: '42px',
    minWidth: '42px',
    height: '42px',
    borderRadius: '5px',
    display: 'grid',
    placeItems: 'center',
    background: '#16171a',
    border: '1px solid #363942',
    color: '#60a5fa',
    fontWeight: 900,
    lineHeight: 1,
  },

  featureContent: {
    flex: 1,
    minHeight: '42px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
  },

  featureTitle: {
    display: 'block',
    color: '#f1f1f3',
    fontSize: '15px',
    marginBottom: '4px',
  },

  featureText: {
    margin: 0,
    color: '#9399a3',
    fontSize: '13px',
    lineHeight: 1.5,
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    justifySelf: 'end',
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
}

export default LoginPage
