import { motion } from 'framer-motion'

// Screen 5 — Mint preview (no wallet needed yet)
export default function Screen5Mint({ twitterHandle, onNext }) {
  return (
    <motion.div
      key="screen5"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6 }}
      style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020a04', overflow: 'hidden', zIndex: 2, paddingTop: '52px' }}
    >
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,136,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{ position: 'relative', zIndex: 10, background: 'rgba(0,10,4,0.9)', border: '1px solid rgba(0,255,136,0.25)', boxShadow: '0 0 40px rgba(0,255,136,0.08), inset 0 0 20px rgba(0,255,136,0.02)', padding: 'clamp(28px,5vw,52px) clamp(28px,6vw,60px)', width: 'min(440px, 90vw)', clipPath: 'polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)', textAlign: 'center' }}
      >
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.4em', marginBottom: '6px' }}>◈ STEP 05 ◈</div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem,3.5vw,2rem)', color: 'var(--green-bright)', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 24px rgba(0,255,136,0.6)', marginBottom: '8px' }}>
          MINT
        </h2>
        <div style={{ width: '100px', height: '1px', margin: '0 auto 28px', background: 'linear-gradient(90deg, transparent, var(--green-bright), transparent)' }} />

        {/* Identity summary */}
        <div style={{ marginBottom: '28px', padding: '16px', border: '1px solid rgba(0,255,136,0.12)', background: 'rgba(0,255,136,0.03)' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'var(--text-dim)', letterSpacing: '0.3em', marginBottom: '6px' }}>MINTING IDENTITY FOR</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1rem,3vw,1.3rem)', color: 'var(--green-bright)', textShadow: '0 0 12px rgba(0,255,136,0.5)', letterSpacing: '0.08em' }}>
            @{twitterHandle}
          </div>
          <div style={{ marginTop: '10px', fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'var(--text-dim)', letterSpacing: '0.2em', lineHeight: 1.8 }}>
            CHAIN: RITUAL · ID: 1979<br />
            TYPE: NON-TRANSFERABLE NFT
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'rgba(0,255,136,0.45)', letterSpacing: '0.12em', marginBottom: '28px', fontStyle: 'italic' }}>
          "Entering the Ritual ecosystem properly now."
        </div>

        <button className="btn-ritual" onClick={onNext} style={{ width: '100%', fontSize: '1rem' }}>
          PROCEED TO MINT →
        </button>
      </motion.div>
    </motion.div>
  )
}
