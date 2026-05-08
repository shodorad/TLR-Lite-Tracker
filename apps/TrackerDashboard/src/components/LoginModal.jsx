import { useState } from 'react'

export default function LoginModal({ onLogin, error }) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !token.trim()) return
    setLoading(true)
    await onLogin(email.trim(), token.trim())
    setLoading(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#fff" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2>Connect to Jira</h2>
        <p>
          Enter your Atlassian credentials. Stored in <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>localStorage</code> for this browser only.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="form-lbl">Atlassian Email</label>
          <input
            type="email"
            className="form-inp"
            placeholder="you@radiant.digital"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
          />
          <label className="form-lbl">API Token</label>
          <input
            type="password"
            className="form-inp"
            placeholder="ATATT3x…"
            value={token}
            onChange={e => setToken(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className="form-err">{error}</div>}
          <button
            type="submit"
            className="btn btn-blue btn-wide"
            disabled={loading || !email || !token}
          >
            {loading ? 'Connecting…' : 'Connect & Load Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
