import type { ReactNode } from 'react'

export function Phone({ children, label, owner }: { children: ReactNode; label: string; owner?: string }) {
  return (
    <div className="phone" role="group" aria-label={label}>
      <div className="phone-bar" aria-hidden="true">
        <span>9:41</span>
        <span className="phone-notch" />
        <span className="phone-sig">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="phone-screen">{children}</div>
      {owner && <p className="phone-owner">{owner}</p>}
    </div>
  )
}
