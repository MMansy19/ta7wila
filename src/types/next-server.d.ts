import type { AsyncLocalStorage as NodeAsyncLocalStorage } from 'async_hooks'

declare global {
  var AsyncLocalStorage: typeof NodeAsyncLocalStorage
}

declare module 'next/server' {
  export { URLPattern } from 'next/dist/compiled/@edge-runtime/primitives/url'
    export type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types'
    export { after } from 'next/dist/server/after'
    export { connection } from 'next/dist/server/request/connection'
    export type { UnsafeUnwrappedParams } from 'next/dist/server/request/params'
    export type { UnsafeUnwrappedSearchParams } from 'next/dist/server/request/search-params'
    export { NextFetchEvent } from 'next/dist/server/web/spec-extension/fetch-event'
    export { ImageResponse } from 'next/dist/server/web/spec-extension/image-response'
    export { NextRequest } from 'next/dist/server/web/spec-extension/request'
    export { NextResponse } from 'next/dist/server/web/spec-extension/response'
    export { userAgent, userAgentFromString } from 'next/dist/server/web/spec-extension/user-agent'
    export { MiddlewareConfig, NextMiddleware } from 'next/dist/server/web/types'
  export function unstable_rootParams(): Promise<{ lang: string }>
} 