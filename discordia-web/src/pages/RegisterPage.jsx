import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const data = await register(username, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username)

      navigate('/rooms')
    } catch (err) {
      setError('Erro ao criar conta. Verifique os dados.')
    }
  }

  return (
    <div>
      <h1>Criar conta</h1>

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

        <button type="submit">Cadastrar</button>
      </form>

      <button onClick={() => navigate('/')}>
        Voltar para login
      </button>
    </div>
  )
}

export default RegisterPage