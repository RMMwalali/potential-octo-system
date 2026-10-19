import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight'
import '@fontsource/bowlby-one'
import '@fontsource/nothing-you-could-do'
import './index.css'
import App from './App'
import { applyPrefs, readPrefs } from './a11y'

// Apply saved display settings before the first paint.
applyPrefs(readPrefs())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
