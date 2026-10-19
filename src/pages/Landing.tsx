import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '../components/Badge'
import { CallStage } from '../components/CallStage'
import { PlayStoryButton } from '../components/Tour'
import { ArrowRight, HumanMark, ReceiptMark, ShieldMark } from '../components/icons'
import { Wordmark } from '../components/Wordmark'
import './landing.css'
import { isStill, useStill } from '../a11y'
import { LangToggle, useT } from '../i18n'
import { NotesToggle, Spot } from '../components/Notes'

gsap.registerPlugin(ScrollTrigger)


const reduce = isStill

const Hero3D = lazy(() => import('../components/Hero3D').then((m) => ({ default: m.Hero3D })))

const INTRO_KEY = 'proofline-intro-seen'
const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}
const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* storage blocked: the intro just plays again next time */
  }
}

/** A still of the 3D scene shows at once; the live scene loads after the page is up and fades in over it. */
function HeroStage() {
  const [load3d, setLoad3d] = useState(false)
  const [live, setLive] = useState(false)
  const onReady = useCallback(() => setLive(true), [])
  const still = useStill()

  useEffect(() => {
    const t = window.setTimeout(() => setLoad3d(true), 400)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className={`hero3d hero-stage ${live ? 'is-live' : ''}`}>
      <img
        className="hero-poster"
        src="./hero-poster.webp"
        width="996"
        height="1053"
        alt="A Proofline shield surrounded by four video-call tiles. Three say Identity confirmed. David's says Can't confirm."
        decoding="async"
        fetchPriority="high"
      />
      {load3d && (
        <Suspense fallback={null}>
          <Hero3D key={still ? 'still' : 'moving'} onReady={onReady} />
        </Suspense>
      )}
    </div>
  )
}

const callBeats = [
  { count: 'beats.c0', line: 'beats.l0' },
  { count: 'beats.c1', line: 'beats.l1' },
  { count: 'beats.c2', line: 'beats.l2' },
  { count: 'beats.c3', line: 'beats.l3' },
] as const

export function Landing() {
  const root = useRef<HTMLDivElement>(null)
  const { t } = useT()
  const [stage, setStage] = useState(0)
  const sealedRows = [
    { label: 'ID number', value: '2846 1937', tilt: -3 },
    { label: 'Date of birth', value: '14 March 1994', tilt: 2 },
    { label: 'Home address', value: 'Kilimani, Nairobi', tilt: -1.5 },
    { label: 'Selfie scan', value: 'Deleted after setup', tilt: 2.5 },
  ]
  const [peeledRows, setPeeledRows] = useState<Record<string, boolean>>({})
  const peeled = sealedRows.every((r) => peeledRows[r.label])
  const anyPeeled = sealedRows.some((r) => peeledRows[r.label])
  const setAll = (v: boolean) => setPeeledRows(Object.fromEntries(sealedRows.map((r) => [r.label, v])))
  const [loading, setLoading] = useState(() => !reduce() && !introSeen())
  const still = useStill()

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (still) {
      setStage(3)
      setLoading(false)
      return
    }

    const ctx = gsap.context(() => {
      // 1. Preloader (first visit only): the seal stamps down, then the sheet lifts away.
      const intro = gsap.timeline({
        onComplete: () => {
          setLoading(false)
          markIntroSeen()
        },
      })
      if (el.querySelector('.loader')) {
        intro
          .from('.loader-seal', { scale: 2.4, rotation: -18, opacity: 0, duration: 0.55, ease: 'back.out(2.2)' })
          .to('.loader-seal', { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' })
          .to('.loader', { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.15')
      }
      intro
        .from('.hero-line > span', { yPercent: 110, rotation: 4, duration: 0.9, stagger: 0.08, ease: 'power4.out' }, '-=0.35')
        .from('.hero-sub, .hero-actions, .hero-story', { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.6')
        .from('.hero3d', { scale: 0.85, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.9')

      // 2. The call, told by scrolling.
      ScrollTrigger.create({
        trigger: '.scroll-call',
        start: 'top top',
        // Phones get half the scroll distance, so it doesn't take a long thumb-scroll to finish the call.
        end: () => `+=${window.innerWidth < 640 ? 840 : window.innerWidth < 1000 ? 1300 : 1800}`,
        invalidateOnRefresh: true,
        pin: '.scroll-call-pin',
        onUpdate: (st) => setStage(Math.min(3, Math.floor(st.progress * 4.4))),
      })

      // 3. Giant words slide against each other.
      gsap.utils.toArray<HTMLElement>('.bigword-row').forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -18 : 6 },
          {
            xPercent: i % 2 ? 4 : -22,
            ease: 'none',
            scrollTrigger: { trigger: '.bigwords', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      })

      // 4. Sticker cards fly in and land at their tilt.
      gsap.from('.proof-card', {
        y: 160,
        rotation: (i) => [-14, 10, -8][i] ?? 0,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'back.out(1.4)',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.proofs-grid', start: 'top 80%' },
      })

      // 5. How-it-works: the tape line draws across the steps.
      gsap.from('.how-tape', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: '.how', start: 'top 70%', end: 'bottom 60%', scrub: true },
      })
      gsap.from('.how-step', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.how', start: 'top 70%' },
      })

      // 6. Floating CTA stickers bob gently.
      gsap.to('.cta-sticker', { y: -12, rotation: '+=6', duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 })

      // 7. The curved marquee drifts, faster while you scroll.
      const tp = el.querySelector<SVGTextPathElement>('.wave-text textPath')
      const txt = el.querySelector<SVGTextElement>('.wave-text text')
      const reps = 6
      let unit = 0
      let offset = 0
      let speed = 1
      const st = ScrollTrigger.create({
        trigger: '.wave',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (s) => (speed = 1 + Math.min(10, Math.abs(s.getVelocity()) / 300)),
      })
      const tick = () => {
        if (!tp || !txt) return
        if (!unit) unit = txt.getComputedTextLength() / reps
        if (!unit) return
        offset -= speed
        if (offset <= -unit) offset += unit
        speed += (1 - speed) * 0.05
        tp.setAttribute('startOffset', String(offset))
      }
      gsap.ticker.add(tick)
      return () => {
        gsap.ticker.remove(tick)
        st.kill()
      }
    }, el)

    return () => ctx.revert()
  }, [still])

  const wave = 'FACES CAN BE FAKED ✦ VOICES CAN BE CLONED ✦ PROOF CAN’T ✦ '
  const wave2 = 'VERIFY ONCE ✦ PROVE ANYWHERE ✦ KEEP YOUR ID ✦ '

  return (
    <div ref={root} className="landing">
      {loading && (
        <div className="loader" aria-hidden="true">
          <span className="loader-seal">
            <Wordmark />
          </span>
        </div>
      )}

      <header className="site-nav">
        <a href="#/" className="nav-home" aria-label="Proofline home">
          <Wordmark />
        </a>
        <nav aria-label="Main">
          <a href="#signals">{t('nav.proves')}</a>
          <a href="#privacy">{t('nav.privacy')}</a>
          <NotesToggle />
          <LangToggle />
          <a href="#/demo/1" className="btn btn-primary btn-small">
            {t('nav.demo')}
          </a>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ───────── Hero ───────── */}
        <section className="hero band-lime">
          <div className="hero-copy">
            <p className="hero-story">{t('hero.story')}</p>
            <h1 aria-label={t('hero.h1')}>
              <span className="hero-line" aria-hidden="true">
                <span>{t('hero.l1')}</span>
              </span>
              <span className="hero-line" aria-hidden="true">
                <span>{t('hero.l2')}</span>
              </span>
              <span className="hero-line" aria-hidden="true">
                <span>{t('hero.l3')}</span>
              </span>
            </h1>
            <p className="hero-sub">{t('hero.sub')}</p>
            <div className="hero-actions">
              <a href="#/demo/1" className="btn btn-primary btn-big">
                {t('hero.try')} <ArrowRight />
              </a>
              <PlayStoryButton className="btn btn-ghost btn-big" />
            </div>
          </div>
          <Spot n={1} title="One moment of motion, with a point" note="The only thing that moves on its own is the fake David's tile flipping to a warning. Everything else waits for you to scroll or tap, so the story is the motion.">
            <HeroStage />
          </Spot>
        </section>

        {/* ───────── Curved marquee ───────── */}
        <div className="wave" aria-hidden="true">
          <div className="wave-straight">
            <div className="wave-straight-track">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i}>{wave2}</span>
              ))}
            </div>
          </div>
          <svg className="wave-text" viewBox="0 0 1600 220" preserveAspectRatio="none">
            <path id="wave-path" d="M-20 150 C 300 40, 560 40, 820 120 S 1340 210, 1640 70" fill="none" />
            <path d="M-20 150 C 300 40, 560 40, 820 120 S 1340 210, 1640 70" className="wave-band" />
            <text>
              <textPath href="#wave-path">{wave.repeat(6)}</textPath>
            </text>
          </svg>
        </div>

        {/* ───────── The call, told by scrolling ───────── */}
        <section className="scroll-call" aria-labelledby="call-h">
          <div className="scroll-call-pin">
            <div className="scroll-call-copy">
              <h2 id="call-h">{t('beats.h2')}</h2>
              <p className="beat-count" aria-hidden="true">
                {t(callBeats[stage].count)}
              </p>
              <p className="beat-line" aria-live="polite">
                {t(callBeats[stage].line)}
              </p>
              <div className="beat-dots" aria-hidden="true">
                {callBeats.map((_, i) => (
                  <i key={i} className={i <= stage ? 'on' : ''} />
                ))}
              </div>
              <p className="beat-hint" aria-hidden="true">
                {t('beats.hint')}
              </p>
            </div>
            <div className="scroll-call-stage">
              <CallStage mode="scroll" stage={stage} />
            </div>
          </div>
        </section>

        {/* ───────── Giant words ───────── */}
        <section className="bigwords band-forest" aria-label="Copy a face, clone a voice, but not David's phone.">
          <div className="bigword-row" aria-hidden="true">
            Copy a face
            <span className="inline-sticker sticker-lime">
              <ShieldMark size={64} mark="question" />
            </span>
            Copy a face
          </div>
          <div className="bigword-row bigword-outline" aria-hidden="true">
            Clone a voice
            <span className="inline-sticker sticker-orange">
              <HumanMark size={64} />
            </span>
            Clone a voice
          </div>
          <div className="bigword-row bigword-lime" aria-hidden="true">
            Not his phone
            <span className="inline-sticker sticker-white">
              <ShieldMark size={64} mark="check" />
            </span>
            Not his phone
          </div>
        </section>

        {/* ───────── Three proofs ───────── */}
        <section className="proofs" id="signals" aria-labelledby="signals-h">
          <div className="proofs-head">
            <h2 id="signals-h">Three things Proofline can prove</h2>
            <p>
              Each badge has its own shape, so you can tell them apart at a glance, even without colour. Tap any badge to
              see exactly what it means.
            </p>
          </div>
          <Spot n={2} title="Two questions, kept apart" note="'Is this a real person?' and 'Is this the right person?' get different badges and different shapes. The $25M scammers were real humans, so a 'not a bot' badge alone would have stayed green.">
          <div className="proofs-grid">
            <article className="proof-card card-forest">
              <span className="proof-icon sticker-lime">
                <ShieldMark size={56} mark="check" />
              </span>
              <h3>This is the person you think it is</h3>
              <p>
                The named person, on the phone they registered. A scammer can copy David's face, but not David's phone.
              </p>
              <Badge kind="identity" explain />
              <p className="proof-where">Calls, payments, password resets</p>
            </article>
            <article className="proof-card card-lime">
              <span className="proof-icon sticker-white">
                <HumanMark size={56} />
              </span>
              <h3>A real person, not a bot</h3>
              <p>A unique human made this account. Their name stays private unless they choose to share it.</p>
              <Badge kind="human" explain />
              <p className="proof-where">Replies, dating matches, sign-ups</p>
            </article>
            <article className="proof-card card-orange">
              <span className="proof-icon sticker-white">
                <ReceiptMark size={56} />
              </span>
              <h3>They actually bought it</h3>
              <p>The reviewer paid for this item from this seller. Nothing else about their shopping is shared.</p>
              <Badge kind="purchase" explain />
              <p className="proof-where">Reviews, seller ratings</p>
            </article>
          </div>
          </Spot>
          <aside className="insight">
            <span className="insight-hand" aria-hidden="true">
              the important bit
            </span>
            <h3>Why "real person" isn't enough</h3>
            <p>
              The people behind the $25 million call were real humans. A badge that only said "not a bot" would have stayed
              green. Proofline keeps the two questions separate: is this a person, and is it the right person.
            </p>
          </aside>
        </section>

        {/* ───────── How it works ───────── */}
        <section className="how" aria-labelledby="how-h">
          <h2 id="how-h">How it works</h2>
          <div className="how-track">
            <span className="how-tape" aria-hidden="true" />
            <ol className="how-steps">
              <li className="how-step">
                <h3>Verify once, on your phone</h3>
                <p>Scan your ID and take a quick selfie. It takes about a minute and happens on the device.</p>
              </li>
              <li className="how-step">
                <h3>Your proof stays in your wallet</h3>
                <p>A sealed credential lives on your phone. There's no central database of IDs to steal.</p>
              </li>
              <li className="how-step">
                <h3>Apps ask, you approve</h3>
                <p>A bank, a call or a dating app asks. You see who's asking and what they'll learn.</p>
              </li>
              <li className="how-step">
                <h3>They get a yes or no</h3>
                <p>The app learns the answer, like "this is Amara" or "over 18", and nothing more.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ───────── Privacy: peel the tape ───────── */}
        <section className="privacy band-forest" id="privacy" aria-labelledby="privacy-h">
          <div className="privacy-inner">
            <div className="privacy-copy">
              <h2 id="privacy-h">Proof without handing over your ID</h2>
              <p>
                This is everything Huddle gets when it checks Amara on a call. The rest stays taped up on her phone, and only
                she can peel it back.
              </p>
              <button type="button" className="btn btn-lime btn-big" aria-pressed={peeled} onClick={() => setAll(!anyPeeled)}>
                {anyPeeled ? 'Seal it back up' : 'Peel back all the tape'}
              </button>
              <p className="privacy-hand" aria-hidden="true">
                {anyPeeled ? 'only Amara sees this view' : 'or grab a strip and pull it off →'}
              </p>
            </div>

            <Spot n={3} title="Privacy you can touch" note="Tape makes 'what the app never gets' physical. Sealed is the default, only the owner can peel it, and each strip is a real button for keyboard users.">
            <div className="huddle-card">
              <p className="huddle-head">
                <span className="app-dot" aria-hidden="true">
                  H
                </span>
                What Huddle learns about Amara
              </p>
              <ul className="huddle-rows">
                <li>
                  <span>Identity</span>
                  <strong>Confirmed: Amara Njoroge</strong>
                </li>
                <li>
                  <span>Employer</span>
                  <strong>Kilima Freight</strong>
                </li>
                <li>
                  <span>Device</span>
                  <strong>Her registered phone</strong>
                </li>
                {sealedRows.map((r) => (
                  <Sealed
                    key={r.label}
                    {...r}
                    peeled={!!peeledRows[r.label]}
                    onPeel={() => setPeeledRows((p) => ({ ...p, [r.label]: true }))}
                  />
                ))}
              </ul>
            </div>
            </Spot>
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="cta-end">
          <div className="cta-block">
            <span className="cta-sticker cta-s1 sticker-orange" aria-hidden="true">
              <ShieldMark size={44} mark="question" />
            </span>
            <span className="cta-sticker cta-s2 sticker-white" aria-hidden="true">
              <ShieldMark size={44} mark="check" />
            </span>
            <span className="cta-sticker cta-s3 sticker-lime" aria-hidden="true">
              <HumanMark size={44} />
            </span>
            <h2>Watch Proofline stop a $25 million call</h2>
            <p>Five short steps. Takes about two minutes.</p>
            <a href="#/demo/1" className="btn btn-lime btn-big">
              Start the demo <ArrowRight />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <Wordmark small />
        <p>
          A design prototype for Hyperbloom October 2026. All people and companies in this demo are fictional, and no real
          identity checks run.
        </p>
      </footer>
    </div>
  )
}

/** A private detail under a strip of tape. Drag the strip off, or press it with the keyboard. */
function Sealed({
  label,
  value,
  peeled,
  tilt,
  onPeel,
}: {
  label: string
  value: string
  peeled: boolean
  tilt: number
  onPeel: () => void
}) {
  const [drag, setDrag] = useState(0)
  const startX = useRef<number | null>(null)
  const tape = useRef<HTMLButtonElement>(null)

  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (peeled) return
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (startX.current === null) return
    setDrag(Math.max(0, e.clientX - startX.current))
  }
  const onUp = () => {
    if (startX.current === null) return
    const w = tape.current?.offsetWidth ?? 200
    const moved = drag
    startX.current = null
    setDrag(0)
    // A pull past a third of the strip peels it; a small wiggle counts as a press.
    if (moved > w * 0.33 || moved < 4) onPeel()
  }

  const dragging = drag > 0
  return (
    <li className={`sealed ${peeled ? 'is-peeled' : ''}`}>
      <span>{label}</span>
      <strong aria-hidden={!peeled}>{value}</strong>
      {!peeled && <span className="sr-only">Never shared with Huddle.</span>}
      <button
        type="button"
        ref={tape}
        className={`tape ${dragging ? 'is-dragging' : ''}`}
        style={{
          ['--tilt' as string]: `${tilt}deg`,
          ...(dragging ? { transform: `rotate(${tilt - drag / 18}deg) translate(${drag}px, ${-drag / 6}px)` } : null),
        }}
        aria-label={`Peel the tape off ${label}. Only Amara can see what's under it.`}
        tabIndex={peeled ? -1 : 0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => {
          startX.current = null
          setDrag(0)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onPeel()
          }
        }}
        onClick={(e) => e.preventDefault()}
      >
        never shared
      </button>
    </li>
  )
}
