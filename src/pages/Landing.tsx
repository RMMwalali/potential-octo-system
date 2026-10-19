import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '../components/Badge'
import { HeaderTools } from '../components/HeaderTools'
import { Spot } from '../components/Notes'
import { PlayStoryButton } from '../components/Tour'
import { Wordmark } from '../components/Wordmark'
import { ArrowRight, HumanMark, ReceiptMark, ShieldMark } from '../components/icons'
import { isStill, useStill } from '../a11y'
import { useT } from '../i18n'
import './landing.css'

gsap.registerPlugin(ScrollTrigger)

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
        width="960"
        height="972"
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

export function Landing() {
  const root = useRef<HTMLDivElement>(null)
  const { t } = useT()
  const [loading, setLoading] = useState(() => !isStill() && !introSeen())
  const still = useStill()
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

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (still) {
      setLoading(false)
      return
    }
    const ctx = gsap.context(() => {
      // First visit only: the seal stamps down, the sheet lifts away, the headline rises.
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
        .from('.hero-sub, .hero-actions', { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.6')
        .from('.hero3d', { scale: 0.85, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.9')

      // Vision lines slide in from alternate sides as they reach the screen
      gsap.utils.toArray<HTMLElement>('.vision-line').forEach((line, i) => {
        gsap.from(line, {
          xPercent: i % 2 ? 12 : -12,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: line, start: 'top 90%' },
        })
      })
      gsap.from('.vision-point', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.vision-points', start: 'top 85%' },
      })
      // Sticker cards fly in and land at their tilt
      gsap.from('.proof-card', {
        y: 140,
        rotation: (i) => [-12, 9, -7][i] ?? 0,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'back.out(1.4)',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.proofs-grid', start: 'top 85%' },
      })
      // The tape line draws across the steps
      gsap.from('.how-tape', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: '.how', start: 'top 75%', end: 'bottom 65%', scrub: true },
      })
      gsap.from('.how-step', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.how', start: 'top 80%' },
      })
    }, el)
    return () => ctx.revert()
  }, [still])

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
        <HeaderTools />
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero band-sky">
          <div className="hero-copy">
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
          <Spot
            n={1}
            title="One moment of motion, with a point"
            note="The only thing that moves on its own is the fake David's tile flipping to a warning. Everything else waits for you, so the motion tells the story."
          >
            <HeroStage />
          </Spot>
        </section>

        {/* ───────── Vision ───────── */}
        <section className="vision band-navy" aria-labelledby="vision-h">
          <div className="vision-inner">
            <h2 id="vision-h" className="vision-kicker">
              Seeing someone used to be proof.
            </h2>
            <p className="vision-words" aria-label="Copy a face. Clone a voice. You still can't fake their phone.">
              <span className="vision-line" aria-hidden="true">
                Copy a face.
              </span>
              <span className="vision-line vision-outline" aria-hidden="true">
                Clone a voice.
              </span>
              <span className="vision-line vision-accent" aria-hidden="true">
                Can't fake their phone.
              </span>
            </p>
            <div className="vision-points">
              <div className="vision-point">
                <h3>What changed</h3>
                <p>
                  Every trust signal online assumed faking a person was hard: a familiar face, a voice, a profile photo. AI
                  made it cheap, and those signals stopped meaning anything.
                </p>
              </div>
              <div className="vision-point">
                <h3>What we're building</h3>
                <p>
                  A trust layer for the internet. Before a bank, an app or a video call trusts anyone, it can ask Proofline
                  whether a real, verified person is on the other end.
                </p>
              </div>
              <div className="vision-point">
                <h3>Without giving up privacy</h3>
                <p>
                  You verify once, on your own phone. Apps get a yes or no, never your ID, and you see what they learn
                  before you agree.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Three proofs ───────── */}
        <section className="proofs" id="signals" aria-labelledby="signals-h">
          <div className="proofs-head">
            <h2 id="signals-h">Three things Proofline can prove</h2>
            <p>
              Each badge has its own shape, so you can tell them apart at a glance, even without colour. Tap any badge to see
              exactly what it means.
            </p>
          </div>
          <Spot
            n={2}
            title="Two questions, kept apart"
            note="'Is this a real person?' and 'Is this the right person?' get different badges and different shapes. Deepfake scammers are real people, so a 'not a bot' badge alone would stay green."
          >
            <div className="proofs-grid">
              <article className="proof-card card-navy">
                <span className="proof-icon sticker-sky">
                  <ShieldMark size={52} mark="check" />
                </span>
                <h3>This is the person you think it is</h3>
                <p>The named person, on the phone they registered. A scammer can copy a face, but not someone's phone.</p>
                <Badge kind="identity" explain />
                <p className="proof-where">Calls, payments, password resets</p>
              </article>
              <article className="proof-card card-sky">
                <span className="proof-icon sticker-white">
                  <HumanMark size={52} />
                </span>
                <h3>A real person, not a bot</h3>
                <p>A unique human made this account. Their name stays private unless they choose to share it.</p>
                <Badge kind="human" explain />
                <p className="proof-where">Replies, dating matches, sign-ups</p>
              </article>
              <article className="proof-card card-orange">
                <span className="proof-icon sticker-white">
                  <ReceiptMark size={52} />
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
              Deepfake scammers are real people. A badge that only says "not a bot" would stay green while they talk to you.
              Proofline keeps the two questions separate: is this a person, and is it the right person.
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
        <section className="privacy band-navy" id="privacy" aria-labelledby="privacy-h">
          <div className="privacy-inner">
            <div className="privacy-copy">
              <h2 id="privacy-h">Proof without handing over your ID</h2>
              <p>
                This is everything a video-call app gets when it checks Amara. The rest stays taped up on her phone, and only
                she can peel it back.
              </p>
              <button type="button" className="btn btn-sky btn-big" aria-pressed={peeled} onClick={() => setAll(!anyPeeled)}>
                {anyPeeled ? 'Seal it back up' : 'Peel back all the tape'}
              </button>
              <p className="privacy-hand" aria-hidden="true">
                {anyPeeled ? 'only Amara sees this view' : 'or grab a strip and pull it off'}
              </p>
            </div>

            <Spot
              n={3}
              title="Privacy you can touch"
              note="Tape makes 'what the app never gets' physical. Sealed is the default, only the owner can peel it, and each strip is a real button for keyboard users."
            >
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

        {/* ───────── Call to action ───────── */}
        <section className="cta-end">
          <div className="cta-block">
            <h2>See Proofline stop a deepfake call</h2>
            <p>Five short steps, about a minute and a half.</p>
            <div className="cta-actions">
              <a href="#/demo/1" className="btn btn-sky btn-big">
                Start the demo <ArrowRight />
              </a>
              <PlayStoryButton className="btn btn-ghost-light btn-big" />
            </div>
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
