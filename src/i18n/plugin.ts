import { i18n } from '@/i18n'
import { useGlobalStore } from '@/stores/global'
import type { App } from 'vue'

export function setupI18nPlugin(app: App<Element>) {
  const userStore = useGlobalStore()
  i18n.global.locale.value = userStore.language
  app.use(i18n)
}
