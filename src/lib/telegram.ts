import type {
  BottomBarColor,
  ImpactHapticFeedbackStyle,
  LaunchParams,
  OpenLinkBrowser,
} from '@telegram-apps/sdk'
import {
  addToHomeScreen,
  backButton,
  biometry,
  checkHomeScreenStatus,
  closingBehavior,
  cloudStorage,
  hapticFeedback,
  init,
  invoice,
  miniApp,
  onAddToHomeScreenFailed,
  onAddedToHomeScreen,
  openLink,
  openTelegramLink,
  popup,
  qrScanner,
  readTextFromClipboard,
  request,
  requestContact,
  requestEmojiStatusAccess,
  requestPhoneAccess,
  requestWriteAccess,
  retrieveLaunchParams,
  retrieveRawInitData,
  secondaryButton,
  setEmojiStatus,
  settingsButton,
  shareStory,
  shareURL,
  swipeBehavior,
  themeParams,
  viewport,
} from '@telegram-apps/sdk'

type InitData = Required<LaunchParams>['tgWebAppData']

class Client {
  static readonly TG_WIDGET_SDK_URL = 'https://telegram.org/js/telegram-widget.js'
  static readonly TG_ANALYTICS_SDK_URL = 'https://tganalytics.xyz/index.js'

  readonly launchParams: LaunchParams = {} as LaunchParams
  readonly initData: InitData = {} as InitData
  readonly supported: boolean
  readonly version: string = ''
  readonly initDataRaw: string = ''
  readonly methods = {
    hapticFeedback,
    backButton,
    miniApp,
    popup,
    biometry,
    invoice,
    cloudStorage,
    viewport,
    closingBehavior,
    settingsButton,
    swipeBehavior,
    qrScanner,
    secondaryButton,
    themeParams,
    request,

    // utils
    openLink: openLink as typeof openLink,
    shareStory: shareStory as typeof shareStory,
    openTelegramLink: openTelegramLink as typeof openTelegramLink,
    shareURL: shareURL as typeof shareURL,
    requestPhoneAccess: requestPhoneAccess as typeof requestPhoneAccess,
    requestWriteAccess: requestWriteAccess as typeof requestWriteAccess,
    requestContact: requestContact as typeof requestContact,
    requestEmojiStatusAccess: requestEmojiStatusAccess as typeof requestEmojiStatusAccess,
    setEmojiStatus: setEmojiStatus as typeof setEmojiStatus,
    readTextFromClipboard: readTextFromClipboard as typeof readTextFromClipboard,
    addToHomeScreen: addToHomeScreen as typeof addToHomeScreen,
    checkHomeScreenStatus: checkHomeScreenStatus as typeof checkHomeScreenStatus,
    onAddedToHomeScreen: onAddedToHomeScreen as typeof onAddedToHomeScreen,
    onAddToHomeScreenFailed: onAddToHomeScreenFailed as typeof onAddToHomeScreenFailed,
  }

  readonly init = init

  private _isMounted = false

  constructor() {
    try {
      this.launchParams = retrieveLaunchParams()
      this.initDataRaw = retrieveRawInitData() || ''
      this.version = this.launchParams.tgWebAppVersion
      this.initData = this.launchParams.tgWebAppData as InitData

      this.init()
      this.supported = true
    } catch (error) {
      this.supported = false
      console.warn('telegram init error: ', error)
    }
  }

  mount() {
    if (this._isMounted) return
    this._isMounted = true

    // Mount all methods that require initialization
    const promises: Promise<void>[] = []
    for (const methodKey in this.methods) {
      const method = this.methods[methodKey as keyof typeof this.methods] as {
        mount?: () => Promise<void>
      }
      if (typeof method.mount === 'function') {
        const p = method.mount()
        if (p instanceof Promise) {
          promises.push(
            new Promise(resolve => {
              const timer = setTimeout(resolve, 1000)
              p.catch(() => {}).finally(() => {
                clearTimeout(timer)
                resolve()
              })
            })
          )
        }
      }
    }

    return Promise.all(promises)
  }

  get isMounted() {
    return this._isMounted
  }

  setBottomBarColor(color: BottomBarColor) {
    this.methods.miniApp.setBottomBarColor.ifAvailable(color)
  }

  /**
   * request phone
   * @param {AbortSignal} abortSignal - abort signal
   */
  async requestPhone(abortSignal?: AbortSignal) {
    return this.methods.requestPhoneAccess.ifAvailable({
      timeout: 10000,
      abortSignal,
    })
  }

  openLink(url: string, tryBrowser?: OpenLinkBrowser, tryInstantView?: boolean) {
    if (this.supported) this.methods.openLink.ifAvailable(url, { tryBrowser, tryInstantView })
    else window.open(url)
  }

  /**
   * request story sharing
   */
  async requestStoryShare(mediaURL: string, text?: string) {
    return this.methods.shareStory.ifAvailable(mediaURL, { text })
  }

  /**
   * request swipe behavior
   */
  requestSwipeBehavior(isVerticalSwipesEnabled: boolean) {
    if (isVerticalSwipesEnabled) this.methods.swipeBehavior.enableVertical.ifAvailable()
    else this.methods.swipeBehavior.disableVertical.ifAvailable()
  }

  /**
   * telegram vibration
   * @param style - vibration type
   */
  requestVibration(style: ImpactHapticFeedbackStyle) {
    return this.methods.hapticFeedback.impactOccurred.ifAvailable(style)
  }

  /**
   * telegram share
   * @param url url
   * @param text text
   */
  shareURL(url: string, text?: string) {
    if (this.supported) this.methods.shareURL.ifAvailable(url, text)
    else window.open(url)
  }

  /**
   * parse start param
   */
  parseStartParam(version?: string) {
    const startParamString = this.supported
      ? this.initData.start_param
      : new URLSearchParams(window.location.search).get('startapp')

    if (!startParamString) return { type: 'Unknown', params: [], version: 'Unknown' }

    const [versionOrType, typeOrParma, ...params] = startParamString.split('_')
    if (version) {
      if (versionOrType !== version) return { type: 'Unknown', params: [], version: versionOrType }
      return { type: typeOrParma, params, version: versionOrType }
    } else {
      return { type: versionOrType, params: [typeOrParma, ...params], version: 'Unknown' }
    }
  }

  /**
   * generate start param
   */
  generateStartParam(data: { type: string; params: string[]; version?: string }) {
    const startParamString = `${data.version ? `${data.version}_` : ''}${data.type}_${data.params.join('_')}`
    if (startParamString.length > 256) throw new Error('start param string is too long')
    return startParamString
  }
}

export const TGClient = new Client()

export async function setupTelegram() {
  try {
    if (!TGClient.supported) return

    // set launch params
    await TGClient.mount()

    // enable closing behavior confirmation
    TGClient.methods.closingBehavior.enableConfirmation.ifAvailable()

    // expand viewport
    TGClient.methods.viewport.expand.ifAvailable()

    // disable swipe behavior
    TGClient.requestSwipeBehavior(false)

    // debug for tma
    ;(window as unknown as { TGClient: typeof TGClient }).TGClient = TGClient
  } catch (error) {
    console.warn('setup telegram error: ', error)
  }
}
