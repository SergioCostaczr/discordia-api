import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const data = await login(username, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username)

      navigate('/rooms')
    } catch (err) {
      setError('Usuário ou senha inválidos.')
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Entrar</button>
      </form>

      <button onClick={() => navigate('/register')}>
        Criar conta
      </button>
    </div>
  )
}

export default LoginPage