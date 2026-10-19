import { useEffect, useState } from 'react'
import { Demo } from './pages/Demo'
import { Landing } from './pages/Landing'
import { TourProvider } from './components/Tour'

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

  return (
    <TourProvider>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to content
      </a>
      {route.page === 'demo' ? <Demo step={route.step} /> : <Landing />}
    </TourProvider>
  )
}
