type PCommonConfig = {
  concurrency?: number
}

export async function pMapPool<T extends readonly unknown[] | [], X>(
  iterable: T,
  mapper: (item: T[number], index: number) => Promise<X>,
  options?: PCommonConfig
): Promise<{ [Index in keyof T]: Awaited<X> }>

export async function pMapPool<K, V, X>(
  iterable: Iterable<[K, V]>,
  mapper: (item: [K, V], index: number) => Promise<X>,
  options?: PCommonConfig
): Promise<X[]>

export async function pMapPool<T, X>(
  iterable: Iterable<T | PromiseLike<T>>,
  mapper: (item: T, index: number) => Promise<X>,
  { concurrency = Infinity } = {} as PCommonConfig
): Promise<Awaited<X>[]> {
  const results: Awaited<X>[] = []
  const iterator = iterable[Symbol.iterator]()

  let completed = false
  let start = 0

  const runBatch = async () => {
    const items: T[] = []

    for (let i = 0; i < concurrency; i += 1) {
      const iterableResult = iterator.next()

      if (iterableResult.done) {
        completed = true
        break
      }

      items.push(await iterableResult.value)
    }

    const batchResults = await Promise.all(items.map((item, i) => mapper(item, start + i)))
    start += items.length

    results.push(...batchResults)

    if (!completed) await runBatch()
  }

  await runBatch()

  return results
}

export async function pFilter<T extends readonly unknown[] | []>(
  iterable: T,
  filterer: (item: T[number], index: number) => boolean | Promise<boolean>,
  options?: PCommonConfig
): Promise<{ [Index in keyof T]: Awaited<T[number]> }>

export async function pFilter<T>(
  iterable: Iterable<T | PromiseLike<T>>,
  filterer: (item: T, index: number) => boolean | Promise<boolean>,
  { concurrency = Infinity } = {} as PCommonConfig
): Promise<T[]> {
  const results: T[] = []
  const iterator = iterable[Symbol.iterator]()

  let completed = false
  let start = 0

  const runBatch = async () => {
    const items: T[] = []

    for (let i = 0; i < concurrency; i += 1) {
      const iterableResult = iterator.next()

      if (iterableResult.done) {
        completed = true
        break
      }

      items.push(await iterableResult.value)
    }

    const _results = Array.from<T>({ length: items.length })
    await Promise.all(
      items.map(async (item, i) => {
        if (await filterer(item, start + i)) {
          _results[i] = item
        }
      })
    )

    start += items.length

    results.push(..._results.filter(item => item !== undefined))

    if (!completed) await runBatch()
  }

  await runBatch()

  return results
}

export function pCreate<T = void>() {
  let isResolved = false
  let resolve: (value: T | PromiseLike<T>) => void = () => {}
  let reject: (reason?: unknown) => void = () => {}

  const promise = new Promise<T>((_resolve, _reject) => {
    if (isResolved) return
    isResolved = true
    resolve = _resolve
    reject = _reject
  })

  return { promise, resolve, reject, isResolved }
}
