import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract'

export default function Screen6WalletMint({ twitterHandle, walletAddress, isConnected, onConnectWallet, onMinted }) {
  const [phase, setPhase] = useState(isConnected ? 'checking' : 'connect')
  const [errorMsg, setErrorMsg] = useState('')
  const [imgError, setImgError] = useState(false)

  const avatarUrl = `https://unavatar.io/twitter/${twitterHandle}`
  const shortAddr = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null
  const issued = new Date().toISOString().slice(0, 10)
  const idNum = walletAddress
    ? `RCI-${walletAddress.slice(2, 6).toUpperCase()}-${walletAddress.slice(-4).toUpperCase()}`
    : 'RCI-XXXX-XXXX'

  const { data: alreadyMinted, isLoading: checkingMint } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasMinted',
    args: [walletAddress],
    enabled: !!walletAddress && isConnected,
  })

  const { writeContract, data: txHash, isError: writeError, error: writeErr, reset } = useWriteContract()
  const { isSuccess: isTxSuccess, data: receipt } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (isConnected && phase === 'connect') setPhase('checking')
  }, [isConnected])

  useEffect(() => {
    if (!checkingMint && phase === 'checking') {
      if (alreadyMinted) {
        setPhase('already_minted')
      } else {
        setPhase('ready')
      }
    }
  }, [checkingMint, alreadyMinted, phase])

  useEffect(() => {
    if (isTxSuccess) {
      setPhase('success')
      const tokenId = receipt?.logs?.[0]?.topics?.[2]
        ? parseInt(receipt.logs[0].topics[2], 16)
        : null
      onMinted && onMinted(tokenId)
    }
  }, [isTxSuccess])

  useEffect(() => {
    if (writeError) {
      setPhase('error')
      setErrorMsg(writeErr?.shortMessage || writeErr?.message?.slice(0, 100) || 'Transaction failed')
    }
  }, [writeError])

  const handleMint = () => {
    setPhase('minting')
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [twitterHandle],
    })
  }

  const tweetText = encodeURIComponent(
    `Just minted my Ritual Connection Identity\nEntering the Ritual ecosystem properly now.\n\n@ritualfoundation #RitualIdentity`
  )
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`

  const IdCard = () => (
    <div style={{
      width: 'min(380px, 88vw)',
      aspectRatio: '85.6 / 54',
      position: 'relative',
      borderRadius: '10px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #020e05 0%, #010a03 50%, #021008 100%)',
      border: '1px solid rgba(0,255,136,0.5)',
      boxShadow: '0 0 40px rgba(0,255,136,0.15), 0 8px 32px rgba(0,0,0,0.8)',
      marginBottom: '20px',
      flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', zIndex: 5, background: 'linear-gradient(180deg, #00ff88, #00cc55, #00ff88)', boxShadow: '2px 0 12px rgba(0,255,136,0.5)' }} />
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 15, width: '12px', height: '12px', borderRadius: '50%', background: '#020a04', border: '1px solid rgba(0,255,136,0.3)' }} />
      <div style={{ position: 'absolute', inset: '0 0 0 6px', zIndex: 10, padding: '8px 16px 0 12px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.5rem, 1.6vw, 0.7rem)', letterSpacing: '0.35em', color: 'var(--green-bright)', textShadow: '0 0 8px rgba(0,255,136,0.6)', lineHeight: 1 }}>RITUAL</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.34rem, 0.9vw, 0.46rem)', color: 'var(--text-dim)', letterSpacing: '0.2em', marginTop: '2px' }}>CONNECTION IDENTITY</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.34rem, 0.9vw, 0.44rem)', color: 'var(--green-mid)', letterSpacing: '0.15em' }}>CHAIN 1979</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.3rem, 0.8vw, 0.4rem)', color: 'var(--text-dim)', letterSpacing: '0.1em', marginTop: '2px' }}>NON-TRANSFERABLE</div>
          </div>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(0,255,136,0.4), rgba(0,255,136,0.1))', marginBottom: '5px' }} />
        <div style={{ display: 'flex', gap: '10px', flex: 1, minHeight: 0 }}>
          <div style={{ width: 'clamp(44px, 12vw, 62px)', flexShrink: 0, border: '2px solid rgba(0,255,136,0.55)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,255,136,0.04)', aspectRatio: '1', alignSelf: 'flex-start' }}>
            {!imgError ? (
              <img src={avatarUrl} alt={twitterHandle} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--green-bright)' }}>
                {twitterHandle?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <CardField label="HANDLE" value={`@${twitterHandle}`} large />
            <CardField label="WALLET" value={shortAddr || 'NOT CONNECTED'} />
            <CardField label="ISSUED" value={issued} />
            <CardField label="ID NO." value={idNum} />
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.34rem, 0.9vw, 0.48rem)', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.08em', fontStyle: 'italic', textAlign: 'center', margin: '4px 0 3px', paddingTop: '4px', borderTop: '1px solid rgba(0,255,136,0.12)' }}>
          "Entering the Ritual ecosystem properly now."
        </div>
        <div style={{ marginBottom: '4px' }}>
          <div style={{ height: '8px', background: 'linear-gradient(90deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.18) 40%, rgba(0,255,136,0.08) 100%)', marginBottom: '3px', borderRadius: '1px' }} />
          <div style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-end', height: '13px' }}>
            {Array.from({ length: 55 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: `${40 + Math.sin(i * 2.3 + 1) * 35 + Math.sin(i * 0.7) * 25}%`, minHeight: '2px', background: `rgba(0,255,136,${i % 5 === 0 ? 0.6 : i % 3 === 0 ? 0.35 : 0.18})` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      key="screen6wm"
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

      {(phase === 'already_minted' || phase === 'success') ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'min(440px, 92vw)', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)', paddingBottom: '16px' }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.4em', marginBottom: '8px' }}>◈ STEP 06 ◈</div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem,3.5vw,1.8rem)', color: 'var(--green-bright)', letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: '0 0 24px rgba(0,255,136,0.6)', marginBottom: '6px', textAlign: 'center' }}>
            {phase === 'success' ? '✓ MINTED' : 'ALREADY MINTED'}
          </h2>
          <div style={{ width: '120px', height: '1px', margin: '0 auto 16px', background: 'linear-gradient(90deg, transparent, var(--green-bright), transparent)' }} />

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}>
            <IdCard />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--green-mid)', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '20px', lineHeight: 1.7 }}>
            {phase === 'already_minted'
              ? <>IDENTITY CONFIRMED · <span style={{ color: 'var(--green-bright)' }}>@{twitterHandle}</span><br /><span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>This wallet has already minted.</span></>
              : <>IDENTITY CONFIRMED · <span style={{ color: 'var(--green-bright)' }}>@{twitterHandle}</span></>
            }
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ width: '100%' }}>
            <a href={tweetUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
              <button className="btn-ritual" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}>
                <span style={{ fontSize: '1rem' }}>𝕏</span>
                SHARE ON TWITTER
              </button>
            </a>
          </motion.div>
        </motion.div>

      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ position: 'relative', zIndex: 10, background: 'rgba(0,10,4,0.9)', border: '1px solid rgba(0,255,136,0.25)', boxShadow: '0 0 40px rgba(0,255,136,0.08)', padding: 'clamp(24px,5vw,48px) clamp(24px,6vw,56px)', width: 'min(440px, 90vw)', clipPath: 'polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)', textAlign: 'center' }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.4em', marginBottom: '6px' }}>◈ STEP 06 ◈</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem,3.5vw,1.8rem)', color: 'var(--green-bright)', letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: '0 0 24px rgba(0,255,136,0.6)', marginBottom: '8px' }}>
            CONFIRM MINT
          </h2>
          <div style={{ width: '120px', height: '1px', margin: '0 auto 24px', background: 'linear-gradient(90deg, transparent, var(--green-bright), transparent)' }} />

          <AnimatePresence mode="wait">

            {phase === 'connect' && (
              <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--green-mid)', letterSpacing: '0.15em', marginBottom: '24px', lineHeight: 1.8 }}>
                  Connect your wallet to mint<br />
                  <span style={{ color: 'var(--green-bright)' }}>@{twitterHandle}</span> on-chain.
                </div>
                <button className="btn-ritual" onClick={onConnectWallet} style={{ width: '100%' }}>
                  CONNECT WALLET
                </button>
              </motion.div>
            )}

            {phase === 'checking' && (
              <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: '16px' }}><MintingSpinner /></div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--green-bright)', letterSpacing: '0.3em' }}>
                  CHECKING WALLET...
                </div>
              </motion.div>
            )}

            {phase === 'ready' && (
              <motion.div key="ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.06)', marginBottom: '20px' }}>
                  <span style={{ color: 'var(--green-bright)', fontSize: '0.7rem' }}>✓</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--green-mid)', letterSpacing: '0.1em' }}>{shortAddr}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.15em', marginBottom: '24px', lineHeight: 1.9 }}>
                  IDENTITY: <span style={{ color: 'var(--green-bright)' }}>@{twitterHandle}</span><br />
                  CHAIN: <span style={{ color: 'var(--green-mid)' }}>RITUAL · 1979</span><br />
                  GAS: <span style={{ color: 'var(--green-mid)' }}>ESTIMATED ON SIGN</span>
                </div>
                <button className="btn-ritual" onClick={handleMint} style={{ width: '100%' }}>
                  MINT IDENTITY
                </button>
              </motion.div>
            )}

            {phase === 'minting' && (
              <motion.div key="minting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: '20px' }}><MintingSpinner /></div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--green-bright)', letterSpacing: '0.3em' }}>
                  MINTING...
                </div>
                {txHash && (
                  <div style={{ marginTop: '12px', fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'var(--text-dim)', wordBreak: 'break-all', letterSpacing: '0.06em' }}>
                    TX: {txHash.slice(0, 24)}...
                  </div>
                )}
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: '#ff4466', letterSpacing: '0.1em', marginBottom: '20px', lineHeight: 1.7 }}>
                  {errorMsg}
                </div>
                <button className="btn-ritual" onClick={() => { reset(); setPhase('ready') }} style={{ width: '100%' }}>
                  TRY AGAIN
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}

function CardField({ label, value, large }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.28rem, 0.75vw, 0.38rem)', color: 'var(--text-dim)', letterSpacing: '0.3em' }}>{label}</div>
      <div style={{ fontFamily: large ? 'var(--font-display)' : 'var(--font-body)', fontWeight: large ? 700 : 400, fontSize: large ? 'clamp(0.58rem, 2vw, 0.85rem)' : 'clamp(0.44rem, 1.2vw, 0.6rem)', color: large ? 'var(--green-bright)' : 'var(--green-mid)', letterSpacing: large ? '0.05em' : '0.08em', textShadow: large ? '0 0 8px rgba(0,255,136,0.4)' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  )
}

function MintingSpinner() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(0,255,136,0.15)" strokeWidth="3" />
      <circle cx="24" cy="24" r="20" fill="none" stroke="#00ff88" strokeWidth="3"
        strokeDasharray="30 96" strokeLinecap="round"
        style={{ transformOrigin: '24px 24px', animation: 'spin 1s linear infinite' }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </svg>
  )
}
