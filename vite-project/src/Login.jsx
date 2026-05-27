// src/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithEmail, signUpWithEmail, loginWithGoogle } from './firebase'
import './Login.css'

const FRIENDLY_ERRORS = {
  'auth/user-not-found':       'No account found with that email. Sign up first! 👇',
  'auth/wrong-password':       'Wrong password. Try again! 🔑',
  'auth/invalid-credential':   'Incorrect email or password. Try again! 🔑',
  'auth/email-already-in-use': 'That email is already registered. Log in instead! 👆',
  'auth/weak-password':        'Password must be at least 6 characters. 💪',
  'auth/invalid-email':        'That doesn\'t look like a valid email. 📧',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled. Try again! 😊',
  'auth/too-many-requests':    'Too many attempts. Please wait a moment. ⏳',
}

function getError(err) {
  return FRIENDLY_ERRORS[err?.code] || err?.message || 'Something went wrong. Try again! 😅'
}

export default function Login() {
  const navigate        = useNavigate()
  const [mode, setMode] = useState('login')   // 'login' | 'signup'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const isSignup = mode === 'signup'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        await signUpWithEmail(email, password)
      } else {
        await loginWithEmail(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(getError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(getError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Animated background stars */}
      <div className="auth-stars" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="auth-star" style={{
            left:              `${Math.random() * 100}%`,
            top:               `${Math.random() * 100}%`,
            animationDelay:    `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            fontSize:          `${10 + Math.random() * 16}px`,
            opacity:           0.2 + Math.random() * 0.3,
          }}>⭐</span>
        ))}
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">🚀</div>
          <h1 className="auth-title">
            <span className="auth-title-math">Math</span>
            <span className="auth-title-magic">Magic!</span>
          </h1>
          <p className="auth-subtitle">
            {isSignup ? 'Create your account to start learning! 🌟' : 'Welcome back, superstar! 🎉'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
            type="button"
          >
            🔑 Log In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError('') }}
            type="button"
          >
            ✨ Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">📧 Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">🔒 Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">⚠️ {error}</div>
          )}

          <button
            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading
              ? <span className="auth-spinner">⏳</span>
              : isSignup ? '🚀 Create Account' : '🎯 Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        {/* Google button */}
        <button
          className={`auth-google-btn ${loading ? 'loading' : ''}`}
          onClick={handleGoogle}
          disabled={loading}
          type="button"
        >
          <svg className="google-icon" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer switch */}
        <p className="auth-footer">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            className="auth-footer-link"
            onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError('') }}
            type="button"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}