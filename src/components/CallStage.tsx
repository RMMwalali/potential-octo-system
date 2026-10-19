import { useEffect, useState } from 'react'
import { callApp, people } from '../data'
import { isStill } from '../a11y'
import { useT } from '../i18n'
import { Badge } from './Badge'
import { CameraIcon, HangUpIcon, MicOffIcon, PhoneIcon, UsersIcon } from './icons'
import { Portrait } from './Portrait'
import { Spot } from './Notes'

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

const reduceMotion = isStill

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
  const { t } = useT()
  const done = stage >= 3
  const denied = ask === 'denied' || ask === 'reported'

  return (
    <section className={`call call-${mode}`} aria-label={`${callApp} video call, with Proofline checking who is on it`}>
      <header className="call-top">
        <span className="call-title">{t('call.title')}</span>
        <span className="call-meta">
          <UsersIcon size={16} /> {t('call.onCall')}
        </span>
      </header>

      <Spot n={1} place="tl" title="The warning sits on the person" note="The verdict appears on David's own tile, where Amara is already looking, not in a settings menu. Three things change at once: badge, outline and wording.">
      <div className="call-grid">
        <Tile
          personId="david"
          hair="bald"
          speaking
          status={done ? 'cant' : 'checking'}
          flagged={done}
          fake={denied}
          reason={denied ? t('reason.denied') : done ? t('reason.notPhone') : undefined}
        />
        <Tile personId="wanjiru" hair="long" status={stage >= 1 ? 'confirmed' : 'checking'} justConfirmed={stage >= 1} />
        <Tile personId="brian" hair="short" status={stage >= 2 ? 'confirmed' : 'checking'} justConfirmed={stage >= 2} />
        <Tile personId="amara" hair="long" self status="confirmed" />
      </div>
      </Spot>

      <p className="call-caption">
        <span className="caption-who">David</span> {t('call.caption')}
      </p>

      <Spot n={2} title="Verdict in plain words" place="br" note="One sentence says what Proofline found and who it's about. No scores or percentages: people act on words like 'can't confirm', not on '62% match'.">
      <div className={`trust-bar ${denied ? 'is-stop' : done ? 'is-warn' : ''}`} aria-live="polite">
        <span className="trust-mark" aria-hidden="true">
          P
        </span>
        {!done ? (
          <span className="trust-text">
            {t('call.checking')} {stage > 0 && t('call.nOf3', { n: stage })}
          </span>
        ) : ask === 'reported' ? (
          <span className="trust-text">
            <strong>{t('call.reported.b')}</strong> {t('call.reported.r')}
          </span>
        ) : denied ? (
          <span className="trust-text">
            <strong>{t('call.denied.b')}</strong> {t('call.denied.r')}
          </span>
        ) : ask === 'sent' || ask === 'ringing' ? (
          <span className="trust-text">
            <span className="mini-spin" aria-hidden="true" />
            <strong>{t('call.asking.b')}</strong> {t('call.asking.r')}
          </span>
        ) : ask === 'yes' ? (
          <span className="trust-text">
            <strong>{t('call.yes.b')}</strong> {t('call.yes.r')}
          </span>
        ) : (
          <span className="trust-text">
            <strong>{t('call.cant.b')}</strong> {t('call.cant.r')}
          </span>
        )}
        {done && mode === 'demo' && (ask === 'idle' || ask === 'yes') && (
          <span className="trust-actions">
            <Spot as="span" n={3} title="Check outside the call" note="The question goes to David's registered phone, a channel the impostor can't see or answer. That's the one thing a deepfake can't copy.">
              <button type="button" className="trust-action trust-primary" onClick={() => setAsk('sent')}>
                <PhoneIcon size={16} /> {t('call.ask')}
              </button>
            </Spot>
            <button type="button" className="trust-action" aria-expanded={advice} onClick={() => setAdvice((a) => !a)}>
              {advice ? t('call.hideAdvice') : t('call.advice')}
            </button>
          </span>
        )}
        {mode === 'demo' && ask === 'denied' && (
          <button type="button" className="trust-action" onClick={() => setAsk('reported')}>
            {t('call.report')}
          </button>
        )}
      </div>

      </Spot>

      {mode === 'demo' && ask === 'ringing' && (
        <div className="call-phone" role="dialog" aria-label={t('call.phone.who')}>
          <p className="call-phone-who">
            <PhoneIcon size={16} /> {t('call.phone.who')}
          </p>
          <p className="call-phone-q">
            <strong>Proofline:</strong> {t('call.phone.q')}
          </p>
          <div className="call-phone-actions">
            <button type="button" className="btn btn-stop" onClick={() => setAsk('denied')} data-tour="call-deny">
              {t('call.phone.no')}
            </button>
            <button type="button" className="btn btn-quiet" onClick={() => setAsk('yes')}>
              {t('call.phone.yes')}
            </button>
          </div>
        </div>
      )}

      {done && advice && (
        <div className="trust-advice">
          <p>{t('call.advice.p')}</p>
          <ul>
            <li>{t('call.advice.1')}</li>
            <li>{t('call.advice.2')}</li>
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
            {denied ? t('call.continueDenied') : t('call.continue')}
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
  const { t } = useT()
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
        {self ? t('call.you', { name: p.first }) : p.name}
      </figcaption>
    </figure>
  )
}
