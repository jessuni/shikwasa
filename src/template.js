import playerTemplate from './template/player.html'
import iconTemplate from './template/icons.html'
import { secondToTime, carousel } from './utils'

let carouselTimeout, carouselInterval

export default class Template {
  constructor(options) {
    this.mounted = false
    const iconExists = document.querySelector('.shk_icons')
    if (!iconExists) {
      this.icons = document.createElement('div')
      this.icons.classList.add('shk_icons')
      this.icons.innerHTML = iconTemplate
    }
    this.initVariable()
    this.initOptions(options)
  }

  initVariable() {
    this.el = document.createElement('div')
    this.el.tabIndex = 0
    this.el.classList.add('shk')
    this.el.innerHTML = playerTemplate
    this.playBtn = this.el.querySelector('.shk_btn_toggle')
    this.downloadBtn = this.el.querySelector('.shk_btn_download')
    this.fwdBtn = this.el.querySelector('.shk_btn_forward')
    this.bwdBtn = this.el.querySelector('.shk_btn_backward')
    this.speedBtn = this.el.querySelector('.shk_btn_speed')
    this.muteBtn = this.el.querySelector('.shk_btn_volume')
    this.artist = this.el.querySelector('.shk_subtitle')
    this.texts = this.el.querySelector('.shk_text')
    this.title = this.el.querySelector('.shk_title')
    this.subtitle = this.el.querySelector('.shk_subtitle')
    this.currentTime = this.el.querySelector('.shk_time_now')
    this.duration = this.el.querySelector('.shk_time_duration')
    this.bar = this.el.querySelector('.shk_bar')
    this.barWrap = this.el.querySelector('.shk_bar-wrap')
    this.audioPlayed = this.el.querySelector('.shk_bar_played')
    this.audioLoaded = this.el.querySelector('.shk_bar_loaded')
    this.handle = this.el.querySelector('.bar-handle')
    this.cover = this.el.querySelector('.shk_img')
  }

  initOptions(options) {
    this.transitionSpeed = options.transitionSpeed
    this.el.style = `--theme-color: ${options.themeColor}`
    this.el.style.boxShadow = `0px 0px 14px 6px ${options.themeColor}20`
    this.audioPlayed.style.color = options.themeColor + '70'
    options.autoPlay ? this.el.classList.add('Play') : this.el.classList.add('Pause')
    if (options.download && options.audio && options.audio.src) {
      this.downloadBtn.href = options.audio.src
    } else {
      this.downloadBtn.remove()
    }
    if (options.fixed.type !== 'static') {
      options.fixed.type === 'fixed' ? this.el.classList.add('Fixed') : this.el.classList.add('Auto')
      if (options.fixed.position === 'top') {
        this.el.classList.add('Top')
      }
    }
    if (options.muted) {
      this.el.classList.add('Mute')
    }
    if (options.audio) {
      this.update(options.audio)
    }
  }

  update(audio) {
    this.cover.style.backgroundImage = `url(${audio.cover})`
    this.title.innerHTML = audio.title
    if (this.mounted) {
      this.textScroll()
    }
    this.artist.innerHTML = audio.artist
    this.currentTime.innerHTML = '00:00'
    this.duration.innerHTML = audio.duration ? secondToTime(audio.duration) : '00:00'
    this.downloadBtn.href= audio.src
  }

  textScroll() {
    if (carouselInterval) {
      clearInterval(carouselInterval)
      clearTimeout(carouselTimeout)
    }
    const titleOverflow = this.title.offsetWidth - this.texts.offsetWidth
    if (titleOverflow > 0) {
      [carouselTimeout, carouselInterval] = carousel(this.title, titleOverflow, this.transitionSpeed)
    } else {
      this.title.style.transform = 'none'
      this.title.style.transitionDuration = '0s'
    }
  }

  mount(container) {
    container.innerHTML = ''
    container.append(this.el)
    if (this.icons) {
      container.append(this.icons)
    }
    this.mounted = true
    this.textScroll()
  }

  destroy() {
    if (clearInterval) {
      clearInterval(carouselInterval)
      clearTimeout(carouselTimeout)
    }
  }
}
