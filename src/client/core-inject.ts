/**
 * Runtime injection for Russian locale in DSH core.
 * Handles patching LocaleRuntime, registering dictionaries, synthesizing fallbacks,
 * activating 'ru', and launching the DOM translation engine.
 */
import type { Context } from '@deepseek-ai/cordis'
import { ALL_RUSSIAN_DICTIONARIES } from './dictionaries/index.ts'
import { translatePhrase } from './dictionaries/phrases.ts'
import { startDomTranslator } from './dom-translator.ts'

export interface ExtendedLocaleRuntime {
  setLocale(id: string): void
  getLocale(): { active: string; locales: readonly { id: string; label: string }[]; revision: number }
  register(ns: string, localeOrDicts: string | Record<string, Record<string, string>>, dict?: Record<string, string>): () => void
  bind(ns: string): (key: string, params?: Record<string, unknown>) => string
  [key: string]: unknown
}

/**
 * Synthesizes a Russian dictionary from available en / zh dictionaries using phrase translation.
 */
function synthesizeRussianDictionary(sourceDict: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(sourceDict)) {
    if (typeof v === 'string') {
      const translated = translatePhrase(v)
      if (translated) {
        result[k] = translated
      }
    }
  }
  return result
}

/**
 * Injects all Russian dictionaries into ctx.locale and patches register to auto-enrich future registrations.
 * @param ctx - Cordis client context
 */
export function injectRussianLocale(ctx: Context): void {
  const applyLocale = (localeService: ExtendedLocaleRuntime): void => {
    if (!localeService) return

    // Set document lang to ru
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'ru'
    }

    // Register all known Russian dictionaries
    for (const [ns, dict] of Object.entries(ALL_RUSSIAN_DICTIONARIES)) {
      try {
        localeService.register(ns, 'ru', dict)
      } catch {
        // If already has locale 'ru', ignore error
      }
    }

    // Patch register so that any plugin registering { zh, en } gets { zh, en, ru: ... } automatically
    if (!(localeService as Record<string, unknown>).__dsh_ru_patched) {
      const originalRegister = localeService.register.bind(localeService)
      const originalBind = localeService.bind.bind(localeService)
      ;(localeService as Record<string, unknown>).__dsh_ru_patched = true

      // Wrap bind to provide dynamic fallback for untranslated keys
      localeService.bind = function (ns: string) {
        const origT = originalBind(ns)
        return function (key: string, params?: Record<string, unknown>) {
          const res = origT(key, params)
          // If translation returned the raw key or fallback Chinese/English that can be translated
          if (res === key || typeof res === 'string') {
            const dynamic = translatePhrase(res)
            if (dynamic !== undefined) {
              return dynamic
            }
          }
          return res
        }
      }

      localeService.register = function (ns: string, localeOrDicts: unknown, dict?: Record<string, string>) {
        let enriched = localeOrDicts
        const knownRu = ALL_RUSSIAN_DICTIONARIES[ns]

        if (typeof localeOrDicts === 'object' && localeOrDicts !== null) {
          const dictsObj = localeOrDicts as Record<string, Record<string, string> | undefined>
          const ruDict = knownRu || synthesizeRussianDictionary(dictsObj.zh || dictsObj.en || {})

          if (knownRu) {
            if (dictsObj.zh && typeof dictsObj.zh === 'object') {
              Object.assign(dictsObj.zh, knownRu)
            }
            if (dictsObj.en && typeof dictsObj.en === 'object') {
              Object.assign(dictsObj.en, knownRu)
            }
          }

          if (!('ru' in dictsObj) && Object.keys(ruDict).length > 0) {
            enriched = { ...dictsObj, ru: ruDict }
          }
        } else if (typeof localeOrDicts === 'string' && (localeOrDicts === 'zh' || localeOrDicts === 'en') && dict && typeof dict === 'object') {
          if (knownRu) {
            Object.assign(dict, knownRu)
          }
        }

        try {
          return originalRegister(ns, enriched as any, dict)
        } catch (err) {
          if (String((err as Error)?.message || '').includes('already has locale')) {
            return () => {}
          }
          throw err
        }
      }
    }

    // Register language in catalog if not already
    if (typeof (localeService as any).addLanguage === 'function') {
      try {
        ;(localeService as any).addLanguage({
          id: 'ru',
          label: 'Русский',
          fallback: 'en',
        })
      } catch {
        // ignore
      }
    }

    // Switch active locale to 'ru' if not already
    try {
      if (localeService.getLocale().active !== 'ru') {
        localeService.setLocale('ru')
      }
    } catch {
      // ignore
    }

    // Launch DOM translation engine
    startDomTranslator()
  }

  // If locale service is already present on ctx
  if ((ctx as unknown as { locale?: ExtendedLocaleRuntime }).locale) {
    applyLocale((ctx as unknown as { locale: ExtendedLocaleRuntime }).locale)
  }

  // Also hook via inject for deferred loading
  ctx.inject(['locale'], (localeCtx) => {
    applyLocale((localeCtx as unknown as { locale: ExtendedLocaleRuntime }).locale)
  })
}
