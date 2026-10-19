import { useEffect, useId, useRef, useState } from 'react'
import { HumanMark, ReceiptMark, ShieldMark, StopMark } from './icons'

export type BadgeKind = 'identity' | 'human' | 'purchase' | 'stopped'
export type BadgeStatus = 'confirmed' | 'checking' | 'cant'

type Props = {
  kind: BadgeKind
  status?: BadgeStatus
  /** Who the badge is about, for screen readers ("Identity confirmed for David Otieno"). */
  subject?: string
  /** Show a small "What does this prove?" popover on tap. */
  explain?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** One short line shown under the label, e.g. the reason identity can't be confirmed. */
  reason?: string
}

const label = (kind: BadgeKind, status: BadgeStatus) => {
  if (kind === 'stopped') return 'Payment stopped'
  if (kind === 'purchase') return 'Verified purchase'
  if (kind === 'human') return 'Real person'
  if (status === 'checking') return 'Checking identity'
  if (status === 'cant') return "Can't confirm identity"
  return 'Identity confirmed'
}

const explainers: Record<BadgeKind, { proves: string; doesnt: string }> = {
  identity: {
    proves: 'This is the named person, on the phone they registered when they verified.',
    doesnt: 'It never shows their ID document, address or date of birth.',
  },
  human: {
    proves: 'A real, unique person made this account. It is not a bot or a duplicate.',
    doesnt: 'It does not say who they are. Their name stays private unless they share it.',
  },
  purchase: {
    proves: 'The person who wrote this paid for the item from this seller.',
    doesnt: 'It does not reveal what else they bought or how they paid.',
  },
  stopped: {
    proves: 'The person who must approve this payment said they did not ask for it.',
    doesnt: 'No money has moved.',
  },
}

export function Badge({ kind, status = 'confirmed', subject, explain, size = 'md', reason }: Props) {
  const [open, setOpen] = useState(false)
  const popId = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const text = label(kind, status)
  const tone =
    kind === 'stopped' ? 'stop' : status === 'cant' ? 'warn' : status === 'checking' ? 'wait' : 'ok'

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [open])

  const iconSize = size === 'lg' ? 26 : size === 'sm' ? 15 : 19
  const icon =
    kind === 'identity' ? (
      <ShieldMark size={iconSize} mark={status === 'confirmed' ? 'check' : status === 'cant' ? 'question' : 'dots'} />
    ) : kind === 'human' ? (
      <HumanMark size={iconSize} />
    ) : kind === 'purchase' ? (
      <ReceiptMark size={iconSize} />
    ) : (
      <StopMark size={iconSize} />
    )

  const srText = subject ? `${text} for ${subject}` : text
  const body = (
    <>
      <span className={`badge-icon ${status === 'checking' ? 'is-checking' : ''}`}>{icon}</span>
      <span className="badge-text">
        <span className="badge-label">{text}</span>
        {reason && <span className="badge-reason">{reason}</span>}
      </span>
    </>
  )

  if (!explain) {
    return (
      <span className={`badge badge-${tone} badge-${size}`} role="status" aria-label={srText + (reason ? `. ${reason}` : '')}>
        {body}
      </span>
    )
  }

  const ex = explainers[kind]
  return (
    <span className="badge-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`badge badge-${tone} badge-${size} badge-button`}
        aria-expanded={open}
        aria-controls={popId}
        aria-label={`${srText}. What does this prove?`}
        onClick={() => setOpen((o) => !o)}
      >
        {body}
      </button>
      {open && (
        <span className="badge-pop" id={popId} role="dialog" aria-label={`What "${text}" proves`}>
          <span className="pop-row">
            <strong>What this proves</strong>
            <span>{ex.proves}</span>
          </span>
          <span className="pop-row">
            <strong>What it doesn't share</strong>
            <span>{ex.doesnt}</span>
          </span>
        </span>
      )}
    </span>
  )
}
