export default class Events {
  constructor() {
    this.audioEvents = ['abort', 'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
    this.playerEvents = ['audioupdate', 'audioparse']
    this.events = {}
  }

  on(name, callback, inner = false) {
    if (this.type(name) && typeof callback == 'function') {
      if (!this.events[name]) {
        this.events[name] = []
      }
      this.events[name].push({ callback, inner })
    }
  }

  trigger(name, data = {}, onlyInner = false) {
    if (this.events[name] && this.events[name].length) {
      this.events[name].forEach(v => {
        if(onlyInner) {
          if(v.inner) v.callback(data)
        }
        else {
          v.callback(data)
        }
      })
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
