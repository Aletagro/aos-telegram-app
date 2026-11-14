import React from 'react'
import ReactDOM from 'react-dom/client'
import bridge from '@vkontakte/vk-bridge'
import {HashRouter} from 'react-router-dom'
import Splash from './screens/Splash'

const {loadDatabase} = require('./utilities/db')

bridge.send('VKWebAppInit')
  .then((data) => {
    if (data.result) {
      console.log('VK Bridge успешно инициализирован')
    }
  })
  .catch((error) => console.error('Ошибка инициализации VK:', error))

const root = ReactDOM.createRoot(document.getElementById('root'))

// Приложение подгружается после базы данных: его модули работают с данными сразу при запуске
const start = () => {
  root.render(<Splash progress={0} />)
  loadDatabase((progress) => root.render(<Splash progress={progress} />))
    .then(() => import('./App'))
    .then(({default: App}) => root.render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>
    ))
    .catch((error) => {
      console.error(error)
      root.render(<Splash progress={0} hasError onRetry={start} />)
    })
}

start()
