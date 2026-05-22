import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'

// Try multiple avatar sources with CORS proxy fallback
async function fetchAvatarAsDataUrl(twitterHandle) {
  const sources = [
    // unavatar x endpoint (correct, twitter endpoint is deprecated)
    `https://unavatar.io/x/${twitterHandle}`,
    // unavatar via allorigins CORS proxy
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://unavatar.io/x/${twitterHandle}`)}`,
    // ui-avatars fallback
    `https://ui-avatars.com/api/?name=${encodeURIComponent(twitterHandle)}&size=200&background=021008&color=00ff88&bold=true&format=png`,
  ]

  for (const src of sources) {
    try {
      const dataUrl = await loadImageAsDataUrl(src)
      if (dataUrl) return dataUrl
    } catch {
      // try next source
    }
  }
  return null
}

function loadImageAsDataUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const timeout = setTimeout(() => reject(new Error('timeout')), 8000)
    img.onload = () => {
      clearTimeout(timeout)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || 200
        canvas.height = img.naturalHeight || 200
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch {
        reject(new Error('canvas tainted'))
      }
    }
    img.onerror = () => { clearTimeout(timeout); reject(new Error('load error')) }
    img.src = src
  })
}

export default function Screen4IdCard({ twitterHandle, walletAddress, onNext }) {
  const [imgError, setImgError] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [avatarDataUrl, setAvatarDataUrl] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(true)
  const cardRef = useRef(null)

  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'NOT CONNECTED'
  const issued = new Date().toISOString().slice(0, 10)
  const idNum = walletAddress
    ? `RCI-${walletAddress.slice(2, 6).toUpperCase()}-${walletAddress.slice(-4).toUpperCase()}`
    : 'RCI-XXXX-XXXX'

  // Pre-load avatar using multiple sources + proxy fallback
  useEffect(() => {
    if (!twitterHandle) {
      setAvatarLoading(false)
      setImgError(true)
      return
    }
    setAvatarLoading(true)
    setImgError(false)
    setAvatarDataUrl(null)

    fetchAvatarAsDataUrl(twitterHandle).then(dataUrl => {
      if (dataUrl) {
        setAvatarDataUrl(dataUrl)
        setImgError(false)
      } else {
        setImgError(true)
      }
      setAvatarLoading(false)
    }).catch(() => {
      setImgError(true)
      setAvatarLoading(false)
    })
  }, [twitterHandle])

  // Tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    card.style.transform = `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg)`
    card.style.transition = 'transform 0.05s'
  }
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
    cardRef.current.style.transition = 'transform 0.5s ease'
  }

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      // Flatten tilt before capture
      cardRef.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
      cardRef.current.style.transition = 'none'
      await new Promise(r => setTimeout(r, 300))

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#020a04',
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        // Force images to use the already-converted data URLs
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll('img')
          images.forEach(img => {
            if (avatarDataUrl && img.alt === twitterHandle) {
              img.src = avatarDataUrl
            }
          })
        },
      })

      const link = document.createElement('a')
      link.download = `ritual-identity-${twitterHandle || 'card'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div
      key="screen4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
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
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,136,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.4em', marginBottom: '18px', zIndex: 10 }}
      >
        ◈ YOUR IDENTITY CARD ◈
      </motion.div>

      {/* ══════════════ ID CARD ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 10, perspective: '900px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            width: 'min(430px, 92vw)',
            aspectRatio: '85.6 / 54',
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #020e05 0%, #010a03 50%, #021008 100%)',
            border: '1px solid rgba(0,255,136,0.5)',
            boxShadow: `
              0 0 0 1px rgba(0,255,136,0.08),
              0 8px 40px rgba(0,0,0,0.8),
              0 0 60px rgba(0,255,136,0.1),
              inset 0 0 40px rgba(0,255,136,0.03)
            `,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ── Holographic shimmer overlay ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
            background: 'linear-gradient(115deg, transparent 30%, rgba(0,255,136,0.06) 50%, transparent 70%)',
            mixBlendMode: 'screen',
          }} />

          {/* ── Grid pattern ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />

          {/* ── Left coloured band ── */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', zIndex: 5,
            background: 'linear-gradient(180deg, #00ff88, #00cc55, #00ff88)',
            boxShadow: '2px 0 12px rgba(0,255,136,0.5)',
          }} />

          {/* ── Top-right punch hole ── */}
          <div style={{
            position: 'absolute', top: '14px', right: '18px', zIndex: 15,
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#020a04',
            border: '1px solid rgba(0,255,136,0.3)',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
          }} />

          {/* ── CARD BODY ── */}
          <div style={{ position: 'absolute', inset: '0 0 0 6px', zIndex: 10, padding: '10px 18px 0 14px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>

            {/* Row 1 — header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '7px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.55rem, 1.8vw, 0.75rem)', letterSpacing: '0.35em', color: 'var(--green-bright)', textShadow: '0 0 8px rgba(0,255,136,0.6)', lineHeight: 1 }}>
                  RITUAL
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.38rem, 1vw, 0.5rem)', color: 'var(--text-dim)', letterSpacing: '0.2em', marginTop: '2px' }}>
                  CONNECTION IDENTITY
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.38rem, 1vw, 0.48rem)', color: 'var(--green-mid)', letterSpacing: '0.15em' }}>CHAIN 1979</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.34rem, 0.9vw, 0.44rem)', color: 'var(--text-dim)', letterSpacing: '0.1em', marginTop: '2px' }}>NON-TRANSFERABLE</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(0,255,136,0.4), rgba(0,255,136,0.1))', marginBottom: '7px' }} />

            {/* Row 2 — photo + info */}
            <div style={{ display: 'flex', gap: '12px', flex: 1, minHeight: 0 }}>

              {/* Photo box */}
              <div style={{
                width: 'clamp(52px, 14vw, 72px)',
                flexShrink: 0,
                border: '2px solid rgba(0,255,136,0.55)',
                borderRadius: '4px',
                overflow: 'hidden',
                background: 'rgba(0,255,136,0.04)',
                boxShadow: '0 0 10px rgba(0,255,136,0.2)',
                aspectRatio: '1',
                alignSelf: 'flex-start',
                position: 'relative',
              }}>
                {avatarLoading ? (
                  /* Loading spinner */
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(0,255,136,0.2)', borderTop: '2px solid #00ff88', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : avatarDataUrl ? (
                  <img
                    src={avatarDataUrl}
                    alt={twitterHandle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  /* Fallback: stylized letter avatar */
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,200,80,0.08))',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: 'var(--green-bright)',
                    textShadow: '0 0 12px rgba(0,255,136,0.8)',
                  }}>
                    {twitterHandle?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
              </div>

              {/* Info fields */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Field label="HANDLE" value={`@${twitterHandle}`} large />
                <Field label="WALLET" value={shortAddr} />
                <Field label="ISSUED" value={issued} />
                <Field label="ID NO." value={idNum} />
              </div>
            </div>

            {/* Tagline */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.38rem, 1vw, 0.52rem)',
              color: 'rgba(0,255,136,0.55)',
              letterSpacing: '0.1em',
              fontStyle: 'italic',
              textAlign: 'center',
              margin: '6px 0 4px',
              paddingTop: '5px',
              borderTop: '1px solid rgba(0,255,136,0.12)',
            }}>
              "Entering the Ritual ecosystem properly now."
            </div>

            {/* Magnetic stripe + barcode */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ height: '10px', background: 'linear-gradient(90deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.18) 40%, rgba(0,255,136,0.08) 100%)', marginBottom: '4px', borderRadius: '1px' }} />
              <div style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-end', height: '16px' }}>
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${40 + Math.sin(i * 2.3 + 1) * 35 + Math.sin(i * 0.7) * 25}%`,
                    minHeight: '2px',
                    background: `rgba(0,255,136,${i % 5 === 0 ? 0.6 : i % 3 === 0 ? 0.35 : 0.18})`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* ══════════════════════════════════════ */}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{ marginTop: '22px', zIndex: 10, display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <button
          onClick={handleDownload}
          disabled={downloading || avatarLoading}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            padding: '13px 28px',
            background: 'transparent',
            border: '1px solid rgba(0,255,136,0.45)',
            color: (downloading || avatarLoading) ? 'rgba(0,255,136,0.4)' : 'var(--green-bright)',
            letterSpacing: '0.25em',
            cursor: (downloading || avatarLoading) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            borderRadius: '2px',
            boxShadow: (downloading || avatarLoading) ? 'none' : '0 0 12px rgba(0,255,136,0.08)',
          }}
          onMouseEnter={e => { if (!downloading && !avatarLoading) e.currentTarget.style.background = 'rgba(0,255,136,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {downloading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '0.85rem' }}>◌</span>
              DOWNLOADING...
            </>
          ) : avatarLoading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '0.85rem' }}>◌</span>
              LOADING AVATAR...
            </>
          ) : (
            <>↓ DOWNLOAD CARD</>
          )}
        </button>

        <button className="btn-ritual" onClick={onNext} style={{ fontSize: '0.95rem', padding: '13px 52px' }}>
          MINT IDENTITY →
        </button>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  )
}

function Field({ label, value, large }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.3rem, 0.85vw, 0.42rem)', color: 'var(--text-dim)', letterSpacing: '0.3em' }}>{label}</div>
      <div style={{
        fontFamily: large ? 'var(--font-display)' : 'var(--font-body)',
        fontWeight: large ? 700 : 400,
        fontSize: large ? 'clamp(0.65rem, 2.2vw, 0.95rem)' : 'clamp(0.48rem, 1.4vw, 0.65rem)',
        color: large ? 'var(--green-bright)' : 'var(--green-mid)',
        letterSpacing: large ? '0.05em' : '0.08em',
        textShadow: large ? '0 0 8px rgba(0,255,136,0.4)' : 'none',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value}</div>
    </div>
  )
}
