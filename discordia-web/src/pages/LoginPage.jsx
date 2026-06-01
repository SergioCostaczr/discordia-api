import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)

      const data = await login(username, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username)

      navigate('/rooms')
    } catch (error) {
      console.error(error)
      alert('Usuário ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Discordia</h1>
        <p style={styles.subtitle}>Entre na sua conta</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.footerText}>
          Não possui conta?{' '}
          <Link to="/register" style={styles.link}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--background-tertiary)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'var(--background-secondary)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-default)',
  },
  title: {
    fontSize: '32px',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    backgroundColor: 'var(--background-primary)',
    border: '1px solid var(--border-color)',
    padding: '14px',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '15px',
  },
  button: {
    backgroundColor: 'var(--brand-color)',
    color: 'white',
    padding: '14px',
    borderRadius: '10px',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  footerText: {
    marginTop: '24px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--brand-color)',
    fontWeight: 'bold',
  },
}

export default LoginPage