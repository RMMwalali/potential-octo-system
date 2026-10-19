import { useEffect, useState } from 'react'
import { callApp, people } from '../data'
import { Badge } from './Badge'
import { CameraIcon, HangUpIcon, MicOffIcon, UsersIcon } from './icons'
import { Portrait } from './Portrait'

type Phase = 'checking' | 'resolved'

type Props = {
  /** Hero mode loops on its own; demo mode waits for the person. */
  mode: 'hero' | 'demo'
  onContinue?: () => void
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CallStage({ mode, onContinue }: Props) {
  const [phase, setPhase] = useState<Phase>(mode === 'hero' && reduceMotion() ? 'resolved' : 'checking')
  const [advice, setAdvice] = useState(false)

  useEffect(() => {
    if (mode === 'hero' && reduceMotion()) return
    if (phase === 'checking') {
      const t = setTimeout(() => setPhase('resolved'), mode === 'hero' ? 2600 : 3200)
      return () => clearTimeout(t)
    }
    if (mode === 'hero') {
      const t = setTimeout(() => setPhase('checking'), 7000)
      return () => clearTimeout(t)
    }
  }, [phase, mode])

  const done = phase === 'resolved'

  return (
    <section className={`call call-${mode}`} aria-label={`${callApp} video call, with Proofline checking who is on it`}>
      <header className="call-top">
        <span className="call-title">Q4 payments sync</span>
        <span className="call-meta">
          <UsersIcon size={16} /> 4 on call
        </span>
      </header>

      <div className="call-grid">
        <Tile personId="david" hair="bald" speaking status={done ? 'cant' : 'checking'} flagged={done}
          reason={done ? "Not on David's registered phone" : undefined} />
        <Tile personId="wanjiru" hair="long" status={done ? 'confirmed' : 'checking'} />
        <Tile personId="brian" hair="short" status={done ? 'confirmed' : 'checking'} />
        <Tile personId="amara" hair="long" self status="confirmed" />
      </div>

      <p className="call-caption" aria-live="off">
        <span className="caption-who">David</span> Amara, I need the Meridian transfer out before three. Keep it between us
        for now.
      </p>

      <div className={`trust-bar ${done ? 'is-warn' : ''}`} aria-live="polite">
        <span className="trust-mark" aria-hidden="true">P</span>
        {!done ? (
          <span className="trust-text">Proofline is checking who's on this call…</span>
        ) : (
          <span className="trust-text">
            <strong>We can't confirm that this is David Otieno.</strong> The other two are confirmed.
          </span>
        )}
        {done && (
          <button type="button" className="trust-action" aria-expanded={advice} onClick={() => setAdvice((a) => !a)}>
            {advice ? 'Hide advice' : 'What should I do?'}
          </button>
        )}
      </div>

      {done && advice && (
        <div className="trust-advice">
          <p>
            Faces and voices can be faked. Until David is confirmed, don't act on requests from this call to move money or
            share passwords.
          </p>
          <ul>
            <li>Ask David to confirm in Proofline. The request goes to his own phone.</li>
            <li>Or call him on a number you already have, not one given on this call.</li>
          </ul>
        </div>
      )}

      <footer className="call-controls" aria-hidden={mode === 'hero'}>
        <span className="ctrl">
          <MicOffIcon />
        </span>
        <span className="ctrl">
          <CameraIcon />
        </span>
        <span className="ctrl ctrl-end">
          <HangUpIcon />
        </span>
        {mode === 'demo' && done && onContinue && (
          <button type="button" className="btn btn-light call-continue" onClick={onContinue}>
            David asks Amara to send the payment
          </button>
        )}
      </footer>
    </section>
  )
}

function Tile({
  personId,
  hair,
  status,
  speaking,
  self,
  flagged,
  reason,
}: {
  personId: keyof typeof people
  hair: 'short' | 'long' | 'bald'
  status: 'confirmed' | 'checking' | 'cant'
  speaking?: boolean
  self?: boolean
  flagged?: boolean
  reason?: string
}) {
  const p = people[personId]
  return (
    <figure className={`tile ${speaking ? 'is-speaking' : ''} ${flagged ? 'is-flagged' : ''}`}>
      <Portrait person={p} hair={hair} />
      <span className="tile-badge">
        <Badge kind="identity" status={status} subject={self ? `you, ${p.name}` : p.name} size="sm" reason={reason} />
      </span>
      <figcaption className="tile-name">
        {speaking && (
          <span className="voice" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        {self ? `${p.first} (you)` : p.name}
      </figcaption>
    </figure>
  )
}
