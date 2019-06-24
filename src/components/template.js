import { secondToTime } from '../utils'

export default class Template {
  constructor(container, audio, themeColor) {
    if (!container) return
    this.playBtn = container.querySelector('.shk_left .shk_btn')
    this.fwdBtn = container.querySelector('.shk_btn_forward')
    this.bwdBtn = container.querySelector('.shk_btn_backward')
    this.speedBtn = container.querySelector('.shk_btn_speed')
    this.muteBtn = container.querySelector('.shk_btn_volume')
    this.artist = container.querySelector('.shk_subtitle')
    this.texts = container.querySelector('.shk_text')
    this.title = container.querySelector('.shk_title')
    this.subtitle = container.querySelector('.shk_subtitle')
    this.currentTime = container.querySelector('.shk_time_now')
    this.duration = container.querySelector('.shk_time_duration')
    this.bar = container.querySelector('.shk_bar')
    this.barWrap = container.querySelector('.shk_bar-wrap')
    this.audioPlayed = container.querySelector('.shk_bar_played')
    this.audioLoaded = container.querySelector('.shk_bar_loaded')
    this.handle = container.querySelector('.bar-handle')
    this.cover = container.querySelector('.shk_cover')

    this.audioPlayed.style.color = themeColor + '70'
    if (audio) {
      this.update(audio)
    }
  }

  update(audio) {
    this.cover.style.backgroundImage = `url(${audio.cover})`
    this.title.innerHTML = audio.title
    this.artist.innerHTML = audio.artist
    this.currentTime.innerHTML = '00:00'
    this.duration.innerHTML = audio.duration ? secondToTime(audio.duration) : '00:00'
  }
}
