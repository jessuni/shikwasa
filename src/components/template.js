import { secondToTime } from '../utils'

export default class Template {
  constructor(el, options) {
    if (!el) return
    this.playBtn = el.querySelector('.shk_cover .shk_btn')
    this.downloadBtn = el.querySelector('.shk_btn_download')
    this.fwdBtn = el.querySelector('.shk_btn_forward')
    this.bwdBtn = el.querySelector('.shk_btn_backward')
    this.speedBtn = el.querySelector('.shk_btn_speed')
    this.muteBtn = el.querySelector('.shk_btn_volume')
    this.artist = el.querySelector('.shk_subtitle')
    this.texts = el.querySelector('.shk_text')
    this.title = el.querySelector('.shk_title')
    this.subtitle = el.querySelector('.shk_subtitle')
    this.currentTime = el.querySelector('.shk_time_now')
    this.duration = el.querySelector('.shk_time_duration')
    this.bar = el.querySelector('.shk_bar')
    this.barWrap = el.querySelector('.shk_bar-wrap')
    this.audioPlayed = el.querySelector('.shk_bar_played')
    this.audioLoaded = el.querySelector('.shk_bar_loaded')
    this.handle = el.querySelector('.bar-handle')
    this.cover = el.querySelector('.shk_img')

    this.audioPlayed.style.color = options.themeColor + '70'
      if (options.download && options.audio && options.audio.src) {
      this.downloadBtn.href= options.audio.src
    } else {
      this.downloadBtn.remove()
    }
    if (options.audio) {
      this.update(options.audio)
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
