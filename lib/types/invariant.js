/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-client-locale-ru`.
 * @module @deepseek-ai/dsh-client-locale-ru/invariant
 */
const PACKAGE_NAME = '@deepseek-ai/dsh-client-locale-ru';
/** Cordis companion plugin name. */
export const name = 'client-locale-ru-invariant';
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants'];
const install = () => {
    // No runtime invariant: locale-ru provides client-side localization dictionaries
};
/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
/* jscpd:ignore-end */
//# sourceMappingURL=invariant.js.map