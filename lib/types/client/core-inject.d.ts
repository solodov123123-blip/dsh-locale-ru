/**
 * Runtime injection for Russian locale in DSH core.
 * Handles patching LocaleRuntime, registering dictionaries, synthesizing fallbacks,
 * activating 'ru', and launching the DOM translation engine.
 */
import type { Context } from '@deepseek-ai/cordis';
export interface ExtendedLocaleRuntime {
    setLocale(id: string): void;
    getLocale(): {
        active: string;
        locales: readonly {
            id: string;
            label: string;
        }[];
        revision: number;
    };
    register(ns: string, localeOrDicts: string | Record<string, Record<string, string>>, dict?: Record<string, string>): () => void;
    bind(ns: string): (key: string, params?: Record<string, unknown>) => string;
    [key: string]: unknown;
}
/**
 * Injects all Russian dictionaries into ctx.locale and patches register to auto-enrich future registrations.
 * @param ctx - Cordis client context
 */
export declare function injectRussianLocale(ctx: Context): void;
//# sourceMappingURL=core-inject.d.ts.map