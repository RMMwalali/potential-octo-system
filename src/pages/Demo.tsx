import { useEffect, useRef, useState } from 'react'
import { PlayStoryButton } from '../components/Tour'
import { CallStage } from '../components/CallStage'
import { ArrowLeft, ArrowRight } from '../components/icons'
import { Wordmark } from '../components/Wordmark'
import { Everywhere } from './steps/Everywhere'
import { Verify } from './steps/Verify'
import { Wallet } from './steps/Wallet'
import { Wire } from './steps/Wire'

const steps = ['Verify once', 'Her wallet', 'The call', 'The payment', 'Everywhere else']

export function Demo({ step }: { step: number }) {
  const go = (n: number) => (window.location.hash = `#/demo/${n}`)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [run, setRun] = useState(0)

  // A fresh story starts every step from its first state.
  useEffect(() => {
    const on = () => setRun((r) => r + 1)
    window.addEventListener('tour-reset', on)
    return () => window.removeEventListener('tour-reset', on)
  }, [])

  // Move focus to the step title on each step change, so keyboard and
  // screen-reader users land at the top of the new content.
  useEffect(() => {
    headingRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [step])

  return (
    <div className="demo">
      <header className="demo-nav">
        <a href="#/" aria-label="Back to the Proofline overview">
          <Wordmark />
        </a>
        <nav aria-label="Demo steps">
          <ol className="stepper">
            {steps.map((s, i) => {
              const n = i + 1
              const state = n < step ? 'done' : n === step ? 'current' : 'todo'
              return (
                <li key={s} className={`stepper-item is-${state}`}>
                  <a href={`#/demo/${n}`} aria-current={state === 'current' ? 'step' : undefined}>
                    <span className="stepper-num">{n}</span>
                    <span className="stepper-label">{s}</span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>
        <PlayStoryButton className="btn btn-primary btn-small demo-play" />
      </header>

      <main id="main" className="demo-main" tabIndex={-1}>
        <h1 className="sr-only" tabIndex={-1} ref={headingRef}>
          Step {step} of {steps.length}: {steps[step - 1]}
        </h1>
        <p className="demo-persona">
          {step <= 4
            ? 'Amara Njoroge is a finance officer at Kilima Freight in Nairobi.'
            : 'Beyond the office, the same badges protect everyday life online.'}
        </p>

        <div key={`${step}-${run}`} className="step-body">
        {step === 1 && <Verify onDone={() => go(2)} />}
        {step === 2 && <Wallet onDone={() => go(3)} />}
        {step === 3 && (
          <div className="call-step">
            <div className="step-copy step-copy-wide">
              <h2>The CFO looks and sounds exactly like David</h2>
              <p>
                It isn't him. Proofline confirms the two colleagues on their own phones, and can't confirm "David",
                because the call is coming from a device David never registered.
              </p>
            </div>
            <CallStage mode="demo" onContinue={() => go(4)} />
          </div>
        )}
        {step === 4 && <Wire onDone={() => go(5)} />}
        {step === 5 && <Everywhere />}
        </div>
      </main>

      <footer className="demo-foot">
        {step > 1 ? (
          <button type="button" className="btn btn-quiet" onClick={() => go(step - 1)}>
            <ArrowLeft /> {steps[step - 2]}
          </button>
        ) : (
          <a className="btn btn-quiet" href="#/">
            <ArrowLeft /> Overview
          </a>
        )}
        <span className="demo-count">
          Step {step} of {steps.length}
        </span>
        {step < steps.length ? (
          <button type="button" className="btn btn-quiet" onClick={() => go(step + 1)}>
            {steps[step]} <ArrowRight />
          </button>
        ) : (
          <span />
        )}
      </footer>
    </div>
  )
}
