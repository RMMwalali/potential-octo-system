import { useState } from 'react'
import { Phone } from '../../components/Phone'
import { FaceScanIcon, IdCardIcon, LockIcon, WalletIcon } from '../../components/icons'
import { Badge } from '../../components/Badge'

const stages = ['Scan your ID', 'Take a quick selfie', 'Saved to your wallet'] as const

export function Verify({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0)
  const [busy, setBusy] = useState(false)
  const [alt, setAlt] = useState(false)

  const run = () => {
    setBusy(true)
    const ms = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 1400
    setTimeout(() => {
      setBusy(false)
      setStage((s) => s + 1)
    }, ms)
  }

  return (
    <div className="step-split">
      <div className="step-copy">
        <h2>Amara verifies once, on her own phone</h2>
        <p>
          Kilima Freight asks every finance staff member to set up Proofline. It takes about a minute, and nothing she
          scans is uploaded.
        </p>
        <ul className="design-notes" aria-label="Design notes">
          <li>One task per screen, with progress shown in words and as a bar.</li>
          <li>Every step says where the data goes before Amara agrees.</li>
          <li>No passport? There's a path for that too.</li>
        </ul>
      </div>

      <Phone label="Amara's phone, Proofline setup" owner="Amara's phone">
        <div className="setup">
          <div className="setup-progress" aria-hidden="true">
            {stages.map((s, i) => (
              <span key={s} className={i <= stage ? 'on' : ''} />
            ))}
          </div>
          <p className="setup-count" aria-live="polite">
            Step {Math.min(stage + 1, 3)} of 3: {stages[Math.min(stage, 2)]}
          </p>

          {stage === 0 && (
            <div className="setup-body">
              <div className={`scan-frame ${busy ? 'is-busy' : ''}`}>
                <IdCardIcon size={64} />
                <span className="scan-line" aria-hidden="true" />
              </div>
              <h3>Hold your national ID or passport inside the frame</h3>
              <PrivacyNote>Your ID is read on this phone. Proofline's servers never receive a copy.</PrivacyNote>
              <button type="button" className="btn btn-primary btn-block" onClick={run} disabled={busy}>
                {busy ? 'Reading your ID…' : 'Scan ID'}
              </button>
              <button type="button" className="link-btn" aria-expanded={alt} onClick={() => setAlt((a) => !a)}>
                I don't have an ID with me
              </button>
              {alt && (
                <div className="alt-path">
                  <IdCardIcon size={16} />
                  <p>
                    <strong>Verify in person instead.</strong> Visit your company's security desk, where a trained staff
                    member checks your ID face to face and links Proofline to this phone. Until then, you'll show as
                    "Can't confirm identity".
                  </p>
                </div>
              )}
            </div>
          )}

          {stage === 1 && (
            <div className="setup-body">
              <div className={`face-frame ${busy ? 'is-busy' : ''}`}>
                <FaceScanIcon size={64} />
              </div>
              <h3>Look at the camera and turn your head slowly</h3>
              <PrivacyNote>This checks you're a live person who matches the ID. The selfie is deleted right after.</PrivacyNote>
              <button type="button" className="btn btn-primary btn-block" onClick={run} disabled={busy}>
                {busy ? 'Checking it matches…' : 'Start selfie check'}
              </button>
            </div>
          )}

          {stage >= 2 && (
            <div className="setup-body">
              <div className="saved-mark">
                <WalletIcon size={40} />
              </div>
              <h3>You're verified, Amara</h3>
              <p className="setup-sub">Your proof is sealed to this phone. Apps can ask about it, and you decide what they see.</p>
              <div className="saved-badges">
                <Badge kind="identity" />
                <Badge kind="human" />
              </div>
              <button type="button" className="btn btn-primary btn-block" onClick={onDone}>
                Open my wallet
              </button>
            </div>
          )}
        </div>
      </Phone>
    </div>
  )
}

function PrivacyNote({ children }: { children: string }) {
  return (
    <p className="privacy-note">
      <LockIcon size={16} />
      <span>{children}</span>
    </p>
  )
}
