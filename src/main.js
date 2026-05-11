import './assets/main.css'

import { createApp } from 'vue'
import App from './components/App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

function setupTelegramWebApp() {
  const webApp = window.Telegram?.WebApp
  if (!webApp) return
  webApp.ready()
  webApp.expand()
  webApp.disableVerticalSwipes()
}

function disableZoomGestures() {
  let lastTouchEnd = 0
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    { passive: false }
  )

  document.addEventListener(
    'gesturestart',
    (event) => {
      event.preventDefault()
    },
    { passive: false }
  )
}

setupTelegramWebApp()
disableZoomGestures()

app.mount('#app')