export default class Events {
  constructor() {
    this.audioEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
    this.events = {}
  }

  on(name, callback) {
    if (!this.audioEvents.includes(name) || typeof callback !== 'function') {
      console.error('invalid event name or callback function')
    } else {
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
}
