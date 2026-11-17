/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

declare const self: DedicatedWorkerGlobalScope & {
  __WB_MANIFEST: any
}

precacheAndRoute(self.__WB_MANIFEST || [])

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // @ts-expect-error Service worker context
    self.skipWaiting()
  }
})
