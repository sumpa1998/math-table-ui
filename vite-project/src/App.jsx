import { useState, useEffect, useRef } from 'react'
import { fetchMathTable } from './mathService'
import './App.css'

const CHARACTERS = [
  { emoji: '🦁', name: 'Leo', color: '#FF6B35' },
  { emoji: '🐸', name: 'Froggy', color: '#4CAF50' },
  { emoji: '🦄', name: 'Sparkle', color: '#E040FB' },
  { emoji: '🐼', name: 'Panda', color: '#37474F' },
  { emoji: '🐯', name: 'Tigger', color: '#FF9800' },
  { emoji: '🦊', name: 'Felix', color: '#FF5722' },
]

const STAR_COLORS = ['#FFD700', '#FF6B9D', '#00E5FF', '#76FF03', '#FF9100']

function FloatingStar({ style }) {
  return (
    <div className="floating-star" style={style}>⭐</div>
  )
}

function ConfettiPiece({ style }) {
  return <div className="confetti" style={style} />
}

function NumberCard({ value, index, multiplier, isVisible }) {
  const step = index + 1
  return (
    <div
      className={`number-card ${isVisible ? 'pop-in' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="card-equation">
        <span className="eq-num">{multiplier}</span>
        <span className="eq-op">×</span>
        <span className="eq-num">{step}</span>
        <span className="eq-op">=</span>
      </div>
      <div className="card-result">{value}</div>
      <div className="card-stars">{'⭐'.repeat(Math.min(step, 5))}</div>
    </div>
  )
}

export default function App() {
  const [number, setNumber] = useState('')
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [character, setCharacter] = useState(CHARACTERS[0])
  const [celebrate, setCelebrate] = useState(false)
  const [floatingStars, setFloatingStars] = useState([])
  const [confetti, setConfetti] = useState([])
  const [charBounce, setCharBounce] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const stars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 20 + 10}px`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
        opacity: 0.4,
      }
    }))
    setFloatingStars(stars)
  }, [])

  const triggerCelebration = () => {
    setCelebrate(true)
    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `-10px`,
        background: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        width: `${Math.random() * 10 + 6}px`,
        height: `${Math.random() * 10 + 6}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        animationDuration: `${Math.random() * 1.5 + 1}s`,
        animationDelay: `${Math.random() * 0.5}s`,
      }
    }))
    setConfetti(pieces)
    setTimeout(() => {
      setCelebrate(false)
      setConfetti([])
    }, 2500)
  }

  const handleFetch = async () => {
    const num = parseInt(number)
    if (!number || isNaN(num) || num < 1 || num > 100) {
      setError('Please enter a number between 1 and 100! 😊')
      setCharBounce(true)
      setTimeout(() => setCharBounce(false), 600)
      return
    }

    setError('')
    setLoading(true)
    setTableData([])
    setCharacter(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)])

    try {
      const data = await fetchMathTable(num)
      setTableData(data)
      triggerCelebration()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFetch()
  }

  const handleNumberClick = (n) => {
    setNumber(String(n))
    inputRef.current?.focus()
  }

  return (
    <div className="app-wrapper">
      {floatingStars.map(s => <FloatingStar key={s.id} style={s.style} />)}
      {confetti.map(c => <ConfettiPiece key={c.id} style={c.style} />)}

      <header className="app-header">
        <div className="header-bubbles">
          <span>🔢</span><span>✨</span><span>🌈</span><span>🧮</span><span>⭐</span>
        </div>
        <h1 className="app-title">
          <span className="title-math">Math</span>
          <span className="title-magic">Magic!</span>
          <span className="title-rocket">🚀</span>
        </h1>
        <p className="app-subtitle">Learn your multiplication tables the FUN way!</p>
      </header>

      <div className={`mascot-container ${charBounce ? 'bounce-error' : ''} ${celebrate ? 'mascot-celebrate' : ''}`}>
        <div className="mascot-bubble">
          {tableData.length > 0
            ? `WOW! The ${number} table is AMAZING! 🎉`
            : loading
            ? 'Calculating... Hold on! 🤔'
            : "Pick a number and I'll show you the magic! ✨"}
        </div>
        <div className="mascot-emoji" style={{ filter: `drop-shadow(0 0 12px ${character.color})` }}>
          {character.emoji}
        </div>
        <div className="mascot-name" style={{ color: character.color }}>{character.name}</div>
      </div>

      <div className="input-section">
        <div className="input-card">
          <label className="input-label">Enter a Number (1–100)</label>
          <div className="input-row">
            <input
              ref={inputRef}
              className="number-input"
              type="number"
              min="1"
              max="100"
              value={number}
              onChange={e => setNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 5"
            />
            <button
              className={`go-btn ${loading ? 'loading' : ''}`}
              onClick={handleFetch}
              disabled={loading}
            >
              {loading ? <span className="spinner">⏳</span> : '🎯 Go!'}
            </button>
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <div className="quick-picks">
            <span className="quick-label">Quick pick:</span>
            <div className="quick-grid">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(n => (
                <button
                  key={n}
                  className="quick-btn"
                  onClick={() => handleNumberClick(n)}
                  style={{ background: STAR_COLORS[n % STAR_COLORS.length] }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="results-section">
          <div className="results-title">
            <span>🌟 Table of {number} 🌟</span>
          </div>
          <div className="cards-grid">
            {tableData.map((val, i) => (
              <NumberCard
                key={i}
                value={val}
                index={i}
                multiplier={number}
                isVisible={true}
              />
            ))}
          </div>
          <div className="results-footer">
            🎊 You learned the {number} times table! You're a SUPERSTAR! 🎊
          </div>
        </div>
      )}

      <div className="clouds-row">
        <span>☁️</span><span>☁️</span><span>☁️</span>
      </div>
    </div>
  )
}
