import type { AxiosRequestConfig } from 'axios'

/**
 * API Request Config
 */
export type RequestConfig = AxiosRequestConfig & { silence?: boolean }
