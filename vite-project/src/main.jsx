// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import App from './App.jsx'
import Login from './Login.jsx'
import './index.css'

// ── Protected route: only lets logged-in users through ──────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    // Full-screen loading spinner while Firebase resolves auth state
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #1a0533 0%, #0d1b6e 40%, #0a3d5c 70%, #0d2937 100%)',
        fontSize: '3rem',
      }}>
        ⏳
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

// ── Public route: redirects already-logged-in users to home ─────
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)