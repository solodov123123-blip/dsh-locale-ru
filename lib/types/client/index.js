import { injectRussianLocale } from "./core-inject.js";
import { installModuleLoaderHook } from "./module-hook.js";
import { ALL_RUSSIAN_DICTIONARIES } from "./dictionaries/index.js";
import { startDomTranslator, stopDomTranslator, translateDomTree } from "./dom-translator.js";
import { translatePhrase, PHRASE_MAP_RU } from "./dictionaries/phrases.js";
export { injectRussianLocale } from "./core-inject.js";
export { installModuleLoaderHook } from "./module-hook.js";
export { ALL_RUSSIAN_DICTIONARIES } from "./dictionaries/index.js";
export { startDomTranslator, stopDomTranslator, translateDomTree } from "./dom-translator.js";
export { translatePhrase, PHRASE_MAP_RU } from "./dictionaries/phrases.js";
/** Required services. */
export const inject = ['locale'];
/**
 * Apply the Russian localization plugin to the Cordis client runtime.
 * @param ctx - Client context
 */
export function apply(ctx) {
    // 1. Ensure document.documentElement.lang is 'ru'
    if (typeof document !== 'undefined') {
        document.documentElement.lang = 'ru';
    }
    // 2. Inject core Russian dictionaries, patch locale service and start DOM translation
    injectRussianLocale(ctx);
    // 3. Install window.__ModuleLoader__ hook for external plugins
    installModuleLoaderHook(ctx);
}
// Register canonical alias in window.__ModuleLoader__ if present
if (typeof window !== 'undefined') {
    const win = window;
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
            });
        }
        catch {
            // ignore
        }
    }
}
//# sourceMappingURL=index.js.map