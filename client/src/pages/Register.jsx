import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api.js'

const initial = { username: '', email: '', phone: '', password: '', confirmPassword: '' }

export default function Register({ onLogin }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { token, user } = await register(form)
      onLogin(token, user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6 py-12">
      <div>
        <h1 className="font-display text-3xl font-semibold text-pine">Create your account</h1>
        <p className="mt-1 text-sm text-bark/70">One account for both listing and looking after pets.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Username
          <input
            required
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Phone number
          <input
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Confirm password
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-rosewood">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-1 rounded-full bg-pine py-2.5 text-sm font-medium text-white hover:bg-pineDark disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-bark/70">
          Already have an account? <Link to="/login" className="font-medium text-pine hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
