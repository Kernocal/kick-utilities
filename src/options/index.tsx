import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Options'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '../assets/global.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
