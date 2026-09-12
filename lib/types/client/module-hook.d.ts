/**
 * Hook for window.__ModuleLoader__ to intercept external plugin loads
 * and ensure Russian dictionaries and language settings are applied dynamically.
 */
import type { Context } from '@deepseek-ai/cordis';
export interface ClientPluginHandoff {
    id: string;
    factory: (require: (spec: string) => unknown) => Record<string, unknown>;
}
export interface ModuleLoaderApi {
    load(handoff: ClientPluginHandoff): void;
    __dsh_ru_hooked?: boolean;
}
/**
 * Installs hook into window.__ModuleLoader__ to intercept external plugin materialization.
 * @param _ctx - Cordis client context
 */
export declare function installModuleLoaderHook(_ctx?: Context): void;
//# sourceMappingURL=module-hook.d.ts.map