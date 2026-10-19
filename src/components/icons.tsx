type P = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

/** Identity: a shield. The mark inside changes with the result. */
export function ShieldMark({ size = 20, mark }: P & { mark: 'check' | 'question' | 'dots' }) {
  return (
    <svg {...base(size)}>
      <path d="M12 2.8 19.5 5.6v5.6c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V5.6z" />
      {mark === 'check' && <path d="m8.6 12 2.4 2.4 4.6-4.9" />}
      {mark === 'question' && (
        <>
          <path d="M10 9.4a2.1 2.1 0 1 1 3 1.9c-.6.3-1 .8-1 1.5v.4" />
          <path d="M12 16h.01" strokeWidth={2.6} />
        </>
      )}
      {mark === 'dots' && (
        <>
          <path d="M8.8 12h.01M12 12h.01M15.2 12h.01" strokeWidth={2.6} />
        </>
      )}
    </svg>
  )
}

/** Human: a circle with a person's head and shoulders. */
export function HumanMark({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="9.2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7.4 17.6c1-2 2.7-3 4.6-3s3.6 1 4.6 3" />
    </svg>
  )
}

/** Purchase: a receipt with a tick. */
export function ReceiptMark({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z" />
      <path d="m9.2 11.6 2 2 3.8-4" />
    </svg>
  )
}

/** Stopped: an octagon with a bar. */
export function StopMark({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M8.2 2.8h7.6l5.4 5.4v7.6l-5.4 5.4H8.2l-5.4-5.4V8.2z" />
      <path d="M8 12h8" />
    </svg>
  )
}

export function PhoneIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
      <path d="M11 18.5h2" />
    </svg>
  )
}

export function LockIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  )
}

export function EyeOffIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.6 9.6 0 0 1 12 5c5 0 8.5 4.6 9.4 7a12 12 0 0 1-2.6 3.8M6.4 6.6C4.4 8 3.1 10 2.6 12c.9 2.4 4.4 7 9.4 7 1.6 0 3-.4 4.2-1.1" />
      <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
    </svg>
  )
}

export function EyeIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M2.6 12C3.5 9.6 7 5 12 5s8.5 4.6 9.4 7c-.9 2.4-4.4 7-9.4 7s-8.5-4.6-9.4-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function MicOffIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3 3l18 18" />
      <path d="M9 9v3a3 3 0 0 0 5.1 2.1M15 10V5a3 3 0 0 0-5.7-1.3" />
      <path d="M18.6 12a6.6 6.6 0 0 1-1 3.4M5.4 12a6.6 6.6 0 0 0 10 5.6M12 18.6V21" />
    </svg>
  )
}

export function CameraIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="2.5" y="6.5" width="13" height="11" rx="2" />
      <path d="m15.5 10.5 6-3.5v10l-6-3.5" />
    </svg>
  )
}

export function HangUpIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3 14.6c5-4.8 13-4.8 18 0l-2.4 2.4-3.3-1.6v-2.6a12 12 0 0 0-6.6 0v2.6L5.4 17z" />
    </svg>
  )
}

export function IdCardIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="2" />
      <path d="M5.6 16c.6-1.3 1.7-2 2.9-2s2.3.7 2.9 2M14 10h4.5M14 13.5h3" />
    </svg>
  )
}

export function FaceScanIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.6} />
      <path d="M9.2 15c.8.8 1.7 1.2 2.8 1.2s2-.4 2.8-1.2" />
    </svg>
  )
}

export function WalletIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 7.5h15a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5h12" />
      <path d="M16.5 13.5h.01" strokeWidth={2.8} />
    </svg>
  )
}

export function ArrowLeft({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function ArrowRight({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function UsersIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 19c.8-3 3.2-4.6 6-4.6s5.2 1.6 6 4.6" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.6c1.8.6 3 2 3.5 4.4" />
    </svg>
  )
}
