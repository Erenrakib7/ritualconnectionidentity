import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image1 from '../assets/image1.png'

export default function Screen1Landing({ onNext }) {
  const [clicking, setClicking] = useState(false)

  const handleOpen = () => {
    setClicking(true)
    setTimeout(() => onNext(), 1200)
  }

  return (
    <motion.div
      key="screen1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#020a04', overflow: 'hidden', zIndex: 2,
      }}
    >
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />

      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,136,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ position: 'absolute', top: '8%', textAlign: 'center', zIndex: 10 }}
      >
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--green-mid)', letterSpacing: '0.4em', marginBottom: '6px' }}>
          ◈ RITUAL NETWORK ◈
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 5, marginBottom: '0px' }}
      >
        <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse at 50% 80%, rgba(0,255,136,0.18) 0%, transparent 65%)', pointerEvents: 'none', zIndex: -1 }} />
        <img src={image1} alt="Ritual" style={{ width: 'min(340px, 80vw)', height: 'auto', display: 'block', filter: 'drop-shadow(0 0 24px rgba(0,255,136,0.35)) drop-shadow(0 0 8px rgba(0,255,136,0.2))' }} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 3.5vw, 2rem)', fontWeight: 900, color: 'var(--green-bright)', letterSpacing: '0.18em', textAlign: 'center', textTransform: 'uppercase', textShadow: '0 0 20px rgba(0,255,136,0.6), 0 0 60px rgba(0,255,136,0.2)', marginTop: '28px', marginBottom: '10px', zIndex: 10, lineHeight: 1.3, padding: '0 20px' }}
      >
        Ritual Connection Identity
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.95, duration: 0.7 }}
        style={{ width: '200px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--green-bright), transparent)', marginBottom: '32px', zIndex: 10 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ zIndex: 10 }}
      >
        <AnimatePresence>
          {!clicking ? (
            <motion.button className="btn-ritual" onClick={handleOpen} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ fontSize: '1rem', padding: '14px 52px' }}>
              OPEN
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ fontFamily: 'var(--font-display)', color: 'var(--green-bright)', letterSpacing: '0.3em', fontSize: '1rem', textShadow: '0 0 20px var(--green-bright)' }}>
              INITIALIZING...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.4, duration: 0.8 }}
        style={{ position: 'absolute', bottom: '6%', fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.3em' }}
      >
        CHAIN ID: 1979
      </motion.div>
    </motion.div>
  )
}
