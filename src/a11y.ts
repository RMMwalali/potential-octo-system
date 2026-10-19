import { useEffect, useState } from 'react'

/** Visitor-chosen display settings, applied as classes on <html>. */
export type A11yPrefs = { largeText: boolean; contrast: boolean; still: boolean }

const KEY = 'proofline-a11y'
const defaults: A11yPrefs = { largeText: false, contrast: false, still: false }

export function readPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

export function applyPrefs(p: A11yPrefs) {
  const c = document.documentElement.classList
  c.toggle('a11y-large-text', p.largeText)
  c.toggle('a11y-contrast', p.contrast)
  c.toggle('a11y-still', p.still)
}

export function savePrefs(p: A11yPrefs) {
  applyPrefs(p)
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* storage blocked: settings last for this page view only */
  }
  window.dispatchEvent(new CustomEvent('a11y-change'))
}

/** True when the device asks for reduced motion, or the visitor turned motion off here. */
export function isStill() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-still')
  )
}

/** Re-renders when either source of "reduce motion" changes. */
export function useStill() {
  const [still, setStill] = useState(isStill)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setStill(isStill())
    mq.addEventListener('change', on)
    window.addEventListener('a11y-change', on)
    return () => {
      mq.removeEventListener('change', on)
      window.removeEventListener('a11y-change', on)
    }
  }, [])
  return still
}
