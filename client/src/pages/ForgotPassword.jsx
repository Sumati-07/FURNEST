import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../services/api.js'

export default function ForgotPassword() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await requestPasswordReset({ userId, email })
      setStatus('If those details match an account, a reset email is on its way.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-pine">Reset your password</h1>
        <p className="mt-1 text-sm text-bark/70">
          Enter your user ID and the email on your account. We'll send a link to verify and set a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          User ID or username
          <input
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-rosewood">{error}</p>}
        {status && <p className="text-sm text-pine">{status}</p>}

        <button
          type="submit"
          className="focus-ring mt-1 rounded-full bg-pine py-2.5 text-sm font-medium text-white hover:bg-pineDark"
        >
          Send reset email
        </button>

        <p className="text-center text-sm text-bark/70">
          <Link to="/login" className="font-medium text-pine hover:underline">Back to sign in</Link>
        </p>
      </form>
    </div>
  )
}
