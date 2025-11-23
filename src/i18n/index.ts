import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'

export const languages = [
  {
    code: 'en',
    name: 'English',
    file: en,
  },
] as const

export type LocaleCode = (typeof languages)[number]['code']

export const i18n = createI18n({
  locale: 'en',
  legacy: false,
  fallbackLocale: 'en',
  messages: Object.fromEntries(
    languages.map(language => [language.code, language.file])
  ),
})
