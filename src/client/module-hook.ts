/**
 * Hook for window.__ModuleLoader__ to intercept external plugin loads
 * and ensure Russian dictionaries and language settings are applied dynamically.
 */
import type { Context } from '@deepseek-ai/cordis'
import { ALL_RUSSIAN_DICTIONARIES } from './dictionaries/index.ts'

export interface ClientPluginHandoff {
  id: string
  factory: (require: (spec: string) => unknown) => Record<string, unknown>
}

export interface ModuleLoaderApi {
  load(handoff: ClientPluginHandoff): void
  __dsh_ru_hooked?: boolean
}

/**
 * Installs hook into window.__ModuleLoader__ to intercept external plugin materialization.
 * @param _ctx - Cordis client context
 */
export function installModuleLoaderHook(_ctx?: Context): void {
  if (typeof window === 'undefined') return

  const win = window as unknown as { __ModuleLoader__?: ModuleLoaderApi }

  function wrapLoader(loader: ModuleLoaderApi): ModuleLoaderApi {
    if (loader.__dsh_ru_hooked) return loader
    const originalLoad = loader.load.bind(loader)

    loader.load = function (handoff: ClientPluginHandoff) {
      const origFactory = handoff.factory
      handoff.factory = function (req: (spec: string) => unknown) {
        const exports = origFactory(req)

        // Ensure document.documentElement.lang is 'ru'
        if (typeof document !== 'undefined' && (!document.documentElement.lang || document.documentElement.lang === 'zh' || document.documentElement.lang === 'en')) {
          document.documentElement.lang = 'ru'
        }

        // If plugin has apply, wrap it to ensure dictionary injection
        if (exports && typeof exports.apply === 'function') {
          const originalApply = exports.apply as (ctx: Context) => void
          exports.apply = function (pluginCtx: Context) {
            // Apply plugin
            const ret = originalApply(pluginCtx)

            // Inject Russian dictionaries into plugin context if locale is available
            pluginCtx.inject(['locale'], (scope) => {
              const locale = (scope as { locale?: { register: (ns: string, loc: string, d: Record<string, string>) => void } }).locale
              if (locale && typeof locale.register === 'function') {
                for (const [ns, dict] of Object.entries(ALL_RUSSIAN_DICTIONARIES)) {
                  try {
                    locale.register(ns, 'ru', dict)
                  } catch {
                    // Ignore duplicate registration
                  }
                }
              }
            })

            return ret
          }
        }

        return exports
      }

      return originalLoad(handoff)
    }

    loader.__dsh_ru_hooked = true
    return loader
  }

  if (win.__ModuleLoader__) {
    wrapLoader(win.__ModuleLoader__)
  }

  // Intercept future assignments of window.__ModuleLoader__
  try {
    let internalLoader = win.__ModuleLoader__
    Object.defineProperty(win, '__ModuleLoader__', {
      configurable: true,
      enumerable: true,
      get() {
        return internalLoader
      },
      set(newLoader: ModuleLoaderApi) {
        internalLoader = newLoader ? wrapLoader(newLoader) : newLoader
      },
    })
  } catch {
    // If defineProperty is not allowed, wrapping win.__ModuleLoader__ above was sufficient
  }
}
