import { useEffect, useId, useRef, useState } from 'react'
import { readPrefs, savePrefs, type A11yPrefs } from '../a11y'
import { useTour } from './Tour'

const options: { key: keyof A11yPrefs; label: string; hint: string }[] = [
  { key: 'largeText', label: 'Bigger text', hint: 'Makes all text about 15% larger.' },
  { key: 'contrast', label: 'High contrast', hint: 'Darker text, stronger outlines, no paper texture.' },
  { key: 'still', label: 'Turn off motion', hint: 'Stops the 3D scene, scrolling effects and the moving banner.' },
]

export function A11yPanel() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs>(readPrefs)
  const panelId = useId()
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const { playing } = useTour()

  const set = (k: keyof A11yPrefs, v: boolean) => {
    const next = { ...prefs, [k]: v }
    setPrefs(next)
    savePrefs(next)
  }

  // Focus the panel when it opens; Esc or a click outside closes it and returns focus.
  useEffect(() => {
    if (!open) return
    panel.current?.querySelector<HTMLInputElement>('input')?.focus()
    const close = () => {
      setOpen(false)
      btn.current?.focus()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
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

  const active = Object.values(prefs).filter(Boolean).length

  return (
    <div className={`a11y ${playing ? 'is-tour' : ''}`}>
      {open && (
        <div className="a11y-panel" id={panelId} ref={panel} role="dialog" aria-label="Display settings">
          <p className="a11y-title">Display settings</p>
          {options.map((o) => (
            <label key={o.key} className="switch a11y-row" htmlFor={`a11y-${o.key}`}>
              <input id={`a11y-${o.key}`} type="checkbox" checked={prefs[o.key]} onChange={(e) => set(o.key, e.target.checked)} />
              <span className="switch-track" aria-hidden="true" />
              <span className="a11y-text">
                <span>{o.label}</span>
                <span className="a11y-hint">{o.hint}</span>
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
              Reset to default
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        ref={btn}
        className="a11y-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path
            d="M4.5 8.2c2.4.7 4.9 1 7.5 1s5.1-.3 7.5-1M12 9.2v5.3M12 14.5l-3.2 6M12 14.5l3.2 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="a11y-btn-label">Display{active > 0 ? ` (${active} on)` : ''}</span>
      </button>
    </div>
  )
}
