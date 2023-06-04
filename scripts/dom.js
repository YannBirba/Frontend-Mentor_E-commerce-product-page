/**
 * @param {string} selector
 * @returns {Node|null}
 * @description Clones a template by its id.
 */
export const cloneTemplate = (selector) => {
  const template = document.querySelector(selector);
  if (!template || !(template instanceof HTMLTemplateElement)) {
    return null;
  }
  return template.content.cloneNode(true);
};

/**
 *
 * @param {string} selector
 * @returns {Element|null}
 */
export const getTag = (selector, parent = null) => {
  const parentTag = parent || document;
  const el = parentTag.querySelector(selector);
  if (!el) {
    null;
  }
  return el;
};
/**
 * @param {string} selector
 * @returns {NodeList|null}
 * @description Returns a list of elements by their selector.
 * @example
 * const tags = getTags(".carousel .images img");
 * if (!tags) {
 *  return;
 * }
 * tags.forEach((tag) => {
 * // do something with each tag
 * });
 */
export const getTags = (selector, parent = null) => {
  const parentTag = parent || document;
  const el = parentTag.querySelectorAll(selector);
  if (!el || el.length === 0) {
    null;
  }
  return el;
};
