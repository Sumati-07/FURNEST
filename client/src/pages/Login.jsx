import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api.js'

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, user } = await login(identifier, password)
      onLogin(token, user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-pine">furnest</h1>
        <p className="mt-1 text-sm text-bark/70">Log in to give or find temporary pet care.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Username or user ID
          <input
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="ananya.r"
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <Link to="/forgot-password" className="self-end text-xs text-pine hover:underline">
          Forgot password?
        </Link>

        {error && <p className="text-sm text-rosewood">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-1 rounded-full bg-pine py-2.5 text-sm font-medium text-white hover:bg-pineDark disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center text-xs text-bark/50">
          Try <code>ananya.r</code> / any password — auth is mocked for now.
        </p>
        <p className="text-center text-sm text-bark/70">
          New here? <Link to="/register" className="font-medium text-pine hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
