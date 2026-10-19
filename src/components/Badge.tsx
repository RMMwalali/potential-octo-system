import { useEffect, useId, useRef, useState } from 'react'
import { useT, type Key } from '../i18n'
import { HumanMark, ReceiptMark, ShieldMark, StopMark } from './icons'

export type BadgeKind = 'identity' | 'human' | 'purchase' | 'stopped' | 'flagged'
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

const labelKey = (kind: BadgeKind, status: BadgeStatus): Key => {
  if (kind === 'stopped') return 'badge.stopped'
  if (kind === 'flagged') return 'badge.flagged'
  if (kind === 'purchase') return 'badge.purchase'
  if (kind === 'human') return 'badge.human'
  if (status === 'checking') return 'badge.checking'
  if (status === 'cant') return 'badge.cant'
  return 'badge.identity'
}

export function Badge({ kind, status = 'confirmed', subject, explain, size = 'md', reason }: Props) {
  const [open, setOpen] = useState(false)
  const popId = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const { t } = useT()
  const text = t(labelKey(kind, status))
  const tone =
    kind === 'stopped' || kind === 'flagged' ? 'stop' : status === 'cant' ? 'warn' : status === 'checking' ? 'wait' : 'ok'

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

  const srText = subject ? t('badge.for', { label: text, who: subject }) : text
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

  const ex = { proves: t(`ex.${kind}.p` as Key), doesnt: t(`ex.${kind}.d` as Key) }
  return (
    <span className="badge-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`badge badge-${tone} badge-${size} badge-button`}
        aria-expanded={open}
        aria-controls={popId}
        aria-label={`${srText}. ${t('badge.ask')}`}
        onClick={() => setOpen((o) => !o)}
      >
        {body}
      </button>
      {open && (
        <span className="badge-pop" id={popId} role="dialog" aria-label={`${t('pop.proves')}: ${text}`}>
          <span className="pop-row">
            <strong>{t('pop.proves')}</strong>
            <span>{ex.proves}</span>
          </span>
          <span className="pop-row">
            <strong>{t('pop.doesnt')}</strong>
            <span>{ex.doesnt}</span>
          </span>
        </span>
      )}
    </span>
  )
}
