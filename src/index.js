import React from 'react'
import ReactDOM from 'react-dom/client'
// import bridge from '@vkontakte/vk-bridge'
import {HashRouter} from 'react-router-dom'
import App from './App'

// bridge.send("VKWebAppInit")

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
