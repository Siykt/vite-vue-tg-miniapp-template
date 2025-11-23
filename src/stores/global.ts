import { pCreate } from '@/lib/p'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LocaleCode } from '@/i18n'

export const useGlobalStore = defineStore('global', () => {
  const token = ref('')
  const language = ref<LocaleCode>('en')
  const refreshingTokenPromise = ref<Promise<string>>()

  function createRefreshTokenState() {
    const { promise, resolve, reject } = pCreate<string>()
    refreshingTokenPromise.value = promise
    return {
      resolve: (accessToken: string) => {
        resolve(accessToken)
        refreshingTokenPromise.value = undefined
        token.value = accessToken
      },
      reject: (error: unknown) => {
        reject(error)
        refreshingTokenPromise.value = undefined
        token.value = ''
      },
    }
  }

  return {
    token,
    language,
    refreshingTokenPromise,

    createRefreshTokenState,
  }
})
