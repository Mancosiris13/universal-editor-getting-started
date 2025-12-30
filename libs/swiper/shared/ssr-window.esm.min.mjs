function isObject(e) { return e !== null && typeof e === 'object' && 'constructor' in e && e.constructor === Object; } function extend(e = {}, t = {}) { const n = ['__proto__', 'constructor', 'prototype']; Object.keys(t).filter((e) => n.indexOf(e) < 0).forEach((n) => { void 0 === e[n] ? e[n] = t[n] : isObject(t[n]) && isObject(e[n]) && Object.keys(t[n]).length > 0 && extend(e[n], t[n]); }); } const ssrDocument = {
  body: {},
  addEventListener() {},
  removeEventListener() {},
  activeElement: { blur() {}, nodeName: '' },
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  createEvent: () => ({ initEvent() {} }),
  createElement: () => ({
    children: [], childNodes: [], style: {}, setAttribute() {}, getElementsByTagName: () => [],
  }),
  createElementNS: () => ({}),
  importNode: () => null,
  location: {
    hash: '', host: '', hostname: '', href: '', origin: '', pathname: '', protocol: '', search: '',
  },
}; function getDocument() { const e = typeof document !== 'undefined' ? document : {}; return extend(e, ssrDocument), e; } const ssrWindow = {
  document: ssrDocument,
  navigator: { userAgent: '' },
  location: {
    hash: '', host: '', hostname: '', href: '', origin: '', pathname: '', protocol: '', search: '',
  },
  history: {
    replaceState() {}, pushState() {}, go() {}, back() {},
  },
  CustomEvent() { return this; },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia: () => ({}),
  requestAnimationFrame: (e) => (typeof setTimeout === 'undefined' ? (e(), null) : setTimeout(e, 0)),
  cancelAnimationFrame(e) { typeof setTimeout !== 'undefined' && clearTimeout(e); },
}; function getWindow() { const e = typeof window !== 'undefined' ? window : {}; return extend(e, ssrWindow), e; } export { getWindow as a, getDocument as g };
// # sourceMappingURL=ssr-window.esm.min.mjs.map
