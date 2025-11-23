export function timeout(callback: () => void, ms = 1000) {
  const timer = setTimeout(callback, ms)
  return () => clearTimeout(timer)
}

export function interval(callback: () => void, ms = 1000) {
  const timer = setInterval(callback, ms)
  return () => clearInterval(timer)
}

export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms = 1000) {
  let timer: NodeJS.Timeout
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), ms)
  }
}

export function throttle<T extends (...args: any[]) => any>(fn: T, ms = 1000) {
  let timer: NodeJS.Timeout | undefined = undefined
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!timer) {
      fn.apply(this, args)
      timer = setTimeout(() => (timer = undefined), ms)
    }
  }
}
