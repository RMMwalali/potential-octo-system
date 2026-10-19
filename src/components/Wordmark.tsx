export function Wordmark({ small }: { small?: boolean }) {
  return (
    <span className={`wordmark ${small ? 'wordmark-small' : ''}`}>
      <svg viewBox="0 0 32 32" width={small ? 22 : 28} height={small ? 22 : 28} aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="currentColor" />
        <path
          d="M16 5.5 25 9v6.6c0 5.6-3.8 9.6-9 11-5.2-1.4-9-5.4-9-11V9z"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="m11.6 16.2 3.1 3.1 5.8-6.2" fill="none" stroke="var(--paper)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="wordmark-text">Proofline</span>
    </span>
  )
}
