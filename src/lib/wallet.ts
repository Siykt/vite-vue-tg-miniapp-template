import { Address, beginCell } from '@ton/core'
import { type ActionConfiguration, type SendTransactionRequest, TonConnectUI } from '@tonconnect/ui'
import { formatAddress } from './format'

/**
 * Ton Wallet
 */
export class TonWallet {
  private static instance: TonWallet | null = null
  connecter: TonConnectUI
  // client: TonClient;
  supportedTonPayment: boolean

  private constructor() {
    console.log('Creating new TonWallet instance...')
    try {
      // 初始化 TonConnect UI
      this.connecter = new TonConnectUI({
        manifestUrl: import.meta.env.VITE_APP_TON_MANIFEST_URL,
      })

      this.supportedTonPayment = true

      // 配置 UI 选项
      this.connecter.uiOptions = {
        actionsConfiguration: {
          twaReturnUrl: import.meta.env.VITE_TELEGRAM_MINI_APP_URL as `${string}://${string}`,
        },
      }
      console.log('TonWallet instance created successfully')
    } catch (error) {
      console.error('Error initializing TonWallet:', error)
      throw error
    }
  }

  /**
   * 获取钱包实例的静态方法
   * 如果实例不存在则创建新实例，否则返回现有实例
   */
  public static getInstance(): TonWallet {
    if (!TonWallet.instance) {
      TonWallet.instance = new TonWallet()
    }
    return TonWallet.instance
  }

  /**
   * 将钱包地址转换为友好格式
   * @param address TON 钱包地址
   */
  static getWalletFriendlyAddress(address: string) {
    return Address.parse(address).toString({ bounceable: false })
  }

  /**
   * 获取钱包连接状态
   */
  get isConnected() {
    return this.connecter.connected
  }

  /**
   * 获取原始钱包地址
   */
  get rawAddress() {
    return this.connecter.account?.address
  }

  /**
   * 获取友好格式的钱包地址
   */
  get friendlyAddress() {
    if (!this.connecter.account?.address) return ''
    return TonWallet.getWalletFriendlyAddress(this.connecter.account.address)
  }

  /**
   * 获取格式化的友好地址（用于显示）
   */
  get formattedFriendlyAddress() {
    return formatAddress(this.friendlyAddress)
  }

  /**
   * 等待钱包连接完成
   * @param timeout 超时时间（毫秒）
   */
  waitConnected(timeout = 120000) {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        clearInterval(interval) // 清除interval避免内存泄漏
        console.error(`钱包连接超时，等待时间超过 ${timeout / 1000} 秒`)
        reject(new Error('Wallet connection timeout'))
      }, timeout)
      const interval = setInterval(() => {
        if (this.isConnected) {
          clearInterval(interval)
          clearTimeout(timer)
          resolve()
        }
      }, 100)
    })
  }

  /**
   * 包装回调函数，确保在执行前钱包已连接
   * @param callback 需要在钱包连接后执行的回调函数
   */
  useConnectedCallback<T extends (...args: any) => any>(callback: T) {
    if (this.isConnected) return callback
    return async (...args: Parameters<T>) => {
      await this.connecter.openModal()
      await this.waitConnected()
      return callback.apply(this, args)
    }
  }

  /**
   * 构建交易评论数据
   * @param comment 评论内容
   */
  buildComment(comment: string | number | bigint) {
    return beginCell()
      .store(builder => {
        builder.storeUint(0, 32)
        builder.storeStringRefTail(comment.toString())
      })
      .endCell()
      .toBoc()
      .toString('base64')
  }

  /**
   * 发送带评论的转账交易
   * @param request 转账请求参数
   * @param options 操作配置选项
   */
  sendTransferWithComment(
    request: Omit<SendTransactionRequest, 'messages'> & {
      messages: (Omit<SendTransactionRequest['messages'][0], 'payload'> & {
        comment: string | number | bigint
      })[]
    },
    options?: ActionConfiguration
  ) {
    if (!this.isConnected) throw new Error('Connecter not connected')
    return this.connecter.sendTransaction(
      {
        ...request,
        messages: request.messages.map(message => ({
          ...message,
          payload: this.buildComment(message.comment),
        })),
      },
      options
    )
  }
}

// 导出全局单例
export const tonWallet = TonWallet.getInstance()
