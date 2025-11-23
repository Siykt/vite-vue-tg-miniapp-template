export function importScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export function loadImage(
  url: string,
  crossOrigin: string = 'anonymous'
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.crossOrigin = crossOrigin
    image.onload = event => resolve(event.target as HTMLImageElement)
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`))
    }
  })
}

const _importedScripts = new Set<string>()
export function importScriptOnlyOnce(url: string) {
  if (!_importedScripts.has(url)) {
    _importedScripts.add(url)
    return importScript(url)
  }
  return Promise.resolve() // already imported
}
