import { useEffect, useState } from 'react'
import { Badge } from '../../components/Badge'
import { Phone } from '../../components/Phone'
import { PhoneIcon } from '../../components/icons'
import { amount, company, payee } from '../../data'

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

  return (
    <div className="wire">
      <div className="step-copy step-copy-wide">
        <h2>The payment needs the real David</h2>
        <p>
          The fake David pushes Amara to send the money now. When she presses approve, Proofline asks the real David on
          his registered phone. A copied face can't answer that.
        </p>
      </div>

      <div className="wire-stage">
        <section className="bank" aria-label={`${company} payments`} aria-live="polite">
          <header className="bank-top">
            <span className="bank-name">{company} payments</span>
            <span className="bank-user">Signed in as Amara Njoroge</span>
          </header>

          <div className="bank-body">
            <p className="bank-kicker">Outgoing transfer</p>
            <p className="bank-amount">{amount}</p>
            <dl className="bank-facts">
              <div>
                <dt>To</dt>
                <dd>{payee}, Hong Kong</dd>
              </div>
              <div>
                <dt>Requested by</dt>
                <dd>David Otieno, on a {`Huddle`} call</dd>
              </div>
              <div>
                <dt>Needs approval from</dt>
                <dd>David Otieno, Chief financial officer</dd>
              </div>
            </dl>

            {stage === 'review' && (
              <>
                <p className="bank-flag">
                  <Badge kind="identity" status="cant" size="sm" />
                  <span>The person who asked for this on the call wasn't confirmed as David.</span>
                </p>
                <button type="button" className="btn btn-primary" onClick={() => setStage('waiting')} data-tour="wire-approve">
                  Approve payment
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
                    <strong>Waiting for David to confirm on his own phone.</strong> Proofline sent the request to the
                    phone he registered, not to anyone on the call.
                  </p>
                  <p className="bank-countdown">
                    <span className="countdown-num">{mmss}</span> left to answer. The payment stays on hold until then.
                  </p>
                  <button type="button" className="link-btn" onClick={() => setStage('timeout')}>
                    Demo: skip ahead 5 minutes
                  </button>
                </div>
              </div>
            )}

            {stage === 'timeout' && (
              <div className="bank-result is-hold">
                <Badge kind="identity" status="cant" size="lg" reason="No answer from David" />
                <p>
                  <strong>David didn't answer, so nothing has moved.</strong> A payment this size never goes out without
                  him. It stays on hold, and Amara can ask again or cancel it.
                </p>
                <div className="bank-actions">
                  <button type="button" className="btn btn-primary" onClick={() => setStage('waiting')}>
                    Ask David again
                  </button>
                  <button type="button" className="btn btn-quiet" onClick={() => setStage('cancelled')}>
                    Cancel payment
                  </button>
                </div>
              </div>
            )}

            {stage === 'cancelled' && (
              <div className="bank-result">
                <p>
                  <strong>Payment cancelled.</strong> No money moved. The request and the call are saved for{' '}
                  {company}'s security team.
                </p>
                <div className="bank-actions">
                  <button type="button" className="btn btn-quiet" onClick={() => setStage('review')}>
                    Start over
                  </button>
                  <button type="button" className="btn btn-primary" onClick={onDone}>
                    See Proofline everywhere else
                  </button>
                </div>
              </div>
            )}

            {stage === 'stopped' && (
              <div className="bank-result is-stop">
                <Badge kind="stopped" size="lg" />
                <p>
                  <strong>David says he didn't ask for this. No money has moved.</strong> {company}'s security team has
                  been alerted and the call has been flagged.
                </p>
                <button type="button" className="btn btn-primary" onClick={onDone} data-tour="wire-next">
                  See Proofline everywhere else
                </button>
              </div>
            )}

            {stage === 'approved' && (
              <div className="bank-result is-ok">
                <Badge kind="identity" />
                <p>
                  <strong>David confirmed on his phone.</strong> In the real story, this is the step that never happens,
                  because the real David never asked.
                </p>
                <button type="button" className="link-btn" onClick={() => setStage('review')}>
                  Try again
                </button>
              </div>
            )}
          </div>
        </section>

        <div className={`david-phone ${stage === 'waiting' ? 'is-ringing' : ''}`}>
          <Phone label="David's real phone" owner="The real David's phone, in a meeting across town">
            {stage === 'waiting' ? (
              <div className="confirm">
                <p className="confirm-app">Proofline</p>
                <h3>Did you ask Amara to send {amount}?</h3>
                <p className="confirm-detail">To {payee}, Hong Kong. Requested a minute ago on a Huddle call.</p>
                <p className="confirm-timer">Expires in {mmss}</p>
                <button type="button" className="btn btn-stop btn-block" onClick={() => setStage('stopped')} data-tour="wire-no">
                  No, I didn't ask for this
                </button>
                <button type="button" className="btn btn-quiet btn-block" onClick={() => setStage('approved')}>
                  Yes, I asked
                </button>
              </div>
            ) : (
              <div className="confirm confirm-idle">
                <p className="confirm-time">9:41</p>
                <p className="confirm-idle-text">
                  {stage === 'stopped'
                    ? 'You stopped a payment request. Thanks, David.'
                    : stage === 'timeout'
                      ? 'Missed: 1 payment request from Proofline'
                      : 'No requests'}
                </p>
              </div>
            )}
          </Phone>
        </div>
      </div>
    </div>
  )
}
