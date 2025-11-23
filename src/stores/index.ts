import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()

export function setupStore(app: App) {
  const persist = createPersistedState({
    auto: true,
    key: id => `VITE_TG_MINIAPP_TEMPLATE:${id}`,
    serializer: {
      serialize: state => {
        //? encrypt or compress or nothing
        return JSON.stringify(state)
      },
      deserialize: state => {
        //? decrypt or decompress or nothing
        return JSON.parse(state)
      },
    },
  })

  store.use(persist)

  app.use(store)
}

export { store }
