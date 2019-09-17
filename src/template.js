import PlayerTemplate from './templates/PlayerTemplate'
import IconTemplate from './templates/IconTemplate'
import { secondToTime, carousel } from './utils'

let carouselTimeout, carouselInterval, resize

export default class Template {
  constructor(options) {
    this.mounted = false
    const iconExists = document.querySelector('.shk_icons')
    if (!iconExists) {
      this.icons = document.createElement('div')
      this.icons.classList.add('shk_icons')
      this.icons.innerHTML = IconTemplate
    }
    this.initVariable()
    this.initOptions(options)
  }

  initVariable() {
    this.el = document.createElement('div')
    this.el.tabIndex = 0
    this.el.classList.add('shk')
    this.el.innerHTML = PlayerTemplate
    this.playBtn = this.el.querySelector('.shk_btn_toggle')
    this.fwdBtn = this.el.querySelector('.shk_btn_forward')
    this.bwdBtn = this.el.querySelector('.shk_btn_backward')
    this.speedBtn = this.el.querySelector('.shk_btn_speed')
    this.moreBtn = this.el.querySelector('.shk_btn_more')
    this.muteBtn = this.el.querySelector('.shk_btn_volume')
    this.extra = this.el.querySelector('.shk_extra')
    this.extraControls = this.el.querySelector('.shk_extra_controls')
    this.texts = this.el.querySelector('.shk_text')
    this.artist = this.el.querySelector('.shk_artist')
    this.artistWrap = this.el.querySelector('.shk_artist-wrap')
    this.title = this.el.querySelector('.shk_title')
    this.currentTime = this.el.querySelector('.shk_time_now')
    this.duration = this.el.querySelector('.shk_time_duration')
    this.bar = this.el.querySelector('.shk_bar')
    this.barWrap = this.el.querySelector('.shk_bar-wrap')
    this.audioPlayed = this.el.querySelector('.shk_bar_played')
    this.audioLoaded = this.el.querySelector('.shk_bar_loaded')
    this.handle = this.el.querySelector('.shk_bar-handle')
    this.cover = this.el.querySelector('.shk_cover')
  }

  initOptions(options) {
    this.el.style = `--theme-color: ${options.themeColor}`
    this.el.style.boxShadow = `2px 2px 6px 0px ${options.themeColor}21`
    this.audioPlayed.style.color = options.themeColor + '80'

    options.autoPlay ? this.el.classList.add('Play') : this.el.classList.add('Pause')
    if (options.download && options.audio && options.audio.src) {
      this.downloadBtn = document.createElement('button')
      this.downloadBtn.title = 'download'
      this.downloadBtn.setAttribute('aria-label', 'download')
      this.downloadBtn.classList.add('shk_btn', 'shk_btn_download')
      this.downloadBtn.innerHTML = /* html */`
        <svg aria-hidden="true">
          <use xlink:href="#shk_icon_download" />
        </svg>
      `
      this.extraControls.append(this.downloadBtn)
      this.downloadBtn.href = options.audio.src
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
    if (this.downloadBtn) {
      this.downloadBtn.href= audio.src
    }
  }

  textScroll() {
    if (carouselInterval) {
      clearInterval(carouselInterval)
      clearTimeout(carouselTimeout)
    }
    const titleOverflow = this.title.offsetWidth - this.texts.offsetWidth
    if (titleOverflow > 0) {
      [carouselTimeout, carouselInterval] = carousel(this.title, titleOverflow)
      this.title.parentNode.classList.add('Overflow')
    } else {
      this.title.parentNode.classList.remove('Overflow')
      this.title.style.transform = 'none'
      this.title.style.transitionDuration = '0s'
    }
  }

  initEvents() {
    this.moreBtn.addEventListener('click', () => {
      this.el.classList.toggle('Extra')
    })
    this.extra.addEventListener('click', () => {
      this.el.classList.remove('Extra')
    })
    resize = this.textScroll.bind(this)
    window.addEventListener('resize', resize)
  }

  mount(container) {
    container.innerHTML = ''
    container.append(this.el)
    if (this.icons) {
      container.append(this.icons)
    }
    this.mounted = true
    this.initEvents()
    this.textScroll()
  }

  destroy() {
    if (clearInterval) {
      clearInterval(carouselInterval)
      clearTimeout(carouselTimeout)
    }
    window.removeEventListener('resize', resize)
  }
}
