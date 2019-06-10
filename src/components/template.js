import { secondToTime } from '../utils'

export default class Template {
  constructor(container, audio) {
    if (!container) {
      console.error('specify container for template')
    } else {
      this.playBtn = container.querySelector('.shk_left .shk_btn')
      const btns = container.querySelectorAll('.shk_right .shk_btn')
      this.speedBtn = btns[0]
      this.muteBtn = btns[1]
      this.artist = container.querySelector('.shk_subtitle')
      this.title = container.querySelector('.shk_title')
      this.currentTime = container.querySelector('.shk_time_now')
      this.duration = container.querySelector('.shk_time_duration')
      this.bar = container.querySelector('.shk_bar')
      this.barWrap = container.querySelector('.shk_bar-wrap')
      this.audioPlayed = container.querySelector('.shk_bar_played')
      this.audioLoaded = container.querySelector('.shk_bar_loaded')
      this.handle = container.querySelector('.bar-handle')
      this.cover = container.querySelector('.shk_cover img')

      this.audioPlayed.style.color = this.handle.style.color + '70'

      this.cover.src = audio.cover
      this.title.innerHTML = audio.title
      this.artist.innerHTML = audio.artist
      this.currentTime.innerHTML = '0:00'
      this.duration.innerHTML = audio.duration ? secondToTime(audio.duration) : '0:00'
    }
  }
}
