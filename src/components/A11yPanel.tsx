import { useEffect, useId, useRef, useState } from 'react'
import { readPrefs, savePrefs, type A11yPrefs } from '../a11y'

const options: { key: keyof A11yPrefs; label: string; hint: string }[] = [
  { key: 'largeText', label: 'Bigger text', hint: 'Makes all text about 15% larger.' },
  { key: 'contrast', label: 'High contrast', hint: 'Darker text, stronger outlines, no paper texture.' },
  { key: 'still', label: 'Turn off motion', hint: 'Stops the 3D scene and other animation.' },
]

/** The three display switches, used in the header dropdown and the phone settings menu. */
export function DisplaySwitches({ idPrefix = 'a11y' }: { idPrefix?: string }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(readPrefs)
  const set = (k: keyof A11yPrefs, v: boolean) => {
    const next = { ...prefs, [k]: v }
    setPrefs(next)
    savePrefs(next)
  }
  useEffect(() => {
    const on = () => setPrefs(readPrefs())
    window.addEventListener('a11y-change', on)
    return () => window.removeEventListener('a11y-change', on)
  }, [])
  const active = Object.values(prefs).filter(Boolean).length
  return (
    <>
      {options.map((o) => (
        <label key={o.key} className="switch display-row" htmlFor={`${idPrefix}-${o.key}`}>
          <input id={`${idPrefix}-${o.key}`} type="checkbox" checked={prefs[o.key]} onChange={(e) => set(o.key, e.target.checked)} />
          <span className="switch-track" aria-hidden="true" />
          <span className="display-text">
            <span>{o.label}</span>
            <span className="display-hint">{o.hint}</span>
          </span>
        </label>
      ))}
      {active > 0 && (
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            const off = { largeText: false, contrast: false, still: false }
            setPrefs(off)
            savePrefs(off)
          }}
        >
          Reset display settings
        </button>
      )}
    </>
  )
}

/** Keeps a menu open/closed with Esc and outside clicks, and focuses its first control. */
export function useMenu() {
  const [open, setOpen] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    panel.current?.querySelector<HTMLElement>('input, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [open])
  return { open, setOpen, btn, panel }
}

/** Display settings, opened from a header button so nothing floats over the page. */
export function DisplayMenu() {
  const { open, setOpen, btn, panel } = useMenu()
  const [prefs, setPrefs] = useState<A11yPrefs>(readPrefs)
  const panelId = useId()
  useEffect(() => {
    const on = () => setPrefs(readPrefs())
    window.addEventListener('a11y-change', on)
    return () => window.removeEventListener('a11y-change', on)
  }, [])

  const active = Object.values(prefs).filter(Boolean).length

  return (
    <div className="display-menu">
      <button
        type="button"
        ref={btn}
        className="display-btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Display settings${active ? `, ${active} on` : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path
            d="M4.5 8.2c2.4.7 4.9 1 7.5 1s5.1-.3 7.5-1M12 9.2v5.3M12 14.5l-3.2 6M12 14.5l3.2 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        {active > 0 && (
          <span className="display-count" aria-hidden="true">
            {active}
          </span>
        )}
      </button>
      {open && (
        <div className="display-panel" id={panelId} ref={panel} role="dialog" aria-label="Display settings">
          <p className="display-title">Display settings</p>
          <DisplaySwitches />
        </div>
      )}
    </div>
  )
}
