export function mockSetElStyle(el, property, value) {
  Object.defineProperty(el, property, {
    configurable: true,
    value,
  })
}
