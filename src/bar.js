export default class Bar {
  constructor(template) {
    this.audioPlayed = template.audioPlayed
    this.audioLoaded = template.audioLoaded
    this.handle = template.handle
  }

  set (type, percentage) {
    percentage = Math.min(percentage, 1)
    percentage = Math.max(percentage, 0)
    this[type].style.width = percentage * 100 + '%'
    const ariaNow = percentage.toFixed(2)
    this[type].setAttribute('aria-value-now', ariaNow)
    this.handle.setAttribute('aria-value-now', ariaNow)
  }
}
