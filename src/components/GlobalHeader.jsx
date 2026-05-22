import { motion } from 'framer-motion'

export default function GlobalHeader({ walletAddress, isConnected, onConnectWallet }) {
  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '52px', zIndex: 100,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid rgba(0,255,136,0.12)',
        background: 'rgba(2,10,4,0.85)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Left: Project Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: 'clamp(0.55rem, 1.5vw, 0.75rem)',
        color: 'var(--green-bright)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        textShadow: '0 0 12px rgba(0,255,136,0.5)',
      }}>
        Ritual Connection Identity
      </div>

      {/* Right: Wallet Button */}
      <button
        onClick={onConnectWallet}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: isConnected ? 'var(--green-bright)' : 'var(--green-mid)',
          background: isConnected ? 'rgba(0,255,136,0.08)' : 'transparent',
          border: `1px solid ${isConnected ? 'rgba(0,255,136,0.5)' : 'rgba(0,255,136,0.25)'}`,
          padding: '6px 14px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.8)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = isConnected ? 'rgba(0,255,136,0.5)' : 'rgba(0,255,136,0.25)'}
      >
        {isConnected ? `✓ ${shortAddr}` : 'CONNECT WALLET'}
      </button>
    </motion.div>
  )
}
