/**
 * High-performance, non-intrusive DOM MutationObserver and text translator.
 * Ensures that any hardcoded strings, late-mounted third-party components,
 * tool cards, placeholders, or aria-labels in the DOM are localized into Russian.
 */
/**
 * Recursively scans and translates a DOM tree root.
 */
export declare function translateDomTree(root: Node): void;
/**
 * Starts the global DOM translation observer.
 */
export declare function startDomTranslator(): () => void;
/**
 * Stops the global DOM translation observer.
 */
export declare function stopDomTranslator(): void;
//# sourceMappingURL=dom-translator.d.ts.map