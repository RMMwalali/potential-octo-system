import { useId } from 'react'
import { LangToggle } from '../i18n'
import { DisplayMenu, DisplaySwitches, useMenu } from './A11yPanel'
import { NotesToggle } from './Notes'

/**
 * Notes, language and display settings. Wide screens show them inline;
 * phones fold them into one Settings menu so the header stays a single row.
 */
export function HeaderTools() {
  const { open, setOpen, btn, panel } = useMenu()
  const panelId = useId()

  return (
    <div className="header-tools">
      <div className="tools-inline">
        <NotesToggle />
        <LangToggle />
        <DisplayMenu />
      </div>

      <div className="tools-compact">
        <button
          type="button"
          ref={btn}
          className="settings-btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 7h10M18 7h2M4 17h4M12 17h8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="16" cy="7" r="2.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <circle cx="10" cy="17" r="2.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
          </svg>
          Settings
        </button>
        {open && (
          <div className="display-panel settings-panel" id={panelId} ref={panel} role="dialog" aria-label="Settings">
            <p className="display-title">Language</p>
            <LangToggle />
            <p className="display-title">For reviewers</p>
            <NotesToggle onToggle={() => setOpen(false)} />
            <p className="display-title">Display</p>
            <DisplaySwitches idPrefix="m-a11y" />
          </div>
        )}
      </div>
    </div>
  )
}
