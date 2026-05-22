import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image2 from '../assets/image2.png'

// ─── Twitter OAuth config ────────────────────────────────────────────────────
// Replace these with your actual Twitter OAuth 2.0 app credentials
const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID || 'YOUR_CLIENT_ID'
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + '/callback'

function buildTwitterAuthUrl() {
  const state = crypto.randomUUID()
  const codeVerifier = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  sessionStorage.setItem('twitter_state', state)
  sessionStorage.setItem('twitter_code_verifier', codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'tweet.read users.read',
    state,
    code_challenge: codeVerifier, // simplified — swap for real PKCE in production
    code_challenge_method: 'plain',
  })
  return `https://twitter.com/i/oauth2/authorize?${params}`
}
// ────────────────────────────────────────────────────────────────────────────

export default function Screen2Connect({ onNext }) {
  const [phase, setPhase] = useState('idle') // idle | waiting | manual | done
  const [manualHandle, setManualHandle] = useState('')
  const [manualError, setManualError] = useState('')

  // If user returns from OAuth with ?code= in URL, pick up their handle
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const returnedState = params.get('state')
    const savedState = sessionStorage.getItem('twitter_state')

    if (code && returnedState && returnedState === savedState) {
      // In production: exchange code for token → fetch /2/users/me → get username
      // Here we skip to manual entry pre-filled, or you can do the exchange server-side
      window.history.replaceState({}, '', window.location.pathname)
      setPhase('manual')
    }
  }, [])

  const handleConnect = () => {
    if (TWITTER_CLIENT_ID === 'YOUR_CLIENT_ID') {
      // No real credentials configured — jump straight to manual entry
      setPhase('manual')
      return
    }
    setPhase('waiting')
    window.location.href = buildTwitterAuthUrl()
  }

  const handleManualSubmit = () => {
    const clean = manualHandle.replace('@', '').trim()
    if (!clean) { setManualError('Username required'); return }
    setPhase('done')
    setTimeout(() => onNext(clean), 600)
  }

  return (
    <motion.div
      key="screen2"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#020a04', overflow: 'hidden', zIndex: 2, paddingTop: '52px',
      }}
    >
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── Image ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.9 }}
        style={{ position: 'relative', zIndex: 5, cursor: phase === 'idle' ? 'pointer' : 'default' }}
        onClick={phase === 'idle' ? handleConnect : undefined}
      >
        <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse at 50% 60%, rgba(0,255,136,0.15) 0%, transparent 65%)', pointerEvents: 'none', zIndex: -1 }} />
        <motion.img
          src={image2}
          alt="Connect"
          whileHover={phase === 'idle' ? { scale: 1.04, filter: 'drop-shadow(0 0 32px rgba(0,255,136,0.5)) drop-shadow(0 0 10px rgba(0,255,136,0.3))' } : {}}
          transition={{ duration: 0.25 }}
          style={{ width: 'min(300px, 78vw)', height: 'auto', display: 'block', filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.3)) drop-shadow(0 0 6px rgba(0,255,136,0.15))' }}
        />
        {/* Click hint on image */}
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            style={{ position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: '0.3em', whiteSpace: 'nowrap' }}
          >
            ↑ CLICK TO CONNECT
          </motion.div>
        )}
      </motion.div>

      {/* ── Title ── */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 3.8vw, 2rem)', color: 'var(--green-bright)', letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center', textShadow: '0 0 20px rgba(0,255,136,0.6)', marginTop: '36px', marginBottom: '8px', zIndex: 10 }}
      >
        CONNECT
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ width: '160px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--green-bright), transparent)', marginBottom: '24px', zIndex: 10 }}
      />

      {/* ── Phase content ── */}
      <AnimatePresence mode="wait">

        {/* IDLE — main connect button */}
        {phase === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ delay: 0.85 }} style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button className="btn-ritual" onClick={handleConnect} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 40px' }}>
              <span style={{ fontSize: '1.1rem' }}>𝕏</span>
              CONNECT WITH TWITTER
            </button>
            <button
              onClick={() => setPhase('manual')}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.2em', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(0,255,136,0.2)' }}
            >
              enter username manually
            </button>
          </motion.div>
        )}

        {/* WAITING */}
        {phase === 'waiting' && (
          <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 10, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--green-bright)', letterSpacing: '0.3em' }}>REDIRECTING...</div>
          </motion.div>
        )}

        {/* MANUAL — type username */}
        {phase === 'manual' && (
          <motion.div key="manual" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ zIndex: 10, width: 'min(360px, 88vw)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--green-mid)', letterSpacing: '0.25em', textAlign: 'center' }}>
              ENTER YOUR TWITTER USERNAME
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--green-mid)', pointerEvents: 'none' }}>@</span>
              <input
                type="text"
                placeholder="username"
                value={manualHandle}
                autoFocus
                onChange={e => { setManualHandle(e.target.value); setManualError('') }}
                onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                style={{ width: '100%', padding: '12px 14px 12px 32px', background: 'rgba(0,255,136,0.04)', border: `1px solid ${manualError ? '#ff4466' : 'rgba(0,255,136,0.3)'}`, color: 'var(--green-bright)', fontFamily: 'var(--font-body)', fontSize: '1rem', letterSpacing: '0.1em', outline: 'none' }}
                onFocus={e => { e.target.style.borderColor = 'var(--green-bright)'; e.target.style.boxShadow = '0 0 12px rgba(0,255,136,0.2)' }}
                onBlur={e => { e.target.style.borderColor = manualError ? '#ff4466' : 'rgba(0,255,136,0.3)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            {manualError && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: '#ff4466', letterSpacing: '0.1em' }}>{manualError}</div>}
            <button className="btn-ritual" onClick={handleManualSubmit} style={{ width: '100%' }}>
              CONTINUE →
            </button>
          </motion.div>
        )}

        {/* DONE */}
        {phase === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ zIndex: 10, fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--green-bright)', letterSpacing: '0.3em', textShadow: '0 0 20px rgba(0,255,136,0.8)' }}>
            ✓ CONNECTED
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.4 }}
        style={{ position: 'absolute', bottom: '6%', fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.3em' }}
      >
        TWITTER / X ACCOUNT REQUIRED
      </motion.div>
    </motion.div>
  )
}
