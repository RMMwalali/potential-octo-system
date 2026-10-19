import { useState } from 'react'
import { Badge } from '../../components/Badge'
import { Phone } from '../../components/Phone'
import { PhoneIcon } from '../../components/icons'
import { amount, company, payee } from '../../data'

type Stage = 'review' | 'waiting' | 'stopped' | 'approved'

export function Wire({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>('review')

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
                <button type="button" className="btn btn-primary" onClick={() => setStage('waiting')}>
                  Approve payment
                </button>
              </>
            )}

            {stage === 'waiting' && (
              <div className="bank-wait">
                <span className="pulse" aria-hidden="true">
                  <PhoneIcon size={22} />
                </span>
                <p>
                  <strong>Waiting for David to confirm on his own phone.</strong> Proofline sent the request to the phone
                  he registered, not to anyone on the call.
                </p>
              </div>
            )}

            {stage === 'stopped' && (
              <div className="bank-result is-stop">
                <Badge kind="stopped" size="lg" />
                <p>
                  <strong>David says he didn't ask for this. No money has moved.</strong> {company}'s security team has
                  been alerted and the call has been flagged.
                </p>
                <button type="button" className="btn btn-primary" onClick={onDone}>
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
                <button type="button" className="btn btn-stop btn-block" onClick={() => setStage('stopped')}>
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
                  {stage === 'stopped' ? 'You stopped a payment request. Thanks, David.' : 'No requests'}
                </p>
              </div>
            )}
          </Phone>
        </div>
      </div>
    </div>
  )
}
