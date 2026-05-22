import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Screen3Username({ twitterHandle: prefilled, onNext }) {
  const [handle, setHandle] = useState(prefilled || '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    const clean = handle.replace('@', '').trim()
    if (!clean) { setError('Twitter handle required'); return }
    if (clean.length < 1 || clean.length > 50) { setError('Invalid handle'); return }
    setSubmitting(true)
    setTimeout(() => onNext(clean), 800)
  }

  return (
    <motion.div
      key="screen3"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020a04', overflow: 'hidden', zIndex: 2, paddingTop: '52px' }}
    >
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        style={{ position: 'relative', zIndex: 10, background: 'rgba(0,10,4,0.85)', border: '1px solid rgba(0,255,136,0.25)', boxShadow: '0 0 40px rgba(0,255,136,0.08), inset 0 0 20px rgba(0,255,136,0.03)', padding: 'clamp(28px, 5vw, 48px) clamp(28px, 6vw, 56px)', width: 'min(440px, 90vw)', clipPath: 'polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)' }}
      >
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.4em', marginBottom: '6px', textAlign: 'center' }}>◈ STEP 02 ◈</div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem, 3.5vw, 1.7rem)', color: 'var(--green-bright)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', textShadow: '0 0 20px rgba(0,255,136,0.5)', marginBottom: '6px' }}>
          IDENTIFY
        </h2>

        <div style={{ width: '120px', height: '1px', margin: '0 auto 28px', background: 'linear-gradient(90deg, transparent, var(--green-bright), transparent)' }} />

        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--green-mid)', letterSpacing: '0.25em', marginBottom: '10px', textTransform: 'uppercase' }}>
          Twitter / X Username
        </div>

        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--green-mid)', pointerEvents: 'none' }}>@</span>
          <input
            type="text"
            placeholder="username"
            value={handle}
            onChange={(e) => { setHandle(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
            style={{ width: '100%', padding: '13px 16px 13px 32px', background: 'rgba(0,255,136,0.04)', border: `1px solid ${error ? '#ff4466' : 'rgba(0,255,136,0.3)'}`, color: 'var(--green-bright)', fontFamily: 'var(--font-body)', fontSize: '1rem', letterSpacing: '0.1em', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: error ? '0 0 12px rgba(255,68,102,0.15)' : 'none' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--green-bright)'; e.target.style.boxShadow = '0 0 12px rgba(0,255,136,0.2)' }}
            onBlur={(e) => { e.target.style.borderColor = error ? '#ff4466' : 'rgba(0,255,136,0.3)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        <div style={{ height: '20px', marginBottom: '20px', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#ff4466', letterSpacing: '0.1em' }}>{error}</div>

        <button className="btn-ritual" onClick={handleSubmit} disabled={submitting} style={{ width: '100%', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'wait' : 'pointer' }}>
          {submitting ? 'PROCESSING...' : 'CONTINUE →'}
        </button>
      </motion.div>
    </motion.div>
  )
}
