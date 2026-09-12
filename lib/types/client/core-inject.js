import { ALL_RUSSIAN_DICTIONARIES } from "./dictionaries/index.js";
import { translatePhrase } from "./dictionaries/phrases.js";
import { startDomTranslator } from "./dom-translator.js";
/**
 * Synthesizes a Russian dictionary from available en / zh dictionaries using phrase translation.
 */
function synthesizeRussianDictionary(sourceDict) {
    const result = {};
    for (const [k, v] of Object.entries(sourceDict)) {
        if (typeof v === 'string') {
            const translated = translatePhrase(v);
            if (translated) {
                result[k] = translated;
            }
        }
    }
    return result;
}
/**
 * Injects all Russian dictionaries into ctx.locale and patches register to auto-enrich future registrations.
 * @param ctx - Cordis client context
 */
export function injectRussianLocale(ctx) {
    const applyLocale = (localeService) => {
        if (!localeService)
            return;
        // Set document lang to ru
        if (typeof document !== 'undefined') {
            document.documentElement.lang = 'ru';
        }
        // Register all known Russian dictionaries
        for (const [ns, dict] of Object.entries(ALL_RUSSIAN_DICTIONARIES)) {
            try {
                localeService.register(ns, 'ru', dict);
            }
            catch {
                // If already has locale 'ru', ignore error
            }
        }
        // Patch register so that any plugin registering { zh, en } gets { zh, en, ru: ... } automatically
        if (!localeService.__dsh_ru_patched) {
            const originalRegister = localeService.register.bind(localeService);
            const originalBind = localeService.bind.bind(localeService);
            localeService.__dsh_ru_patched = true;
            // Wrap bind to provide dynamic fallback for untranslated keys
            localeService.bind = function (ns) {
                const origT = originalBind(ns);
                return function (key, params) {
                    const res = origT(key, params);
                    // If translation returned the raw key or fallback Chinese/English that can be translated
                    if (res === key || typeof res === 'string') {
                        const dynamic = translatePhrase(res);
                        if (dynamic !== undefined) {
                            return dynamic;
                        }
                    }
                    return res;
                };
            };
            localeService.register = function (ns, localeOrDicts, dict) {
                let enriched = localeOrDicts;
                const knownRu = ALL_RUSSIAN_DICTIONARIES[ns];
                if (typeof localeOrDicts === 'object' && localeOrDicts !== null) {
                    const dictsObj = localeOrDicts;
                    const ruDict = knownRu || synthesizeRussianDictionary(dictsObj.zh || dictsObj.en || {});
                    if (knownRu) {
                        if (dictsObj.zh && typeof dictsObj.zh === 'object') {
                            Object.assign(dictsObj.zh, knownRu);
                        }
                        if (dictsObj.en && typeof dictsObj.en === 'object') {
                            Object.assign(dictsObj.en, knownRu);
                        }
                    }
                    if (!('ru' in dictsObj) && Object.keys(ruDict).length > 0) {
                        enriched = { ...dictsObj, ru: ruDict };
                    }
                }
                else if (typeof localeOrDicts === 'string' && (localeOrDicts === 'zh' || localeOrDicts === 'en') && dict && typeof dict === 'object') {
                    if (knownRu) {
                        Object.assign(dict, knownRu);
                    }
                }
                try {
                    return originalRegister(ns, enriched, dict);
                }
                catch (err) {
                    if (String(err?.message || '').includes('already has locale')) {
                        return () => { };
                    }
                    throw err;
                }
            };
        }
        // Switch active locale to 'ru' if not already
        try {
            if (localeService.getLocale().active !== 'ru') {
                localeService.setLocale('ru');
            }
        }
        catch {
            // ignore
        }
        // Launch DOM translation engine
        startDomTranslator();
    };
    // If locale service is already present on ctx
    if (ctx.locale) {
        applyLocale(ctx.locale);
    }
    // Also hook via inject for deferred loading
    ctx.inject(['locale'], (localeCtx) => {
        applyLocale(localeCtx.locale);
    });
}
//# sourceMappingURL=core-inject.js.map