import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// App is a JavaScript module without TypeScript declarations.
// @ts-expect-error TS7016: the JavaScript module is intentionally untyped.
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
