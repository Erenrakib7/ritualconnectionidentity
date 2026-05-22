import { motion } from 'framer-motion'

export default function Screen7Share({ twitterHandle, tokenId }) {
  const tweetText = encodeURIComponent(
    `Just minted my Ritual Connection Identity

Entering the Ritual ecosystem properly now.

🔗 https://ritualconnectionidentity.vercel.app/

created by @saamzzzbro`
  )

  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`

  return (
    <motion.div
      key="screen7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020a04',
        overflow: 'hidden',
        zIndex: 2,
        paddingTop: '52px'
      }}
    >
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,136,0.09) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Big check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{
          fontSize: '3.5rem',
          marginBottom: '10px',
          filter: 'drop-shadow(0 0 24px rgba(0,255,136,0.7))',
          zIndex: 10
        }}
      >
        ✓
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(1.3rem,4vw,2.2rem)',
          color: 'var(--green-bright)',
          letterSpacing: '0.25em',
          textAlign: 'center',
          textShadow: '0 0 30px rgba(0,255,136,0.7)',
          marginBottom: '6px',
          zIndex: 10
        }}
      >
        MINTED
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          color: 'var(--green-mid)',
          letterSpacing: '0.2em',
          marginBottom: '28px',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        @{twitterHandle}
        {tokenId !== null && tokenId !== undefined
          ? ` · #${tokenId}`
          : ''}
      </motion.div>

      {/* Tweet preview box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          background: 'rgba(0,10,4,0.9)',
          border: '1px solid rgba(0,255,136,0.2)',
          padding: '18px 24px',
          width: 'min(400px, 90vw)',
          marginBottom: '28px',
          zIndex: 10
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              color: 'var(--green-bright)'
            }}
          >
            𝕏
          </span>

          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.58rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.2em'
            }}
          >
            TWEET PREVIEW
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            color: 'rgba(0,255,136,0.6)',
            letterSpacing: '0.06em',
            lineHeight: 1.9,
            fontStyle: 'italic'
          }}
        >
          Just minted my Ritual Connection Identity
          <br />
          Entering the Ritual ecosystem properly now.
          <br />
          <br />
          🔗 ritualconnectionidentity.vercel.app
          <br />
          <br />
          created by @saamzzzbro
        </div>
      </motion.div>

      {/* Share button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{ zIndex: 10 }}
      >
        <a
          href={tweetUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <button
            className="btn-ritual"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 44px',
              fontSize: '1rem'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>𝕏</span>
            SHARE ON TWITTER
          </button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '6%',
          fontFamily: 'var(--font-body)',
          fontSize: '0.62rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.3em',
          textAlign: 'center'
        }}
      >
        RITUAL CONNECTION IDENTITY · CHAIN 1979
      </motion.div>
    </motion.div>
  )
}
