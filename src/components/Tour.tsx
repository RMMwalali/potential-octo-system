import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * "Play the story": walks the five demo steps on its own, pressing the real
 * buttons (with a highlight ring first) so it looks like someone using it.
 */
type Beat = { step: number; caption: string; hold: number; click?: string }

const beats: Beat[] = [
  { step: 1, caption: 'Amara sets up Proofline once, on her own phone.', hold: 2600, click: '[data-tour="verify-scan"]' },
  { step: 1, caption: 'Her ID is read on the phone. Nothing is uploaded.', hold: 2200, click: '[data-tour="verify-selfie"]' },
  { step: 1, caption: 'A quick selfie check proves she matches the ID.', hold: 2200, click: '[data-tour="verify-done"]' },
  { step: 2, caption: "The call app asks to confirm it's her. She sees what it learns, and what it never will.", hold: 4200, click: '[data-tour="wallet-share"]' },
  { step: 2, caption: 'Shared: a yes, nothing more. She joins the call.', hold: 2400, click: '[data-tour="wallet-join"]' },
  { step: 3, caption: 'Proofline checks everyone on the call, each on their own phone.', hold: 4200 },
  { step: 3, caption: "\"David\" looks and sounds right. But this isn't his phone.", hold: 3600, click: '[data-tour="call-continue"]' },
  { step: 4, caption: 'Fake David pushes for USD 25 million. Amara presses approve.', hold: 3200, click: '[data-tour="wire-approve"]' },
  { step: 4, caption: 'Proofline asks the real David, on the phone he registered.', hold: 3000, click: '[data-tour="wire-no"]' },
  { step: 4, caption: 'The real David never asked. No money moves.', hold: 3600, click: '[data-tour="wire-next"]' },
  { step: 5, caption: 'The same badges work everywhere: replies, dating, reviews.', hold: 3200, click: '.surface-replies .badge-button' },
  { step: 5, caption: 'Tap any badge to see exactly what it proves.', hold: 3400 },
  { step: 5, caption: "That's Proofline: proof of the person, not the picture.", hold: 3000 },
]

export const tourSeconds = Math.round(beats.reduce((s, b) => s + b.hold + (b.click ? 700 : 0), 0) / 1000)

type Tour = {
  playing: boolean
  paused: boolean
  index: number
  start: () => void
  stop: () => void
  togglePause: () => void
  skip: () => void
}

const Ctx = createContext<Tour | null>(null)
export const useTour = () => useContext(Ctx)!

const goStep = (n: number) => {
  const want = `#/demo/${n}`
  if (window.location.hash !== want) window.location.hash = want
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [index, setIndex] = useState(0)
  const elapsed = useRef(0)
  const clicking = useRef(false)

  const stop = useCallback(() => {
    setPlaying(false)
    setPaused(false)
    document.querySelectorAll('.tour-target').forEach((el) => el.classList.remove('tour-target'))
  }, [])

  const start = useCallback(() => {
    elapsed.current = 0
    clicking.current = false
    setIndex(0)
    setPaused(false)
    setPlaying(true)
    // Start from a fresh step 1, even if we're already on it.
    window.location.hash = '#/demo/1'
    window.dispatchEvent(new CustomEvent('tour-reset'))
  }, [])

  const advance = useCallback(() => {
    elapsed.current = 0
    clicking.current = false
    setIndex((i) => {
      if (i + 1 >= beats.length) {
        setPlaying(false)
        return i
      }
      return i + 1
    })
  }, [])

  const press = useCallback(
    (selector: string) => {
      clicking.current = true
      const el = document.querySelector<HTMLElement>(selector)
      if (!el) return advance()
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el.classList.add('tour-target')
      window.setTimeout(() => {
        el.classList.remove('tour-target')
        el.click()
        advance()
      }, 700)
    },
    [advance],
  )

  // Keep the page on the beat's step.
  useEffect(() => {
    if (playing) goStep(beats[index].step)
  }, [playing, index])

  // The clock: counts only while playing and not paused.
  useEffect(() => {
    if (!playing || paused) return
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      if (!clicking.current) elapsed.current += now - last
      last = now
      const b = beats[index]
      if (!clicking.current && elapsed.current >= b.hold) {
        if (b.click) press(b.click)
        else advance()
      }
    }, 80)
    return () => window.clearInterval(id)
  }, [playing, paused, index, press, advance])

  // Esc stops, space pauses.
  useEffect(() => {
    if (!playing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing, stop])

  const togglePause = () => setPaused((p) => !p)
  const skip = () => {
    const b = beats[index]
    if (clicking.current) return
    if (b.click) press(b.click)
    else advance()
  }

  return (
    <Ctx.Provider value={{ playing, paused, index, start, stop, togglePause, skip }}>
      {children}
      {playing && <TourBar />}
    </Ctx.Provider>
  )
}

function TourBar() {
  const { paused, index, stop, togglePause, skip } = useTour()
  const b = beats[index]
  return (
    <div className="tour-bar" role="region" aria-label="Story playback">
      <div className="tour-progress" aria-hidden="true">
        {beats.map((x, i) => (
          <i
            key={`${i}-${i === index}`}
            className={i < index ? 'done' : i === index ? `now ${paused ? 'is-paused' : ''}` : ''}
            style={i === index ? { animationDuration: `${x.hold}ms` } : undefined}
          />
        ))}
      </div>
      <p className="tour-caption" aria-live="polite">
        <span className="tour-step">Step {b.step} of 5</span>
        {b.caption}
      </p>
      <div className="tour-controls">
        <button type="button" className="tour-btn" onClick={togglePause} aria-label={paused ? 'Resume story' : 'Pause story'}>
          {paused ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 5v14l12-7z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button type="button" className="tour-btn" onClick={skip} aria-label="Next moment">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 5v14l10-7zM16 5h3v14h-3z" fill="currentColor" />
          </svg>
        </button>
        <button type="button" className="tour-btn tour-stop" onClick={stop}>
          Stop
        </button>
      </div>
    </div>
  )
}

export function PlayStoryButton({ className = 'btn btn-ghost' }: { className?: string }) {
  const { start, playing } = useTour()
  if (playing) return null
  return (
    <button type="button" className={className} onClick={start}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M7 5v14l12-7z" fill="currentColor" />
      </svg>
      Play the {tourSeconds}-second story
    </button>
  )
}
