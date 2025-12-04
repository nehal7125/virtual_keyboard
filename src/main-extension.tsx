import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExtensionApp from './ExtensionApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExtensionApp />
  </StrictMode>,
)

