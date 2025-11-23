import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './stores'
import './style.css'
import { setupTelegram } from './lib/telegram'
import { setupI18nPlugin } from './i18n/plugin'

async function bootstrap() {
  const app = createApp(App)

  // vue-query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5min
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  // setup
  setupStore(app) // pinia
  app.use(VueQueryPlugin, { queryClient }) // vue-query
  setupTelegram() // tma
  setupRouter(app) // vue-router
  setupI18nPlugin(app) // vue-i18n
  app.mount('#app')
}

bootstrap()
