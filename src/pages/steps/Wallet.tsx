import { useState } from 'react'
import { Phone } from '../../components/Phone'
import { EyeIcon, EyeOffIcon, PhoneIcon } from '../../components/icons'
import { Badge } from '../../components/Badge'
import { callApp, company } from '../../data'
import { Spot, useNotes } from '../../components/Notes'

type Share = { app: string; what: string; when: string }

export function Wallet({ onDone }: { onDone: () => void }) {
  const { on: notesOn } = useNotes()
  const [employer, setEmployer] = useState(false)
  const [decision, setDecision] = useState<'pending' | 'shared' | 'declined'>('pending')
  const [log, setLog] = useState<Share[]>([
    { app: 'Jenga Bank app', what: 'Identity confirmed', when: 'Yesterday' },
    { app: 'Kilima HR portal', what: 'Identity confirmed, employer', when: 'Mon' },
  ])

  const share = () => {
    setDecision('shared')
    setLog((l) => [{ app: callApp, what: employer ? 'Identity confirmed, employer' : 'Identity confirmed', when: 'Just now' }, ...l])
  }

  return (
    <div className="step-split">
      <div className="step-copy">
        <h2>Her wallet decides what each app learns</h2>
        <p>
          Before the payments call, {callApp} asks Proofline to confirm it's really Amara joining. She sees exactly who's
          asking, what they'll learn and what stays private.
        </p>
        {notesOn && (
        <ul className="design-notes" aria-label="Design notes">
          <li>"What they see" and "What they never see" sit side by side on every request.</li>
          <li>Optional details are off-by-default switches she can see and change.</li>
          <li>A share log answers "who knows what about me?" at any time.</li>
        </ul>
        )}
        <Spot n={3} title="Recovery kills the old phone first" note="Losing a phone shouldn't mean losing your identity to whoever finds it. Cancelling is one step with an in-page confirmation, and getting back in needs a face-to-face check.">
          <LostPhone />
        </Spot>
      </div>

      <Phone label="Amara's phone, Proofline wallet" owner="Amara's phone">
        <div className="wallet">
          {decision === 'pending' ? (
            <div className="request">
              <p className="request-from">
                <span className="app-dot" aria-hidden="true">H</span>
                <span>
                  <strong>{callApp}</strong> wants to confirm it's you joining "Q4 payments sync"
                </span>
              </p>
              <Spot n={1} title="Consent before sharing, not after" note="'They'll see' and 'They'll never see' sit side by side on every request, before Amara agrees. The never-see list grows as she switches things off.">
              <div className="request-split">
                <div>
                  <h3>
                    <EyeIcon size={16} /> They'll see
                  </h3>
                  <ul>
                    <li>Identity confirmed: Amara Njoroge</li>
                    {employer && <li>Works at {company}</li>}
                  </ul>
                </div>
                <div className="never">
                  <h3>
                    <EyeOffIcon size={16} /> They'll never see
                  </h3>
                  <ul>
                    <li>ID number or photo</li>
                    <li>Date of birth, address</li>
                    {!employer && <li>Your employer</li>}
                  </ul>
                </div>
              </div>
              </Spot>
              <Spot n={2} title="Off by default" place="tl" note="Anything beyond the yes/no answer is an extra she has to switch on. The safest choice is the one that takes no effort.">
              <label className="switch">
                <input type="checkbox" checked={employer} onChange={(e) => setEmployer(e.target.checked)} />
                <span className="switch-track" aria-hidden="true" />
                <span>Also share my employer</span>
              </label>
              </Spot>
              <div className="request-actions">
                <button type="button" className="btn btn-primary btn-block" onClick={share} data-tour="wallet-share">
                  Share with {callApp}
                </button>
                <button type="button" className="btn btn-quiet btn-block" onClick={() => setDecision('declined')}>
                  Don't share
                </button>
              </div>
            </div>
          ) : (
            <div className="request-done" aria-live="polite">
              {decision === 'shared' ? (
                <>
                  <Badge kind="identity" />
                  <p>Shared with {callApp}. Others on the call now see you're confirmed.</p>
                </>
              ) : (
                <p>
                  Not shared. You'll still join, but others will see "Can't confirm identity" next to your name.{' '}
                  <button type="button" className="link-btn" onClick={() => setDecision('pending')}>
                    Review again
                  </button>
                </p>
              )}
            </div>
          )}

          <h3 className="wallet-h">Your proofs</h3>
          <div className="cred-cards">
            <div className="cred cred-identity">
              <Badge kind="identity" size="sm" />
              <p className="cred-name">Amara Njoroge</p>
              <p className="cred-sub">{company}, verified 12 Oct</p>
            </div>
            <div className="cred cred-human">
              <Badge kind="human" size="sm" />
              <p className="cred-name">Over 18</p>
              <p className="cred-sub">Shareable without your name</p>
            </div>
          </div>

          <h3 className="wallet-h">Who you've shared with</h3>
          <ul className="share-log">
            {log.map((s) => (
              <li key={s.app + s.when}>
                <span>
                  <strong>{s.app}</strong>
                  <span className="log-what">{s.what}</span>
                </span>
                <span className="log-when">{s.when}</span>
              </li>
            ))}
          </ul>

          {decision !== 'pending' && (
            <button type="button" className="btn btn-primary btn-block" onClick={onDone} data-tour="wallet-join">
              Join the call
            </button>
          )}
        </div>
      </Phone>
    </div>
  )
}

/** What happens when a phone is lost or stolen: cancel it, then re-verify in person. */
function LostPhone() {
  const [state, setState] = useState<'idle' | 'confirm' | 'cancelled'>('idle')
  return (
    <section className="lost" aria-labelledby="lost-h" aria-live="polite">
      <h3 id="lost-h">
        <PhoneIcon size={18} /> Lost your phone?
      </h3>
      {state === 'idle' && (
        <>
          <p>
            Amara can cancel it from any browser or at the security desk. Whoever has the old phone can't use it to prove
            they're her.
          </p>
          <button type="button" className="btn btn-quiet" onClick={() => setState('confirm')}>
            Cancel Amara's old phone
          </button>
        </>
      )}
      {state === 'confirm' && (
        <>
          <p>
            <strong>Cancel Proofline on the old phone?</strong> This can't be undone. She'll verify again in person, on her
            new phone, with her ID.
          </p>
          <div className="lost-actions">
            <button type="button" className="btn btn-stop" onClick={() => setState('cancelled')}>
              Yes, cancel it
            </button>
            <button type="button" className="btn btn-quiet" onClick={() => setState('idle')}>
              Keep it
            </button>
          </div>
        </>
      )}
      {state === 'cancelled' && (
        <>
          <Badge kind="identity" status="cant" size="sm" reason="Old phone cancelled" />
          <p>
            <strong>Old phone cancelled.</strong> Any app that checks it now sees "Can't confirm identity". Next: visit the
            security desk with her ID to set up the new phone.
          </p>
          <button type="button" className="link-btn" onClick={() => setState('idle')}>
            Reset this demo
          </button>
        </>
      )}
    </section>
  )
}
