import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'

/**
 * Designer's notes: numbered pins on each screen that explain the UX decision
 * behind that part. Off by default; written for judges and reviewers.
 */
type Ctx = { on: boolean; toggle: () => void; openId: string | null; setOpenId: (id: string | null) => void }
const NotesCtx = createContext<Ctx | null>(null)
export const useNotes = () => useContext(NotesCtx)!

export function NotesProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = () => {
    setOn((v) => !v)
    setOpenId(null)
  }
  // Close any open note when the route changes.
  useEffect(() => {
    const close = () => setOpenId(null)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])
  return <NotesCtx.Provider value={{ on, toggle, openId, setOpenId }}>{children}</NotesCtx.Provider>
}

export function NotesToggle({ className = '', onToggle }: { className?: string; onToggle?: () => void }) {
  const { on, toggle: flip } = useNotes()
  const toggle = () => {
    flip()
    onToggle?.()
  }
  return (
    <button
      type="button"
      className={`notes-toggle ${className}`}
      aria-pressed={on}
      aria-label="Designer's notes"
      onClick={toggle}
    >
      <span className="notes-toggle-dot" aria-hidden="true">
        {on ? '✓' : 'i'}
      </span>
      <span className="notes-long" aria-hidden="true">
        Designer's notes
      </span>
      <span className="notes-short" aria-hidden="true">
        Notes
      </span>
    </button>
  )
}

/** Wrap any element; with notes on, a numbered pin sits on its top-right corner. */
export function Spot({
  n,
  title,
  children,
  note,
  as = 'div',
  place = 'tr',
}: {
  n: number
  title: string
  note: string
  children: ReactNode
  as?: 'div' | 'span'
  place?: 'tr' | 'tl' | 'br'
}) {
  const { on, openId, setOpenId } = useNotes()
  const id = useId()
  const open = on && openId === id
  const wrap = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null)
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.querySelector('.spot-ui')?.contains(e.target as Node)) setOpenId(null)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [open, setOpenId])

  const Tag = as
  return (
    <Tag className={`spot ${on ? 'is-on' : ''}`} ref={wrap as never}>
      {children}
      {on && (
        <span className={`spot-ui spot-${place}`}>
          <button
            type="button"
            className="spot-pin"
            aria-expanded={open}
            aria-controls={`${id}-note`}
            aria-label={`Designer's note ${n}: ${title}`}
            onClick={() => setOpenId(open ? null : id)}
          >
            {n}
          </button>
          {open && (
            <span className="spot-card" id={`${id}-note`} role="note">
              <strong>{title}</strong>
              <span>{note}</span>
            </span>
          )}
        </span>
      )}
    </Tag>
  )
}
