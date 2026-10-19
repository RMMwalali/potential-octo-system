import { useEffect, useRef, useState } from 'react'
import { isStill } from '../../a11y'
import { Badge } from '../../components/Badge'
import { Phone } from '../../components/Phone'
import { PhoneIcon } from '../../components/icons'
import { amount, company, payee } from '../../data'
import { useT } from '../../i18n'
import { Spot } from '../../components/Notes'

type Stage = 'review' | 'waiting' | 'stopped' | 'approved' | 'timeout' | 'cancelled'

const WINDOW = 5 * 60 // seconds David has to answer

export function Wire({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>('review')
  const [left, setLeft] = useState(WINDOW)

  // Count down David's answer window while we wait.
  useEffect(() => {
    if (stage !== 'waiting') return
    setLeft(WINDOW)
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [stage])

  useEffect(() => {
    if (stage === 'waiting' && left === 0) setStage('timeout')
  }, [left, stage])

  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`
  const davidRef = useRef<HTMLDivElement>(null)

  // When the layout is stacked (phones, small tablets), David's phone sits below the fold:
  // bring it into view the moment the request goes out, so the question isn't missed.
  useEffect(() => {
    if (stage !== 'waiting' || window.innerWidth > 900) return
    const t = setTimeout(() => davidRef.current?.scrollIntoView({ behavior: isStill() ? 'auto' : 'smooth', block: 'center' }), 250)
    return () => clearTimeout(t)
  }, [stage])
  const { t } = useT()

  return (
    <div className="wire">
      <div className="step-copy step-copy-wide">
        <h2>{t('wire.h')}</h2>
        <p>{t('wire.p')}</p>
      </div>

      <div className="wire-stage">
        <section className="bank" aria-label={t('wire.bank', { company })} aria-live="polite">
          <header className="bank-top">
            <span className="bank-name">{t('wire.bank', { company })}</span>
            <span className="bank-user">{t('wire.signedIn')}</span>
          </header>

          <div className="bank-body">
            <p className="bank-kicker">{t('wire.kicker')}</p>
            <Spot n={1} title="Make the stakes visible" note="The amount is the biggest thing on the screen. Big numbers slow people down, which is exactly what pressure scams try to stop.">
              <p className="bank-amount">{amount}</p>
            </Spot>
            <dl className="bank-facts">
              <div>
                <dt>{t('wire.to')}</dt>
                <dd>{payee}, Hong Kong</dd>
              </div>
              <div>
                <dt>{t('wire.by')}</dt>
                <dd>{t('wire.byValue')}</dd>
              </div>
              <div>
                <dt>{t('wire.needs')}</dt>
                <dd>{t('wire.needsValue')}</dd>
              </div>
            </dl>

            {stage === 'review' && (
              <>
                <Spot n={2} place="tl" title="The warning travels with the request" note="What Proofline saw on the call follows the payment to the approval screen, so the context isn't lost between apps.">
                <p className="bank-flag">
                  <Badge kind="identity" status="cant" size="sm" />
                  <span>{t('wire.flag')}</span>
                </p>
                </Spot>
                <button type="button" className="btn btn-primary" onClick={() => setStage('waiting')} data-tour="wire-approve">
                  {t('wire.approve')}
                </button>
              </>
            )}

            {stage === 'waiting' && (
              <div className="bank-wait">
                <span className="pulse" aria-hidden="true">
                  <PhoneIcon size={22} />
                </span>
                <div className="bank-wait-text">
                  <p>
                    <strong>{t('wire.wait.b')}</strong> {t('wire.wait.r')}
                  </p>
                  <Spot n={3} place="tl" title="Silence is safe" note="If David doesn't answer, nothing moves. The default outcome of every failure is 'no money sent', never 'sent anyway'.">
                  <p className="bank-countdown">
                    {t('wire.countdown', { t: '\u0000' })
                      .split('\u0000')
                      .flatMap((part, i) => (i ? [<span key={i} className="countdown-num">{mmss}</span>, part] : [part]))}
                  </p>
                  </Spot>
                  <button type="button" className="link-btn" onClick={() => setStage('timeout')}>
                    {t('wire.skip')}
                  </button>
                </div>
              </div>
            )}

            {stage === 'timeout' && (
              <div className="bank-result is-hold">
                <Badge kind="identity" status="cant" size="lg" reason={t('reason.noAnswer')} />
                <p>
                  <strong>{t('wire.timeout.b')}</strong> {t('wire.timeout.r')}
                </p>
                <div className="bank-actions">
                  <button type="button" className="btn btn-primary" onClick={() => setStage('waiting')}>
                    {t('wire.askAgain')}
                  </button>
                  <button type="button" className="btn btn-quiet" onClick={() => setStage('cancelled')}>
                    {t('wire.cancel')}
                  </button>
                </div>
              </div>
            )}

            {stage === 'cancelled' && (
              <div className="bank-result">
                <p>
                  <strong>{t('wire.cancelled.b')}</strong> {t('wire.cancelled.r', { company })}
                </p>
                <div className="bank-actions">
                  <button type="button" className="btn btn-quiet" onClick={() => setStage('review')}>
                    {t('wire.startOver')}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={onDone}>
                    {t('wire.next')}
                  </button>
                </div>
              </div>
            )}

            {stage === 'stopped' && (
              <div className="bank-result is-stop">
                <Badge kind="stopped" size="lg" />
                <p>
                  <strong>{t('wire.stopped.b')}</strong> {t('wire.stopped.r', { company })}
                </p>
                <button type="button" className="btn btn-primary" onClick={onDone} data-tour="wire-next">
                  {t('wire.next')}
                </button>
              </div>
            )}

            {stage === 'approved' && (
              <div className="bank-result is-ok">
                <Badge kind="identity" />
                <p>
                  <strong>{t('wire.approved.b')}</strong> {t('wire.approved.r')}
                </p>
                <button type="button" className="link-btn" onClick={() => setStage('review')}>
                  {t('wire.tryAgain')}
                </button>
              </div>
            )}
          </div>
        </section>

        <div ref={davidRef} className={`david-phone ${stage === 'waiting' ? 'is-ringing' : ''}`}>
          <Phone label={t('wire.phone.label')} owner={t('call.phone.who')}>
            {stage === 'waiting' ? (
              <div className="confirm">
                <p className="confirm-app">Proofline</p>
                <h3>{t('wire.phone.q', { amount })}</h3>
                <p className="confirm-detail">{t('wire.phone.detail', { payee })}</p>
                <p className="confirm-timer">{t('wire.phone.expires', { t: mmss })}</p>
                <button type="button" className="btn btn-stop btn-block" onClick={() => setStage('stopped')} data-tour="wire-no">
                  {t('wire.phone.no')}
                </button>
                <button type="button" className="btn btn-quiet btn-block" onClick={() => setStage('approved')}>
                  {t('wire.phone.yes')}
                </button>
              </div>
            ) : (
              <div className="confirm confirm-idle">
                <p className="confirm-time">9:41</p>
                <p className="confirm-idle-text">
                  {stage === 'stopped'
                    ? t('wire.idle.stopped')
                    : stage === 'timeout'
                      ? t('wire.idle.timeout')
                      : t('wire.idle.none')}
                </p>
              </div>
            )}
          </Phone>
        </div>
      </div>
    </div>
  )
}
