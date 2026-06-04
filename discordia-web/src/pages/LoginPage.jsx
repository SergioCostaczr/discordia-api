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

          .login-input::placeholder {
            color: rgba(229, 231, 235, 0.45);
          }

          .login-input:focus {
            border-color: rgba(129, 140, 248, 0.95) !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16), 0 0 26px rgba(129, 140, 248, 0.18) !important;
            background: rgba(15, 23, 42, 0.9) !important;
          }

          .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 45px rgba(88, 101, 242, 0.45);
            filter: brightness(1.08);
          }

          .login-link:hover {
            color: #ffffff !important;
            text-shadow: 0 0 18px rgba(129, 140, 248, 0.7);
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
              transform: scale(0.94);
              transform-origin: center;
            }
          }
        `}
      </style>

      <div style={styles.backgroundOrbOne} />
      <div style={styles.backgroundOrbTwo} />
      <div style={styles.backgroundOrbThree} />

      <main className="login-content" style={styles.content}>
        <section style={styles.leftPanel}>
          <div style={styles.badge}>Realtime chat</div>

          <h1 style={styles.heroTitle}>
            Entre no
            <span style={styles.heroHighlight}> Discordia</span>
          </h1>

          <p style={styles.heroText}>
            Converse em salas ao vivo, acompanhe mensagens em tempo real e entre em uma experiência feita para parecer viva.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>#</span>
              <div>
                <strong style={styles.featureTitle}>Salas em tempo real</strong>
                <p style={styles.featureText}>Canais com histórico, presença e troca instantânea.</p>
              </div>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>✦</span>
              <div>
                <strong style={styles.featureTitle}>Interface premium</strong>
                <p style={styles.featureText}>Glow, profundidade e um visual inspirado em comunidades modernas.</p>
              </div>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>▶</span>
              <div>
                <strong style={styles.featureTitle}>Pronto para jogos</strong>
                <p style={styles.featureText}>Base preparada para experiências multiplayer dentro do chat.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.card}>
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
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    background:
      'radial-gradient(circle at top left, rgba(88, 101, 242, 0.25), transparent 32%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.22), transparent 35%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)',
    color: '#f8fafc',
  },

  backgroundOrbOne: {
    position: 'absolute',
    width: '360px',
    height: '360px',
    borderRadius: '999px',
    background: 'rgba(88, 101, 242, 0.28)',
    filter: 'blur(80px)',
    top: '-90px',
    left: '-80px',
    animation: 'floatGlow 7s ease-in-out infinite',
  },

  backgroundOrbTwo: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '999px',
    background: 'rgba(168, 85, 247, 0.2)',
    filter: 'blur(90px)',
    bottom: '-140px',
    right: '-100px',
    animation: 'floatGlow 9s ease-in-out infinite',
  },

  backgroundOrbThree: {
    position: 'absolute',
    width: '260px',
    height: '260px',
    borderRadius: '999px',
    background: 'rgba(34, 211, 238, 0.12)',
    filter: 'blur(75px)',
    top: '42%',
    left: '48%',
    animation: 'floatGlow 8s ease-in-out infinite',
  },

  content: {
    width: '100%',
    maxWidth: '1120px',
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '48px',
    alignItems: 'center',
    animation: 'fadeUp 0.7s ease forwards',
  },

  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  badge: {
    width: 'fit-content',
    padding: '9px 14px',
    borderRadius: '999px',
    background: 'rgba(88, 101, 242, 0.14)',
    border: '1px solid rgba(129, 140, 248, 0.35)',
    color: '#c7d2fe',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    boxShadow: '0 0 28px rgba(88, 101, 242, 0.16)',
  },

  heroTitle: {
    margin: 0,
    maxWidth: '620px',
    fontSize: 'clamp(44px, 6vw, 76px)',
    lineHeight: '0.96',
    letterSpacing: '-3px',
    fontWeight: 900,
  },

  heroHighlight: {
    background: 'linear-gradient(135deg, #818cf8, #c084fc, #22d3ee)',
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

  featureList: {
    display: 'grid',
    gap: '14px',
    maxWidth: '560px',
    marginTop: '8px',
  },

  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(15, 23, 42, 0.52)',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    boxShadow: '0 18px 60px rgba(0, 0, 0, 0.18)',
    backdropFilter: 'blur(18px)',
  },

  featureIcon: {
    minWidth: '42px',
    height: '42px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.95), rgba(168, 85, 247, 0.9))',
    color: '#ffffff',
    fontWeight: 900,
    boxShadow: '0 12px 30px rgba(88, 101, 242, 0.28)',
  },

  featureTitle: {
    display: 'block',
    color: '#ffffff',
    fontSize: '15px',
    marginBottom: '4px',
  },

  featureText: {
    margin: 0,
    color: 'rgba(203, 213, 225, 0.68)',
    fontSize: '13px',
    lineHeight: 1.5,
  },

  card: {
    width: '100%',
    maxWidth: '440px',
    justifySelf: 'end',
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
    background: 'linear-gradient(135deg, #5865f2, #9333ea)',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 900,
    boxShadow: '0 18px 45px rgba(88, 101, 242, 0.42)',
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
    background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
    color: '#ffffff',
    padding: '15px',
    borderRadius: '16px',
    fontWeight: 900,
    fontSize: '15px',
    letterSpacing: '0.2px',
    transition: '0.22s ease',
    boxShadow: '0 15px 38px rgba(88, 101, 242, 0.35)',
  },

  errorMessage: {
    margin: '-4px 0 0',
    padding: '12px 14px',
    borderRadius: '14px',
    background: 'rgba(248, 113, 113, 0.12)',
    border: '1px solid rgba(248, 113, 113, 0.22)',
    color: '#fecaca',
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
    color: '#a5b4fc',
    fontWeight: 900,
    textDecoration: 'none',
    transition: '0.2s ease',
  },
}

export default LoginPage
