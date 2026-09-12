/**
 * Browser entry for `@deepseek-ai/dsh-client-locale-ru`.
 * Registers complete Russian localization in DeepSeek Harness, enriching core and third-party UI plugins,
 * providing dynamic fallback translation and continuous DOM localization.
 * @module @deepseek-ai/dsh-client-locale-ru/client
 */
import type { Context } from '@deepseek-ai/cordis';
export { injectRussianLocale } from './core-inject.ts';
export { installModuleLoaderHook } from './module-hook.ts';
export { ALL_RUSSIAN_DICTIONARIES } from './dictionaries/index.ts';
export { startDomTranslator, stopDomTranslator, translateDomTree } from './dom-translator.ts';
export { translatePhrase, PHRASE_MAP_RU } from './dictionaries/phrases.ts';
/** Required services. */
export declare const inject: string[];
/**
 * Apply the Russian localization plugin to the Cordis client runtime.
 * @param ctx - Client context
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map