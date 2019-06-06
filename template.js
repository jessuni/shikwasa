import { secondToTime } from './utils'
class Template {
  constructor(container, audio) {
    if (!container) {
      console.error('specify container for template')
    } else {
      this.playBtn = container.querySelector('.player-left .player-btn')
      this.muteBtn = container.querySelector('.player-right .player-btn')
      this.artist = container.querySelector('.player-subtitle')
      this.title = container.querySelector('.player-title')
      this.currentTime = container.querySelector('.time-now')
      this.duration = container.querySelector('.time-duration')
      this.audioPlayed = container.querySelector('.bar-played')
      this.audioLoaded = container.querySelector('.bar-loaded')
      this.handle = container.querySelector('.bar-handle')
      this.cover = container.querySelector('.player-cover img')

      this.cover.src = audio.cover
      this.title.innerHTML = audio.title
      this.artist.innerHTML = audio.artist
      this.currentTime.innerHTML = '0:00'
      this.duration.innerHTML = audio.duration ? audio.duration : '0:00'
    }
  }
}

export default Template
