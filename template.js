import { secondToTime } from './utils'

export default class Template {
  constructor(container, audio) {
    if (!container) {
      console.error('specify container for template')
    } else {
      this.playBtn = container.querySelector('.player-left .player-btn')
      const btns = container.querySelectorAll('.player-right .player-btn')
      this.speed = btns[0]
      this.muteBtn = btns[1]
      this.artist = container.querySelector('.player-subtitle')
      this.title = container.querySelector('.player-title')
      this.currentTime = container.querySelector('.time-now')
      this.duration = container.querySelector('.time-duration')
      this.bar = container.querySelector('.player-bar')
      this.barWrap = container.querySelector('.player-bar-wrap')
      this.audioPlayed = container.querySelector('.bar-played')
      this.audioLoaded = container.querySelector('.bar-loaded')
      this.handle = container.querySelector('.bar-handle')
      this.cover = container.querySelector('.player-cover img')

      this.cover.src = audio.cover
      this.title.innerHTML = audio.title
      this.artist.innerHTML = audio.artist
      this.currentTime.innerHTML = '0:00'
      this.duration.innerHTML = audio.duration ? secondToTime(audio.duration) : '0:00'
    }
  }
}
