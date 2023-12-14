import React from 'react'
import ReactDOM from 'react-dom/client'
import { Popup } from './Popup'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '../assets/global.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)
