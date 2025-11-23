export function isDev() {
  return import.meta.env.DEV
}

export function isProd() {
  return import.meta.env.PROD
}

export function isMobile() {
  return !!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isAndroid() {
  return /Android/.test(navigator.userAgent)
}
