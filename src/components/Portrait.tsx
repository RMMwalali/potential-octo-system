import type { Person } from '../data'

/**
 * An illustrated stand-in for a webcam feed. Deliberately not a photo:
 * the people in this demo are fictional and we don't use real faces.
 */
export function Portrait({ person, hair = 'short' }: { person: Person; hair?: 'short' | 'long' | 'bald' }) {
  return (
    <svg className="portrait" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="200" fill={person.backdrop} />
      {/* a window and a shelf, so the room reads as an office */}
      <rect x="208" y="26" width="84" height="96" rx="4" fill="#fff" opacity="0.5" />
      <path d="M250 26v96M208 74h84" stroke={person.backdrop} strokeWidth="4" />
      <rect x="22" y="58" width="70" height="6" rx="3" fill="#000" opacity="0.08" />
      <rect x="30" y="40" width="12" height="18" rx="2" fill="#000" opacity="0.07" />
      <rect x="46" y="34" width="10" height="24" rx="2" fill="#000" opacity="0.1" />
      <g className="portrait-body">
        <path d="M86 200c4-40 34-62 74-62s70 22 74 62z" fill={person.shirt} />
        <path d="M146 120h28v24c-4 6-24 6-28 0z" fill={person.skin} />
        <path d="M146 140c4 8 24 8 28 0l6 6c-8 10-32 10-40 0z" fill="#fff" opacity="0.18" />
        <ellipse cx="160" cy="92" rx="34" ry="40" fill={person.skin} />
        {hair === 'short' && <path d="M126 86c0-28 16-40 34-40s34 12 34 40c-6-14-18-20-34-20s-28 6-34 20z" fill="#1E1410" />}
        {hair === 'long' && (
          <path
            d="M122 96c-4-34 14-54 38-54s42 20 38 54c-2 18 4 30 10 38-14 4-24-4-28-14 2-16-2-34-20-40-18 6-22 24-20 40-4 10-14 18-28 14 6-8 12-20 10-38z"
            fill="#1E1410"
          />
        )}
        {hair === 'bald' && <path d="M128 80c4-20 16-30 32-30s28 10 32 30c-8-8-18-12-32-12s-24 4-32 12z" fill="#000" opacity="0.18" />}
        <ellipse cx="147" cy="94" rx="3.2" ry="3.6" fill="#1E1410" />
        <ellipse cx="173" cy="94" rx="3.2" ry="3.6" fill="#1E1410" />
        <path d="M150 112c6 4 14 4 20 0" stroke="#1E1410" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
    </svg>
  )
}
