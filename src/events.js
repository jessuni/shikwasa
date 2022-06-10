export default class Events {
  constructor() {
    this.audioEvents = ['abort', 'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
    this.playerEvents = ['audioupdate', 'audioparse']
    this.events = {}
  }

  on(name, callback) {
    if (this.type(name) && typeof callback == 'function') {
      if (!this.events[name]) {
        this.events[name] = []
      }
      this.events[name].push(callback)
    }
  }

  trigger(name, data = {}) {
    if (this.events[name] && this.events[name].length) {
      this.events[name].forEach(fn => fn(data))
    }
  }

  type(name) {
    if (this.playerEvents.indexOf(name) !== -1) {
      return 'player'
    } else if (this.audioEvents.indexOf(name) !== -1) {
      return 'audio'
    }
    console.error(`Shikwasa: unknown event name: ${name}`)
    return null
  }

  destroy() {
    this.events = {}
  }
}
