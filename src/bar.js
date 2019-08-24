export default class Bar {
  constructor(template) {
    this.audioPlayed = template.audioPlayed
    this.audioLoaded = template.audioLoaded
  }

  set (type, percentage) {
    percentage = Math.min(percentage, 1)
    percentage = Math.max(percentage, 0)
    this[type].style.width = percentage * 100 + '%'
  }
}
