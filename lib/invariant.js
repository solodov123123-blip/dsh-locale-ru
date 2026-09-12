//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@deepseek-ai/dsh-client-locale-ru`.
* @module @deepseek-ai/dsh-client-locale-ru/invariant
*/
const PACKAGE_NAME = "@deepseek-ai/dsh-client-locale-ru";
/** Cordis companion plugin name. */
const name = "client-locale-ru-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
