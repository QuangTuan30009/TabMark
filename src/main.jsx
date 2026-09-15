import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { initGoogleAuth } from './lib/googleAuth'

// Khởi tạo sớm Google Auth cho Native Credential Manager trên Android & Web
initGoogleAuth()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
