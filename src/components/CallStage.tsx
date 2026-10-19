import { useEffect, useState } from 'react'
import { callApp, people } from '../data'
import { Badge } from './Badge'
import { CameraIcon, HangUpIcon, MicOffIcon, PhoneIcon, UsersIcon } from './icons'
import { Portrait } from './Portrait'

/**
 * Stage 0: everyone being checked. 1: Wanjiru confirmed. 2: Brian confirmed.
 * 3: "David" can't be confirmed and the trust bar warns.
 */
type Props = {
  /** demo: plays through on its own; scroll: the parent drives `stage`. */
  mode: 'demo' | 'scroll'
  stage?: number
  onContinue?: () => void
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CallStage({ mode, stage: driven = 0, onContinue }: Props) {
  const [auto, setAuto] = useState(reduceMotion() ? 3 : 0)
  const [advice, setAdvice] = useState(false)
  // Asking the real David, on his own phone, from inside the call.
  const [ask, setAsk] = useState<'idle' | 'sent' | 'ringing' | 'denied' | 'yes' | 'reported'>('idle')

  useEffect(() => {
    if (ask !== 'sent') return
    const t = setTimeout(() => setAsk('ringing'), reduceMotion() ? 50 : 1300)
    return () => clearTimeout(t)
  }, [ask])

  useEffect(() => {
    if (mode !== 'demo' || auto >= 3) return
    const t = setTimeout(() => setAuto((s) => s + 1), auto === 0 ? 1600 : 900)
    return () => clearTimeout(t)
  }, [mode, auto])

  const stage = mode === 'demo' ? auto : driven
  const done = stage >= 3
  const denied = ask === 'denied' || ask === 'reported'

  return (
    <section className={`call call-${mode}`} aria-label={`${callApp} video call, with Proofline checking who is on it`}>
      <header className="call-top">
        <span className="call-title">Q4 payments sync</span>
        <span className="call-meta">
          <UsersIcon size={16} /> 4 on call
        </span>
      </header>

      <div className="call-grid">
        <Tile
          personId="david"
          hair="bald"
          speaking
          status={done ? 'cant' : 'checking'}
          flagged={done}
          fake={denied}
          reason={denied ? "David says this isn't him" : done ? "Not on David's registered phone" : undefined}
        />
        <Tile personId="wanjiru" hair="long" status={stage >= 1 ? 'confirmed' : 'checking'} justConfirmed={stage >= 1} />
        <Tile personId="brian" hair="short" status={stage >= 2 ? 'confirmed' : 'checking'} justConfirmed={stage >= 2} />
        <Tile personId="amara" hair="long" self status="confirmed" />
      </div>

      <p className="call-caption">
        <span className="caption-who">David</span> Amara, I need the Meridian transfer out before three. Keep it between us
        for now.
      </p>

      <div className={`trust-bar ${denied ? 'is-stop' : done ? 'is-warn' : ''}`} aria-live="polite">
        <span className="trust-mark" aria-hidden="true">
          P
        </span>
        {!done ? (
          <span className="trust-text">
            Proofline is checking who's on this call… {stage > 0 && `${stage} of 3 confirmed`}
          </span>
        ) : ask === 'reported' ? (
          <span className="trust-text">
            <strong>Reported to Kilima Freight security.</strong> They have the call details. Don't act on anything this
            person asked for.
          </span>
        ) : denied ? (
          <span className="trust-text">
            <strong>The real David says he isn't on this call.</strong> This person is pretending to be him.
          </span>
        ) : ask === 'sent' || ask === 'ringing' ? (
          <span className="trust-text">
            <span className="mini-spin" aria-hidden="true" />
            <strong>Asking David on his registered phone…</strong> Not on this call, so the impostor can't see it.
          </span>
        ) : ask === 'yes' ? (
          <span className="trust-text">
            <strong>David says it's him.</strong> In this story the real David is in a meeting across town, so he'd tap
            No. Try again to see that.
          </span>
        ) : (
          <span className="trust-text">
            <strong>We can't confirm that this is David Otieno.</strong> The other two are confirmed.
          </span>
        )}
        {done && mode === 'demo' && (ask === 'idle' || ask === 'yes') && (
          <span className="trust-actions">
            <button type="button" className="trust-action trust-primary" onClick={() => setAsk('sent')}>
              <PhoneIcon size={16} /> Ask David to confirm
            </button>
            <button type="button" className="trust-action" aria-expanded={advice} onClick={() => setAdvice((a) => !a)}>
              {advice ? 'Hide advice' : 'What should I do?'}
            </button>
          </span>
        )}
        {mode === 'demo' && ask === 'denied' && (
          <button type="button" className="trust-action" onClick={() => setAsk('reported')}>
            Report this call
          </button>
        )}
      </div>

      {mode === 'demo' && ask === 'ringing' && (
        <div className="call-phone" role="dialog" aria-label="The real David's phone">
          <p className="call-phone-who">
            <PhoneIcon size={16} /> The real David's phone, in a meeting across town
          </p>
          <p className="call-phone-q">
            <strong>Proofline:</strong> Are you on the "Q4 payments sync" call with Amara right now?
          </p>
          <div className="call-phone-actions">
            <button type="button" className="btn btn-stop" onClick={() => setAsk('denied')} data-tour="call-deny">
              No, that's not me
            </button>
            <button type="button" className="btn btn-quiet" onClick={() => setAsk('yes')}>
              Yes, it's me
            </button>
          </div>
        </div>
      )}

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

      <footer className="call-controls" aria-hidden={mode === 'scroll'}>
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
          <button type="button" className="btn btn-light call-continue" onClick={onContinue} data-tour="call-continue">
            {denied ? 'See what happens if she skips the check' : 'David asks Amara to send the payment'}
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
  justConfirmed,
  fake,
}: {
  personId: keyof typeof people
  hair: 'short' | 'long' | 'bald'
  status: 'confirmed' | 'checking' | 'cant'
  speaking?: boolean
  self?: boolean
  flagged?: boolean
  reason?: string
  justConfirmed?: boolean
  fake?: boolean
}) {
  const p = people[personId]
  return (
    <figure
      className={`tile ${speaking ? 'is-speaking' : ''} ${flagged ? 'is-flagged' : ''} ${fake ? 'is-fake' : ''} ${justConfirmed ? 'is-confirmed' : ''}`}
    >
      <Portrait person={p} hair={hair} />
      {flagged && <span className="tile-scan" aria-hidden="true" />}
      <span className="tile-badge">
        {fake ? (
          <Badge kind="flagged" subject={p.name} size="sm" reason={reason} />
        ) : (
          <Badge kind="identity" status={status} subject={self ? `you, ${p.name}` : p.name} size="sm" reason={reason} />
        )}
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
