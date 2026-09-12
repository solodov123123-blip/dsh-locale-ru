/**
 * High-performance, non-intrusive DOM MutationObserver and text translator.
 * Ensures that any hardcoded strings, late-mounted third-party components,
 * tool cards, placeholders, or aria-labels in the DOM are localized into Russian.
 */

import { translatePhrase } from './dictionaries/phrases.ts'

const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'PRE',
  'CODE',
  'NOSCRIPT',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'SVG',
  'PATH',
  'CANVAS',
])

const IGNORED_CLASSES = [
  'hljs',
  'prism',
  'monaco',
  'cm-content',
  'code-block',
  'user-message-content',
]

const TARGET_ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'data-tooltip', 'alt']

let observer: MutationObserver | null = null
let scheduled = false
let pendingNodes: Node[] = []

/**
 * Checks if an element or its ancestors should be skipped (e.g. code blocks, user messages).
 */
function shouldIgnoreElement(el: Element | null): boolean {
  let curr: Element | null = el
  while (curr && curr !== document.body) {
    if (IGNORED_TAGS.has(curr.tagName)) return true
    for (const cls of IGNORED_CLASSES) {
      if (curr.classList?.contains(cls)) return true
    }
    // Also skip user input contenteditable (except placeholders)
    if (curr.getAttribute('contenteditable') === 'true' && curr.tagName !== 'INPUT' && curr.tagName !== 'TEXTAREA') {
      return true
    }
    curr = curr.parentElement
  }
  return false
}

/**
 * Translates a single text node if a match is found.
 */
function processTextNode(node: Text): void {
  if (!node.nodeValue) return
  if (shouldIgnoreElement(node.parentElement)) return

  const translated = translatePhrase(node.nodeValue)
  if (translated !== undefined && translated !== node.nodeValue) {
    node.nodeValue = translated
  }
}

/**
 * Translates targeted attributes on an element.
 */
function processElementAttributes(el: Element): void {
  if (shouldIgnoreElement(el)) return

  for (const attr of TARGET_ATTRIBUTES) {
    const val = el.getAttribute(attr)
    if (val) {
      const translated = translatePhrase(val)
      if (translated !== undefined && translated !== val) {
        el.setAttribute(attr, translated)
      }
    }
  }
}

/**
 * Recursively scans and translates a DOM tree root.
 */
export function translateDomTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    processTextNode(root as Text)
    return
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as Element
    if (shouldIgnoreElement(el)) return
    processElementAttributes(el)

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (shouldIgnoreElement(node as Element)) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        }
        if (node.nodeType === Node.TEXT_NODE) {
          if (shouldIgnoreElement(node.parentElement)) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_SKIP
      },
    })

    let current: Node | null = walker.nextNode()
    while (current) {
      if (current.nodeType === Node.TEXT_NODE) {
        processTextNode(current as Text)
      } else if (current.nodeType === Node.ELEMENT_NODE) {
        processElementAttributes(current as Element)
      }
      current = walker.nextNode()
    }
  }
}

/**
 * Flushes pending mutated nodes in microtask / animation frame.
 */
function flushPending(): void {
  scheduled = false
  const nodes = pendingNodes
  pendingNodes = []

  // Ensure document lang is ru
  if (document.documentElement.lang !== 'ru') {
    document.documentElement.lang = 'ru'
  }

  for (const node of nodes) {
    try {
      translateDomTree(node)
    } catch {
      // Ignore errors in detached or changing nodes
    }
  }
}

/**
 * Starts the global DOM translation observer.
 */
export function startDomTranslator(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  if (observer) {
    return () => stopDomTranslator()
  }

  // Initial full document scan
  if (document.body) {
    translateDomTree(document.body)
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) translateDomTree(document.body)
    })
  }

  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (let i = 0; i < m.addedNodes.length; i++) {
          const node = m.addedNodes[i]
          if (node) pendingNodes.push(node)
        }
      } else if (m.type === 'characterData') {
        if (m.target) pendingNodes.push(m.target)
      } else if (m.type === 'attributes') {
        if (m.target) pendingNodes.push(m.target)
      }
    }

    if (!scheduled && pendingNodes.length > 0) {
      scheduled = true
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(flushPending)
      } else {
        setTimeout(flushPending, 16)
      }
    }
  })

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: TARGET_ATTRIBUTES,
  })

  return () => stopDomTranslator()
}

/**
 * Stops the global DOM translation observer.
 */
export function stopDomTranslator(): void {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  pendingNodes = []
  scheduled = false
}
