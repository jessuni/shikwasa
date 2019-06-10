export default class Bar {
  constructor(template) {
    this.elements = {}
    this.elements.audioPlayed = template.audioPlayed
    this.elements.audioLoaded = template.audioLoaded
  }

  set (type, percentage) {
    percentage = Math.min(percentage, 1)
    percentage = Math.max(percentage, 0)
    this.elements[type].style.width = percentage * 100 + '%'
  }

  get(type) {
    return parseFloat(this.elements[type].style.width) / 100
  }
}
