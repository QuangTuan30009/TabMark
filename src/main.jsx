import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { initGoogleAuth } from './lib/googleAuth'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Khởi tạo sớm Google Auth cho Web
initGoogleAuth()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>,
)
