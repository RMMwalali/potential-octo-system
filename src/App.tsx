import { lazy, Suspense, useEffect, useState } from 'react'
import { TourProvider } from './components/Tour'
import { A11yPanel } from './components/A11yPanel'
import { LangProvider } from './i18n'
import { NotesProvider } from './components/Notes'

const loadDemo = () => import('./pages/Demo')
const Demo = lazy(() => loadDemo().then((m) => ({ default: m.Demo })))
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })))

type Route = { page: 'landing' } | { page: 'demo'; step: number }

const parse = (): Route => {
  const m = window.location.hash.match(/^#\/demo\/(\d)/)
  if (m) return { page: 'demo', step: Math.min(5, Math.max(1, Number(m[1]))) }
  return { page: 'landing' }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parse)

  useEffect(() => {
    const on = () => {
      const next = parse()
      // In-page anchors (#signals, #privacy) shouldn't reset the landing page.
      if (next.page === 'landing' && route.page === 'landing') return
      setRoute(next)
      if (next.page === 'landing') window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [route.page])

  // Fetch the demo in the background once the landing page is idle,
  // so "Try the demo" opens instantly.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const idle = (cb: () => void) => (w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 3000 }) : setTimeout(cb, 1500))
    idle(() => void loadDemo())
  }, [])

  return (
    <LangProvider>
    <NotesProvider>
    <TourProvider>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to content
      </a>
      <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
        {route.page === 'demo' ? <Demo step={route.step} /> : <Landing />}
      </Suspense>
      <A11yPanel />
    </TourProvider>
    </NotesProvider>
    </LangProvider>
  )
}
