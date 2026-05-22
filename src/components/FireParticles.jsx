import { useEffect, useRef } from 'react'

export default function FireParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Flame particle class ──────────────────────────────────────────
    class FlameParticle {
      constructor() { this.init(true) }

      init(randomY = false) {
        // Spread across full width, cluster slightly heavier at bottom-center
        const spread = canvas.width * 0.9
        const cx = canvas.width / 2
        this.x = cx + (Math.random() - 0.5) * spread
        this.baseX = this.x
        this.y = randomY
          ? canvas.height - Math.random() * canvas.height * 0.25
          : canvas.height + Math.random() * 20

        // Size: bigger = more visible flame body
        this.size = Math.random() * 18 + 6

        // Speed upward
        this.vy = Math.random() * 1.8 + 0.9

        // Slight horizontal drift
        this.vx = (Math.random() - 0.5) * 0.6

        // Life goes 0→1→0 (born, peak, fade)
        this.life = 0
        this.maxLife = Math.random() * 120 + 80
        this.age = 0

        // Wobble phase
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = Math.random() * 0.06 + 0.02

        // Ember or full flame
        this.isEmber = Math.random() < 0.25
      }

      update() {
        this.age++
        this.life = this.age / this.maxLife

        this.y -= this.vy
        this.vy *= 0.998          // slight deceleration
        this.wobble += this.wobbleSpeed
        this.x = this.baseX + Math.sin(this.wobble) * 6 + this.vx * this.age * 0.3

        // Shrink as it rises
        if (this.life > 0.5) this.size *= 0.993

        if (this.age >= this.maxLife || this.y < -30) this.init()
      }

      draw() {
        // Opacity: ramp up then ramp down
        const alpha = this.life < 0.15
          ? this.life / 0.15
          : this.life > 0.7
          ? 1 - (this.life - 0.7) / 0.3
          : 1

        if (this.isEmber) {
          // Small bright dot
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 0.25, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,255,210,${alpha * 0.9})`
          ctx.shadowBlur = 8
          ctx.shadowColor = '#00ff88'
          ctx.fill()
          ctx.shadowBlur = 0
          return
        }

        // Tall teardrop flame shape
        const h = this.size * 2.8
        const w = this.size * 0.9
        ctx.save()
        ctx.translate(this.x, this.y)

        // Outer glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, -h * 0.3, this.size * 2.2)
        glow.addColorStop(0,   `rgba(200,255,220,${alpha * 0.55})`)
        glow.addColorStop(0.3, `rgba(0,255,136,${alpha * 0.35})`)
        glow.addColorStop(0.7, `rgba(0,180,80,${alpha * 0.12})`)
        glow.addColorStop(1,   'rgba(0,60,20,0)')
        ctx.beginPath()
        ctx.ellipse(0, -h * 0.25, this.size * 2.2, h * 0.75, 0, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Core flame body — teardrop path
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo( w,  -h * 0.25,  w * 0.6,  -h * 0.65,  0, -h)
        ctx.bezierCurveTo(-w * 0.6, -h * 0.65, -w, -h * 0.25,  0,  0)
        ctx.closePath()

        const core = ctx.createLinearGradient(0, 0, 0, -h)
        core.addColorStop(0,   `rgba(0,255,100,${alpha * 0.7})`)
        core.addColorStop(0.35,`rgba(0,255,136,${alpha * 0.85})`)
        core.addColorStop(0.7, `rgba(100,255,180,${alpha * 0.6})`)
        core.addColorStop(1,   `rgba(230,255,240,${alpha * 0.3})`)
        ctx.fillStyle = core
        ctx.fill()

        // Inner bright streak
        ctx.beginPath()
        ctx.moveTo(0, -h * 0.05)
        ctx.bezierCurveTo( w * 0.3, -h * 0.3,  w * 0.2, -h * 0.65,  0, -h * 0.9)
        ctx.bezierCurveTo(-w * 0.2, -h * 0.65, -w * 0.3, -h * 0.3,  0, -h * 0.05)
        ctx.closePath()
        const inner = ctx.createLinearGradient(0, -h * 0.05, 0, -h * 0.9)
        inner.addColorStop(0, `rgba(180,255,210,${alpha * 0.5})`)
        inner.addColorStop(1, `rgba(255,255,255,${alpha * 0.15})`)
        ctx.fillStyle = inner
        ctx.fill()

        ctx.restore()
      }
    }

    // Spawn 200 particles staggered across the screen height at start
    const particles = Array.from({ length: 200 }, () => new FlameParticle())

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) { p.update(); p.draw() }
      animId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}
