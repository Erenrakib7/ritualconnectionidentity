import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Screen5Share({ walletAddress, twitterHandle, tokenId }) {
  const [imgError, setImgError] = useState(false)

  const tweetText = encodeURIComponent(
    `I just minted my Ritual Connection Identity 🔗\n\n@${twitterHandle} is now on-chain on Ritual Network\n\n#RitualNetwork #RitualConnectionIdentity`
  )
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`

  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : ''

  const avatarUrl = `https://unavatar.io/twitter/${twitterHandle}`

  return (
    <motion.div
      key="screen5"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#020a04', overflow: 'hidden',
      }}
    >
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />

      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Celebration glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.08] }}
        transition={{ duration: 1.5, times: [0, 0.4, 1] }}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,255,136,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Success header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '24px', zIndex: 10 }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          color: 'var(--green-bright)', letterSpacing: '0.2em',
          textShadow: '0 0 30px rgba(0,255,136,0.7), 0 0 60px rgba(0,255,136,0.3)',
          marginBottom: '6px',
        }}>
          IDENTITY MINTED
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'var(--text-dim)', letterSpacing: '0.3em',
        }}>
          ◈ YOU ARE NOW ON-CHAIN ◈
        </div>
      </motion.div>

      {/* Final ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 10,
          width: 'min(380px, 90vw)',
          background: 'linear-gradient(135deg, rgba(0,30,12,0.98) 0%, rgba(0,15,6,0.99) 100%)',
          border: '1px solid rgba(0,255,136,0.5)',
          boxShadow: '0 0 80px rgba(0,255,136,0.15), 0 0 30px rgba(0,255,136,0.1), inset 0 0 40px rgba(0,255,136,0.05)',
          padding: '24px 24px 20px',
          clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)',
        }}
      >
        {/* Card header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,255,136,0.2)',
          paddingBottom: '10px', marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: '0.7rem', letterSpacing: '0.25em',
            color: 'var(--green-bright)',
          }}>
            RITUAL CONNECTION IDENTITY
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            color: 'var(--green-mid)',
          }}>
            ✓ MINTED
          </div>
        </div>

        {/* Avatar + info */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '72px', height: '72px', flexShrink: 0,
            border: '2px solid var(--green-bright)',
            boxShadow: '0 0 20px rgba(0,255,136,0.3)',
            overflow: 'hidden',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            background: 'rgba(0,255,136,0.05)',
          }}>
            {!imgError ? (
              <img
                src={avatarUrl}
                alt={twitterHandle}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                color: 'var(--green-bright)',
              }}>
                {twitterHandle[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              color: 'var(--green-bright)',
              textShadow: '0 0 12px rgba(0,255,136,0.5)',
              marginBottom: '6px',
            }}>
              @{twitterHandle}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--green-mid)',
            }}>
              {shortAddr}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              color: 'var(--text-dim)', marginTop: '4px', letterSpacing: '0.1em',
            }}>
              NETWORK: RITUAL · CHAIN: 1979
            </div>
          </div>
        </div>

        {/* Bottom barcode-like decoration */}
        <div style={{
          borderTop: '1px solid rgba(0,255,136,0.15)',
          paddingTop: '10px',
          display: 'flex', gap: '2px', alignItems: 'flex-end', height: '28px',
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${Math.random() * 100}%`,
              minHeight: '4px',
              background: `rgba(0,255,136,${0.1 + Math.random() * 0.4})`,
            }} />
          ))}
        </div>
      </motion.div>

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{ marginTop: '28px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
      >
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ritual"
          style={{
            textDecoration: 'none', display: 'inline-block',
            fontSize: '0.95rem', padding: '14px 40px',
          }}
        >
          𝕏 SHARE ON TWITTER
        </a>

        <a
          href={`https://explorer.ritualfoundation.org/address/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            color: 'var(--text-dim)', letterSpacing: '0.2em',
            textDecoration: 'none', borderBottom: '1px solid rgba(0,255,136,0.2)',
            paddingBottom: '2px',
          }}
        >
          VIEW ON EXPLORER ↗
        </a>
      </motion.div>
    </motion.div>
  )
}
