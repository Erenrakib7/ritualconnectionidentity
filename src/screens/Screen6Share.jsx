import { motion } from 'framer-motion'

export default function Screen6Share({ twitterHandle, tokenId }) {
  const tweetText = encodeURIComponent(
    `Just minted my Ritual Connection Identity\nEntering the Ritual ecosystem properly now.\n\n@ritualfoundation #RitualIdentity`
  )
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`

  return (
    <motion.div
      key="screen6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020a04', overflow: 'hidden', zIndex: 2, paddingTop: '52px' }}
    >
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,136,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{ fontSize: '3rem', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.6))', zIndex: 10 }}>✓</motion.div>

      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem,4vw,2rem)', color: 'var(--green-bright)', letterSpacing: '0.2em', textAlign: 'center', textShadow: '0 0 30px rgba(0,255,136,0.6)', marginBottom: '6px', zIndex: 10 }}>
        MINTED
      </motion.h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--green-mid)', letterSpacing: '0.2em', marginBottom: '32px', textAlign: 'center', zIndex: 10 }}>
        @{twitterHandle} · {tokenId !== null ? `#${tokenId}` : 'IDENTITY CONFIRMED'}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ background: 'rgba(0,10,4,0.9)', border: '1px solid rgba(0,255,136,0.2)', padding: '18px 24px', width: 'min(380px,90vw)', marginBottom: '24px', zIndex: 10 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.1em', fontStyle: 'italic', lineHeight: 1.8 }}>
          "Just minted my Ritual Connection Identity<br />
          Entering the Ritual ecosystem properly now."
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ zIndex: 10 }}>
        <a href={tweetUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <button className="btn-ritual" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 40px' }}>
            <span style={{ fontSize: '1.1rem' }}>𝕏</span>
            SHARE ON TWITTER
          </button>
        </a>
      </motion.div>
    </motion.div>
  )
}
