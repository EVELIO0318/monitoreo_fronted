import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MonitoreoApp } from './MonitoreoApp'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MonitoreoApp/>
  </StrictMode>,
)
