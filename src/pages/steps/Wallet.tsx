import { useState } from 'react'
import { Phone } from '../../components/Phone'
import { EyeIcon, EyeOffIcon } from '../../components/icons'
import { Badge } from '../../components/Badge'
import { callApp, company } from '../../data'

type Share = { app: string; what: string; when: string }

export function Wallet({ onDone }: { onDone: () => void }) {
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
        <ul className="design-notes" aria-label="Design notes">
          <li>"What they see" and "What they never see" sit side by side on every request.</li>
          <li>Optional details are off-by-default switches she can see and change.</li>
          <li>A share log answers "who knows what about me?" at any time.</li>
        </ul>
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
              <label className="switch">
                <input type="checkbox" checked={employer} onChange={(e) => setEmployer(e.target.checked)} />
                <span className="switch-track" aria-hidden="true" />
                <span>Also share my employer</span>
              </label>
              <div className="request-actions">
                <button type="button" className="btn btn-primary btn-block" onClick={share}>
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
            <button type="button" className="btn btn-primary btn-block" onClick={onDone}>
              Join the call
            </button>
          )}
        </div>
      </Phone>
    </div>
  )
}
