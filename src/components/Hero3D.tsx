import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { people, type Person } from '../data'
import { isStill } from '../a11y'

type Hair = 'short' | 'long' | 'bald'
type Face = 'confirmed' | 'checking' | 'warning'


const reduceMotion = isStill

/** Phones, small screens, low core/memory counts and data-saver all get the lighter scene. */
const lowPower = () => {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return (
    window.innerWidth < 760 ||
    window.matchMedia('(pointer: coarse)').matches ||
    (n.hardwareConcurrency ?? 8) <= 4 ||
    (n.deviceMemory ?? 8) <= 4 ||
    !!n.connection?.saveData
  )
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/* ───────── Canvas textures for the call tiles ───────── */

const TW = 640
const TH = 400

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawPerson(ctx: CanvasRenderingContext2D, p: Person, hair: Hair) {
  const k = TW / 320
  ctx.save()
  ctx.scale(k, k)
  ctx.fillStyle = p.backdrop
  ctx.fillRect(0, 0, 320, 200)
  ctx.globalAlpha = 0.55
  ctx.fillStyle = '#fff'
  roundRect(ctx, 208, 26, 84, 96, 4)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.fillStyle = p.backdrop
  ctx.fillRect(248, 26, 4, 96)
  ctx.fillRect(208, 72, 84, 4)
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  roundRect(ctx, 22, 58, 70, 6, 3)
  ctx.fill()
  // shoulders
  ctx.fillStyle = p.shirt
  ctx.beginPath()
  ctx.moveTo(86, 200)
  ctx.bezierCurveTo(90, 160, 120, 138, 160, 138)
  ctx.bezierCurveTo(200, 138, 230, 160, 234, 200)
  ctx.closePath()
  ctx.fill()
  // neck + head
  ctx.fillStyle = p.skin
  ctx.fillRect(146, 118, 28, 26)
  ctx.beginPath()
  ctx.ellipse(160, 92, 34, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1e1410'
  if (hair === 'short') {
    ctx.beginPath()
    ctx.moveTo(126, 86)
    ctx.bezierCurveTo(126, 58, 142, 46, 160, 46)
    ctx.bezierCurveTo(178, 46, 194, 58, 194, 86)
    ctx.bezierCurveTo(188, 72, 176, 66, 160, 66)
    ctx.bezierCurveTo(144, 66, 132, 72, 126, 86)
    ctx.fill()
  } else if (hair === 'long') {
    ctx.beginPath()
    ctx.moveTo(122, 96)
    ctx.bezierCurveTo(118, 62, 136, 42, 160, 42)
    ctx.bezierCurveTo(184, 42, 202, 62, 198, 96)
    ctx.bezierCurveTo(196, 114, 202, 126, 208, 134)
    ctx.bezierCurveTo(194, 138, 184, 130, 180, 120)
    ctx.bezierCurveTo(182, 104, 178, 86, 160, 80)
    ctx.bezierCurveTo(142, 86, 138, 104, 140, 120)
    ctx.bezierCurveTo(136, 130, 126, 138, 112, 134)
    ctx.bezierCurveTo(118, 126, 124, 114, 122, 96)
    ctx.fill()
  } else {
    ctx.globalAlpha = 0.18
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.moveTo(128, 80)
    ctx.bezierCurveTo(132, 60, 144, 50, 160, 50)
    ctx.bezierCurveTo(176, 50, 188, 60, 192, 80)
    ctx.bezierCurveTo(184, 72, 174, 68, 160, 68)
    ctx.bezierCurveTo(146, 68, 136, 72, 128, 80)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  ctx.fillStyle = '#1e1410'
  ctx.beginPath()
  ctx.ellipse(147, 94, 3.2, 3.6, 0, 0, Math.PI * 2)
  ctx.ellipse(173, 94, 3.2, 3.6, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(30,20,16,0.7)'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(150, 112)
  ctx.quadraticCurveTo(160, 117, 170, 112)
  ctx.stroke()
  ctx.restore()
}

function pill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bg: string, fg: string, dashed = false) {
  ctx.font = '800 34px "Inter Tight Variable", "Inter Tight", sans-serif'
  const w = ctx.measureText(text).width + 78
  roundRect(ctx, x, y, w, 60, 30)
  ctx.fillStyle = bg
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = fg
  if (dashed) ctx.setLineDash([8, 6])
  ctx.stroke()
  ctx.setLineDash([])
  // little shield
  ctx.save()
  ctx.translate(x + 18, y + 11)
  ctx.scale(1.6, 1.6)
  ctx.strokeStyle = fg
  ctx.lineWidth = 2.6
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(12, 2.8)
  ctx.lineTo(19.5, 5.6)
  ctx.lineTo(19.5, 11.2)
  ctx.bezierCurveTo(19.5, 15.9, 16.3, 19.4, 12, 20.7)
  ctx.bezierCurveTo(7.7, 19.4, 4.5, 15.9, 4.5, 11.2)
  ctx.lineTo(4.5, 5.6)
  ctx.closePath()
  ctx.stroke()
  if (!dashed) {
    ctx.beginPath()
    ctx.moveTo(8.6, 12)
    ctx.lineTo(11, 14.4)
    ctx.lineTo(15.6, 9.5)
    ctx.stroke()
  }
  ctx.restore()
  ctx.fillStyle = fg
  ctx.fillText(text, x + 62, y + 42)
}

function tileTexture(p: Person, hair: Hair, face: Face, light = false): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = TW
  c.height = TH
  const ctx = c.getContext('2d')!
  roundRect(ctx, 0, 0, TW, TH, 34)
  ctx.clip()

  if (face === 'warning') {
    ctx.fillStyle = '#ff6a13'
    ctx.fillRect(0, 0, TW, TH)
    // diagonal hazard stripes, quiet
    ctx.globalAlpha = 0.12
    ctx.fillStyle = '#0b2412'
    for (let i = -TH; i < TW; i += 56) {
      ctx.beginPath()
      ctx.moveTo(i, TH)
      ctx.lineTo(i + 28, TH)
      ctx.lineTo(i + 28 + TH, 0)
      ctx.lineTo(i + TH, 0)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.fillStyle = '#0b2412'
    ctx.font = '64px "Bowlby One", "Arial Black", sans-serif'
    ctx.fillText("CAN'T", 40, 120)
    ctx.fillText('CONFIRM', 40, 196)
    ctx.fillText('DAVID', 40, 272)
    ctx.font = '600 28px "Inter Tight Variable", "Inter Tight", sans-serif'
    ctx.fillText("This isn't the phone David registered.", 42, 336)
    ctx.font = '22px "Nothing You Could Do", cursive'
    ctx.fillText('face + voice can be faked', 42, 374)
  } else {
    drawPerson(ctx, p, hair)
    if (face === 'confirmed') pill(ctx, 'IDENTITY CONFIRMED', 22, 22, '#c9ff3b', '#0a3a1b')
    else pill(ctx, 'CHECKING…', 22, 22, '#ecf7e4', '#34493b', true)
    ctx.font = '800 34px "Inter Tight Variable", "Inter Tight", sans-serif'
    const w = ctx.measureText(p.name).width + 40
    roundRect(ctx, 22, TH - 84, w, 62, 14)
    ctx.fillStyle = 'rgba(8,25,14,0.82)'
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.fillText(p.name, 42, TH - 41)
  }

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = light ? 2 : 8
  return t
}

/* ───────── The shield ───────── */

function shieldMesh(light: boolean) {
  const s = new THREE.Shape()
  // Same outline as the logo, in its 24-unit grid with y flipped.
  s.moveTo(12, -2.8)
  s.lineTo(19.5, -5.6)
  s.lineTo(19.5, -11.2)
  s.bezierCurveTo(19.5, -15.9, 16.3, -19.4, 12, -20.7)
  s.bezierCurveTo(7.7, -19.4, 4.5, -15.9, 4.5, -11.2)
  s.lineTo(4.5, -5.6)
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 2.2,
    bevelEnabled: true,
    bevelThickness: 0.9,
    bevelSize: 0.7,
    bevelSegments: light ? 4 : 8,
    curveSegments: light ? 18 : 32,
  })
  g.center()
  const m = new THREE.MeshPhysicalMaterial({
    color: '#0a3a1b',
    roughness: 0.32,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
  })
  const shield = new THREE.Mesh(g, m)
  shield.scale.setScalar(0.16)

  // The tick: two capsules, sitting proud of the front face.
  const tickMat = new THREE.MeshStandardMaterial({ color: '#c9ff3b', emissive: '#7fbf00', emissiveIntensity: 0.35, roughness: 0.4 })
  const tick = new THREE.Group()
  const stroke = (ax: number, ay: number, bx: number, by: number) => {
    const len = Math.hypot(bx - ax, by - ay)
    const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, len, light ? 4 : 8, light ? 10 : 16), tickMat)
    cap.position.set((ax + bx) / 2, (ay + by) / 2, 0)
    cap.rotation.z = Math.atan2(by - ay, bx - ax) - Math.PI / 2
    tick.add(cap)
  }
  stroke(-0.52, 0.02, -0.14, -0.36)
  stroke(-0.14, -0.36, 0.56, 0.42)
  tick.position.set(0, 0.05, 0.36)

  const group = new THREE.Group()
  group.add(shield, tick)
  return { group, shieldMat: m, tickMat }
}

/* ───────── Component ───────── */

type TileSpec = { id: keyof typeof people; hair: Hair; pos: [number, number, number]; rot: [number, number, number] }

const tiles: TileSpec[] = [
  { id: 'david', hair: 'bald', pos: [2.05, 1.55, 0.4], rot: [0.05, -0.32, 0.06] },
  { id: 'wanjiru', hair: 'long', pos: [-2.15, 1.25, -0.5], rot: [0.08, 0.34, -0.05] },
  { id: 'brian', hair: 'short', pos: [-1.85, -1.75, 0.2], rot: [-0.06, 0.28, 0.07] },
  { id: 'amara', hair: 'long', pos: [2.2, -1.5, -0.6], rot: [-0.05, -0.3, -0.06] },
]

export function Hero3D({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [flagged, setFlagged] = useState(false)
  const [webgl] = useState(hasWebGL)

  useEffect(() => {
    const host = wrap.current
    if (!host || !webgl) return
    let disposed = false
    let ready = false
    let announced = false
    const still = reduceMotion()
    const light = lowPower()

    const renderer = new THREE.WebGLRenderer({ antialias: !light, alpha: true, powerPreference: light ? 'low-power' : 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1.5 : 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 11)

    scene.add(new THREE.HemisphereLight('#f4ffd9', '#0a3a1b', 1.6))
    const key = new THREE.DirectionalLight('#ffffff', 2.4)
    key.position.set(4, 6, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight('#c9ff3b', 1.4)
    rim.position.set(-6, -2, -4)
    scene.add(rim)

    const root = new THREE.Group()
    scene.add(root)

    const { group: shield, tickMat } = shieldMesh(light)
    root.add(shield)

    // Scanning ring around the shield
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.025, light ? 6 : 12, light ? 90 : 160),
      new THREE.MeshBasicMaterial({ color: '#0a3a1b', transparent: true, opacity: 0.35 }),
    )
    ring.rotation.x = 1.2
    root.add(ring)
    const dots: THREE.Mesh[] = []
    for (let i = 0; i < 3; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.075, light ? 8 : 16, light ? 8 : 16), new THREE.MeshBasicMaterial({ color: '#ff6a13' }))
      ring.add(d)
      dots.push(d)
    }

    // Tiles
    const slabGeo = new RoundedBoxGeometry(2.24, 1.42, 0.09, 4, 0.14)
    const slabMat = new THREE.MeshStandardMaterial({ color: '#08190e', roughness: 0.6 })
    const planeGeo = new THREE.PlaneGeometry(2.14, 1.34)
    const made: { spec: TileSpec; group: THREE.Group; front: THREE.Mesh; baseY: number; phase: number }[] = []
    const textures: THREE.Texture[] = []

    const build = () => {
      for (const [i, spec] of tiles.entries()) {
        const p = people[spec.id]
        const g = new THREE.Group()
        g.position.set(...spec.pos)
        g.rotation.set(...spec.rot)
        const slab = new THREE.Mesh(slabGeo, slabMat)
        const frontTex = tileTexture(p, spec.hair, spec.id === 'david' ? 'checking' : 'confirmed', light)
        textures.push(frontTex)
        const front = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: frontTex, transparent: true }))
        front.position.z = 0.051
        g.add(slab, front)
        if (spec.id === 'david') {
          const backTex = tileTexture(p, spec.hair, 'warning', light)
          textures.push(backTex)
          const back = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: backTex, transparent: true }))
          back.position.z = -0.051
          back.rotation.y = Math.PI
          g.add(back)
        }
        root.add(g)
        made.push({ spec, group: g, front, baseY: spec.pos[1], phase: i * 1.7 })
      }
    }

    // Wait for fonts so the canvas text uses Bowlby One and Inter Tight.
    Promise.all([
      document.fonts.load('64px "Bowlby One"'),
      document.fonts.load('800 34px "Inter Tight Variable"'),
      document.fonts.load('22px "Nothing You Could Do"'),
    ])
      .catch(() => undefined)
      .then(() => {
        if (disposed) return
        build()
        if (still) {
          window.setTimeout(() => {
            if (!announced) {
              announced = true
              onReady?.()
            }
          }, 50)
          const d = made.find((m) => m.spec.id === 'david')
          if (d) d.group.rotation.y = d.spec.rot[1] + Math.PI
          setFlagged(true)
          renderer.render(scene, camera)
        }
        ready = true
      })

    // Size
    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // Pull the camera back on narrow screens so all four tiles fit.
      camera.position.z = w / h < 0.9 ? 13 : w / h < 1.2 ? 12.5 : 11
      camera.updateProjectionMatrix()
      if (still) {
        renderer.render(scene, camera)
        if (ready && !announced) {
          announced = true
          onReady?.()
        }
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    if (still) {
      return () => {
        disposed = true
        ro.disconnect()
        renderer.dispose()
        textures.forEach((t) => t.dispose())
        host.removeChild(renderer.domElement)
      }
    }

    // Pointer parallax
    const target = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    // Scroll: tilt and sink the scene as the hero scrolls away
    let scrollT = 0
    const onScroll = () => {
      const r = host.getBoundingClientRect()
      scrollT = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Flip loop for "David": checking → can't confirm → back
    const cycle = 7.5
    const clock = new THREE.Clock()
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(host)

    // Background tab: stop the clock too, so the scene doesn't jump when you come back.
    const onVis = () => (document.hidden ? clock.stop() : clock.start())
    document.addEventListener('visibilitychange', onVis)

    let raf = 0
    let lastFlag = false
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) + Math.sin(t * Math.PI) * 0.08 // a little overshoot

    let frame = 0
    let elapsed = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      // Lighter devices draw every other frame (about 30 fps).
      frame++
      if (light && frame % 2) return
      elapsed += Math.min(0.1, clock.getDelta())
      const t = elapsed

      root.rotation.y += (target.x * 0.28 - root.rotation.y) * 0.05
      root.rotation.x += (target.y * 0.16 + scrollT * 0.5 - root.rotation.x) * 0.05
      root.position.y = -scrollT * 1.2

      shield.rotation.y = Math.sin(t * 0.6) * 0.35
      shield.position.y = Math.sin(t * 1.1) * 0.08
      ring.rotation.z = t * 0.5
      dots.forEach((d, i) => {
        const a = t * 1.4 + (i * Math.PI * 2) / 3
        d.position.set(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0)
      })

      // Phase within the cycle: 0–2.4s checking, flip, hold until 6.4s, flip back
      const c = t % cycle
      let f = 0
      if (c > 2.4 && c < 3.2) f = ease((c - 2.4) / 0.8)
      else if (c >= 3.2 && c < 6.4) f = 1
      else if (c >= 6.4 && c < 7.2) f = 1 - ease((c - 6.4) / 0.8)
      const flag = c > 2.8 && c < 6.8
      if (flag !== lastFlag) {
        lastFlag = flag
        setFlagged(flag)
      }
      tickMat.color.set(flag ? '#ff6a13' : '#c9ff3b')
      tickMat.emissive.set(flag ? '#a33a00' : '#7fbf00')

      for (const m of made) {
        m.group.position.y = m.baseY + Math.sin(t * 0.9 + m.phase) * 0.12
        if (m.spec.id === 'david') m.group.rotation.y = m.spec.rot[1] + f * Math.PI
        else m.group.rotation.z = m.spec.rot[2] + Math.sin(t * 0.7 + m.phase) * 0.03
      }

      renderer.render(scene, camera)
      if (ready && !announced) {
        announced = true
        onReady?.()
      }
    }
    loop()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
      ro.disconnect()
      textures.forEach((t) => t.dispose())
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [webgl, onReady])

  return (
    <div className="hero3d-live" ref={wrap}>
      <p className="sr-only" aria-live="polite">
        {flagged
          ? 'Proofline confirms Wanjiru, Brian and Amara, but cannot confirm David. The call is not coming from his phone.'
          : 'Proofline is checking who is on the call.'}
      </p>
      <span className={`hand-note ${flagged ? 'is-on' : ''}`} aria-hidden="true">
        that's not David!
        <svg viewBox="0 0 80 50" width="80" height="50">
          <path d="M4 8c18 2 40 10 56 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 36l13 4-1-13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}
