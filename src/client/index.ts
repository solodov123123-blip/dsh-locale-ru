/**
 * Browser entry for `@deepseek-ai/dsh-client-locale-ru`.
 * Registers complete Russian localization in DeepSeek Harness, enriching core and third-party UI plugins,
 * providing dynamic fallback translation and continuous DOM localization.
 * @module @deepseek-ai/dsh-client-locale-ru/client
 */
import type { Context } from '@deepseek-ai/cordis'
import { injectRussianLocale } from './core-inject.ts'
import { installModuleLoaderHook } from './module-hook.ts'
import { ALL_RUSSIAN_DICTIONARIES } from './dictionaries/index.ts'
import { startDomTranslator, stopDomTranslator, translateDomTree } from './dom-translator.ts'
import { translatePhrase, PHRASE_MAP_RU } from './dictionaries/phrases.ts'

export { injectRussianLocale } from './core-inject.ts'
export { installModuleLoaderHook } from './module-hook.ts'
export { ALL_RUSSIAN_DICTIONARIES } from './dictionaries/index.ts'
export { startDomTranslator, stopDomTranslator, translateDomTree } from './dom-translator.ts'
export { translatePhrase, PHRASE_MAP_RU } from './dictionaries/phrases.ts'

/** Required services. */
export const inject = ['locale']

/**
 * Apply the Russian localization plugin to the Cordis client runtime.
 * @param ctx - Client context
 */
export function apply(ctx: Context): void {
  // 1. Ensure document.documentElement.lang is 'ru'
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'ru'
  }

  // 2. Inject core Russian dictionaries, patch locale service and start DOM translation
  injectRussianLocale(ctx)

  // 3. Install window.__ModuleLoader__ hook for external plugins
  installModuleLoaderHook(ctx)
}

// Register canonical alias in window.__ModuleLoader__ if present
if (typeof window !== 'undefined') {
  const win = window as any
  if (win.__ModuleLoader__ && typeof win.__ModuleLoader__.load === 'function') {
    try {
      win.__ModuleLoader__.load({
        id: '@deepseek-ai/dsh-client-locale-ru',
        factory: () => ({
          apply,
          inject,
          injectRussianLocale,
          installModuleLoaderHook,
          ALL_RUSSIAN_DICTIONARIES,
          startDomTranslator,
          stopDomTranslator,
          translateDomTree,
          translatePhrase,
          PHRASE_MAP_RU,
        }),
      })
    } catch {
      // ignore
    }
  }
}
