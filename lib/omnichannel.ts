// Loads the Omnichannel chat widget and controls it.
type Command = 'open' | 'close' | 'toggle' | 'show' | 'hide' | 'identify' | 'logout' | 'destroy'
type Api = ((command: Command, argument?: unknown) => void) & { q?: unknown[][] }

export type ChatUser = { id: string | number; name?: string; email?: string; hash?: string }

declare global {
  interface Window { Omnichannel?: Api }
}

const LOADER_URL = 'https://omnichannel-app.asbd.xyz/widget/loader.js'

// Calls made before the script has loaded are queued, and run once it has.
function api(): Api | undefined {
  if (typeof window === 'undefined') return undefined   // server-side rendering: do nothing
  window.Omnichannel ??= Object.assign((...args: unknown[]) => { window.Omnichannel!.q!.push(args) }, { q: [] })
  return window.Omnichannel
}

export function loadChat(widgetKey: string, options: { position?: 'left' | 'right'; hideLauncher?: boolean } = {}) {
  if (!api() || document.getElementById('omnichannel-loader')) return   // already added
  const script = document.createElement('script')
  script.id = 'omnichannel-loader'
  script.async = true
  script.src = LOADER_URL
  script.dataset.key = widgetKey
  if (options.position) script.dataset.position = options.position
  if (options.hideLauncher) script.dataset.hideLauncher = ''
  document.body.appendChild(script)
}

export const openChat = () => api()?.('open')
export const closeChat = () => api()?.('close')
export const showChat = () => api()?.('show')
export const hideChat = () => api()?.('hide')
export const identifyChat = (user: ChatUser) => api()?.('identify', user)
export const logoutChat = () => api()?.('logout')
export const destroyChat = () => api()?.('destroy')