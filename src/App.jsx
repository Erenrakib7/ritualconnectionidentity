import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from '@wagmi/connectors'

import Screen1Landing      from './screens/Screen1Landing'
import Screen2Connect      from './screens/Screen2Connect'
import Screen3Username     from './screens/Screen3Username'
import Screen4IdCard       from './screens/Screen4IdCard'
import Screen5Mint         from './screens/Screen5Mint'
import Screen6WalletMint   from './screens/Screen6WalletMint'
import Screen7Share        from './screens/Screen7Share'
import FireParticles       from './components/FireParticles'
import GlobalHeader        from './components/GlobalHeader'

/*
  FLOW:
  1  Landing     → OPEN button
  2  Connect     → Twitter connect (image click / button)
  3  Username    → Type / confirm twitter handle
  4  ID Card     → Preview identity card
  5  Mint        → Mint preview (no wallet yet)
  6  WalletMint  → Connect wallet → Confirm & Mint on-chain
  7  Share       → Share on Twitter
*/

export default function App() {
  const [screen, setScreen]               = useState(1)
  const [twitterHandle, setTwitterHandle] = useState('')
  const [tokenId, setTokenId]             = useState(null)

  const { address, isConnected } = useAccount()
  const { connect }    = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnectWallet = () => {
    if (isConnected) disconnect()
    else connect({ connector: injected() })
  }

  const go = (n) => setScreen(n)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#020a04' }}>
      <div className="scanlines" />
      <FireParticles />

      {/* Header visible from screen 2 onwards */}
      {screen > 1 && (
        <GlobalHeader
          walletAddress={address}
          isConnected={isConnected}
          onConnectWallet={handleConnectWallet}
        />
      )}

      <AnimatePresence mode="wait">

        {screen === 1 && (
          <Screen1Landing key="s1"
            onNext={() => go(2)}
          />
        )}

        {screen === 2 && (
          <Screen2Connect key="s2"
            onNext={(handle) => { setTwitterHandle(handle); go(3) }}
          />
        )}

        {screen === 3 && (
          <Screen3Username key="s3"
            twitterHandle={twitterHandle}
            onNext={(handle) => { setTwitterHandle(handle); go(4) }}
          />
        )}

        {screen === 4 && (
          <Screen4IdCard key="s4"
            twitterHandle={twitterHandle}
            walletAddress={address}
            onNext={() => go(5)}
          />
        )}

        {screen === 5 && (
          <Screen5Mint key="s5"
            twitterHandle={twitterHandle}
            onNext={() => go(6)}
          />
        )}

        {screen === 6 && (
          <Screen6WalletMint key="s6"
            twitterHandle={twitterHandle}
            walletAddress={address}
            isConnected={isConnected}
            onConnectWallet={handleConnectWallet}
            onMinted={(id) => { setTokenId(id) }}
          />
        )}

        {screen === 7 && (
          <Screen7Share key="s7"
            twitterHandle={twitterHandle}
            tokenId={tokenId}
          />
        )}

      </AnimatePresence>
    </div>
  )
}
