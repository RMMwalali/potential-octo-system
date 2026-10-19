import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { HeaderTools } from '../components/HeaderTools'
import { Spot } from '../components/Notes'
import { PlayStoryButton } from '../components/Tour'
import { Wordmark } from '../components/Wordmark'
import { ArrowRight } from '../components/icons'
import { isStill, useStill } from '../a11y'
import { useT } from '../i18n'
import './landing.css'

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
