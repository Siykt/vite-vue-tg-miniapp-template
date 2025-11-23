import { useGlobalStore } from '@/stores/global'
import axios from 'axios'
import type { RequestConfig } from './types'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_CLIENT_URL,
  timeout: 60_000, // 1 minute
  withCredentials: true,
  headers: {
    'X-Client-Version': APP_VERSION,
  },
})

function is2xx(status: number) {
  return /^2/.test(status.toString())
}

function is4xx(status: number) {
  return /^4/.test(status.toString())
}

client.interceptors.request.use(config => {
  const { token, language } = useGlobalStore()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (language) {
    config.headers['Accept-Language'] = language
  }
  return config
})

client.interceptors.response.use(
  async response => {
    const result = response.data
    if (!result || !result.code || !result.data) {
      throw new Error('Invalid response')
    }

    // handle 4xx errors
    if (is4xx(result.code)) {
      // JWT expired, refresh token
      if (result.msg === 'jwt expired') {
        const userStore = useGlobalStore()
        // save local promise to avoid race condition
        const refreshingTokenPromise = userStore.refreshingTokenPromise
        if (refreshingTokenPromise) {
          await refreshingTokenPromise
        } else {
          const { resolve, reject } = userStore.createRefreshTokenState()
          await rpc<{ accessToken: string }>('manager.refreshToken')
            .then(({ accessToken }) => resolve(accessToken))
            .catch(reject)
        }
        return client.request(response.config)
      }

      // throw other 4xx errors
      throw new Error(result.msg)
    }

    // throw error if not 2xx
    if (!is2xx(result.code)) {
      throw new Error(result.msg)
    }

    return result.data.params ?? result.data
  },
  async error => {
    if (error.response) {
      const message = error.response.statusText || 'Request failed'
      throw new Error(message)
    }
    throw error
  }
)

export function get<T = unknown>(url: string, config?: RequestConfig) {
  return client.get<unknown, T>(url, config)
}

export function post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig) {
  return client.post<unknown, T>(url, data, config)
}

export function put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig) {
  return client.put<unknown, T>(url, data, config)
}

export function del<T = unknown>(url: string, config?: RequestConfig) {
  return client.delete<unknown, T>(url, config)
}

export async function rpc<T = unknown, D = unknown>(
  method: string,
  params?: D,
  config?: Omit<RequestConfig, 'method' | 'data'>
) {
  return client<unknown, T>({
    method: 'POST',
    data: {
      method,
      params,
    },
    ...config,
  })
}

export async function upload<T = unknown>(formData: FormData, config?: RequestConfig) {
  return client.post<T, FormData>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600_000, // 10 minutes
    ...config,
  })
}

export async function uploads<T = unknown>(formData: FormData, config?: RequestConfig) {
  return client.post<T, FormData>('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600_000, // 10 minutes
    ...config,
  })
}
