/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_CLIENT_URL: string
  readonly VITE_APP_TON_ADDRESS: string
  readonly VITE_APP_TON_MANIFEST_URL: string
  readonly VITE_TELEGRAM_MINI_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const APP_VERSION: string
