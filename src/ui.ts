import { Options, IAudio, TComponents, TButtonComponents, Bar } from './types'
import PlayerComp from './templates/Player'
import IconComp from './templates/Icon'
import { secondToTime, numToString, marquee, createElement, toggleAttribute } from './utils'
import applyFocusVisible from './focus-visible'

let resize: () => void
let coverUrl: string | undefined
let cooldown: boolean = true

export default class UI {
  mounted: boolean
  el: HTMLElement
  icons: HTMLElement
  playBtn: TButtonComponents
  fwdBtn: TButtonComponents
  bwdBtn: TButtonComponents
  speedBtn: TButtonComponents
  moreBtn: TButtonComponents
  muteBtn: TButtonComponents
  extraControls: TComponents
  texts: TComponents
  artist: TComponents
  artistWrap: TComponents
  titleWrap: TComponents
  titleInner: TComponents
  title: TComponents
  currentTime: TComponents
  duration: TComponents
  bar: TComponents
  barWrap: TComponents
  audioPlayed: TComponents
  audioLoaded: TComponents
  handle: TButtonComponents
  cover: TComponents
  downloadBtn: HTMLAnchorElement
  seekControls: Array<TComponents>

  constructor(options: Options) {
    this.mounted = false
    if (!document.querySelector('.shk-icons')) {
      this.icons = createElement({
        className: 'shk-icons',
        innerHTML: IconComp,
      })
    }
    this.initEl()
    this.initOptions(options)
  }

  async initEl() {
    this.el = createElement({
      className: ['shk', 'shikwasa'],
      attrs: {
        'data-name': 'shikwasa',
      },
      innerHTML: PlayerComp,
    })
    this.playBtn = this.el.querySelector('.shk-btn_toggle')
    this.fwdBtn = this.el.querySelector('.shk-btn_forward')
    this.bwdBtn = this.el.querySelector('.shk-btn_backward')
    this.speedBtn = this.el.querySelector('.shk-btn_speed')
    this.moreBtn = this.el.querySelector('.shk-btn_more')
    this.muteBtn = this.el.querySelector('.shk-btn_volume')
    this.extraControls = this.el.querySelector('.shk-controls_extra')
    this.texts = this.el.querySelector('.shk-text')
    this.artist = this.el.querySelector('.shk-artist')
    this.artistWrap = this.el.querySelector('.shk-artist_wrap')
    this.titleWrap = this.el.querySelector('.shk-title_wrap')
    this.titleInner = this.el.querySelector('.shk-title_inner')
    this.title = this.el.querySelector('.shk-title')
    this.currentTime = this.el.querySelector('.shk-time_now')
    this.duration = this.el.querySelector('.shk-time_duration')
    this.bar = this.el.querySelector('.shk-bar')
    this.barWrap = this.el.querySelector('.shk-bar_wrap')
    this.audioPlayed = this.el.querySelector('.shk-bar_played')
    this.audioLoaded = this.el.querySelector('.shk-bar_loaded')
    this.handle = this.el.querySelector('.shk-bar-handle')
    this.cover = this.el.querySelector('.shk-cover')
    this.seekControls = [
      this.fwdBtn,
      this.bwdBtn,
      this.handle,
    ]
  }

  initOptions(options: Options): void {

    // dark mode
    this.el.style.setProperty('--color-primary', options.themeColor)
    this.el.setAttribute('data-theme', options.theme)

    // download
    if (options.download && options.audio && options.audio.src) {
      this.downloadBtn = createElement({
        tag: 'a',
        className: ['shk-btn', 'shk-btn_download'],
        attrs: {
          title: 'download',
          'aria-label': 'download',
          href: typeof options.download === 'string' ? options.download : options.audio.src,
          download: '',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        innerHTML: /* html */`
          <svg aria-hidden="true">
            <use xlink:href="#shk-icon_download" />
          </svg>
        `,
      })
      this.extraControls?.append(this.downloadBtn)
    }

    // player position
    this.el.setAttribute('data-fixed-type', options.fixed.type)
    if (options.fixed.type !== 'static' && options.fixed.position === 'top') {
      this.el.setAttribute('data-fixed-pos', options.fixed.position)
    }

    // player status display
    const playStatus = options.autoPlay ? 'playing' : 'paused'
    this.el.setAttribute('data-play', playStatus)

    // mute status display
    if (options.muted) {
      this.el.setAttribute('data-mute', '')
    }
  }

  initEvents(supportsPassive: boolean): void {
    this.moreBtn?.addEventListener('click', () => {
      toggleAttribute(this.el, 'data-extra')
    })
    if (this.extraControls?.children.length) {
      Array.from(this.extraControls.children).forEach((el: HTMLElement) => {
        this.hideExtraControl(el)
      })
    }

    // add keyboard focus style
    applyFocusVisible(this.el, supportsPassive)

    resize = (): void => {
      if (!cooldown) return
      cooldown = false
      setTimeout(() => cooldown = true, 100)
      marquee.call(this, this.titleWrap, this.title)
    }
    window.addEventListener('resize', resize)
  }

  setAudioInfo(audio: IAudio): void {
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl)
      coverUrl = undefined
    }
    if (/blob/.test(audio.cover)) {
      coverUrl = audio.cover
    }

    const bgString = audio.cover ? 'url(${audio.cover})' : 'none'
    this.cover?.style.setProperty('backgroundImage', bgString)

    if (this.title) {
      this.title.innerHTML = audio.title
    }
    this.titleInner?.setAttribute('data-title', audio.title)
    if (this.artist) {
      this.artist.innerHTML = audio.artist
    }
    if (audio.duration && this.duration) {
      this.duration.innerHTML = secondToTime(audio.duration)
    }
    if (this.downloadBtn) {
      this.downloadBtn.href= audio.src
    }
    this.setBar('loaded', 0)
  }

  setPlaying(): void {
    this.el.setAttribute('data-play', 'playing')
  }

  setPaused(): void {
    this.el.setAttribute('data-play', 'paused')
    this.el.removeAttribute('data-loading')
  }

  setTime(type: 'duration' | 'currentTime', time: number): void {
    if (this[type]) {
      (this[type] as HTMLElement).innerHTML = secondToTime(time)
    }
  }

  setBar(type: 'played' | 'loaded', percentage: number): void {
    percentage = Math.min(percentage, 1)
    percentage = Math.max(percentage, 0)
    const ariaNow = percentage.toFixed(2)
    this.handle?.setAttribute('aria-valuenow', ariaNow)
    if (this[Bar[type]]) {
      this[Bar[type]]!.style.width = percentage * 100 + '%'
      this[Bar[type]]!.setAttribute('aria-valuenow', ariaNow)
    }
  }

  setProgress(time = 0, percentage = 0, duration = 0): void {
    if (time && !percentage) {
      percentage = duration ? time / duration : 0
    } else {
      time = percentage * (duration || 0)
    }
    this.setTime('currentTime', time)
    this.setBar('played', percentage)
  }

  setSpeed(speed: number): void {
    if (this.speedBtn) {
      this.speedBtn.innerHTML = numToString(speed) + 'x'
    }
  }

  getPercentByPos(e: MouseEvent | TouchEvent): number {
    let handlePos: number = 0
    if (e instanceof TouchEvent) {
      handlePos = e.changedTouches[0]?.clientX
    } else {
      handlePos = e.clientX
    }
    const initPos = this.barWrap?.getBoundingClientRect().left || 0
    const barLength = this.barWrap?.clientWidth || 0
    let percentage = (handlePos - initPos) / barLength
    percentage = Math.min(percentage, 1)
    percentage = Math.max(0, percentage)
    return percentage
  }

  hideExtraControl(el: HTMLElement): void {
    el.addEventListener('click', () => {
      setTimeout(() => {
        this.el.removeAttribute('data-extra')
      }, 800)
    })
  }

  mount(container: HTMLElement, supportsPassive: boolean): void {
    container.innerHTML = ''
    container.append(this.el)
    if (this.icons) {
      container.append(this.icons)
    }
    this.mounted = true
    this.initEvents(supportsPassive)
    if (this.titleWrap && this.title) {
      marquee(this.titleWrap, this.title)
    }
  }

  destroy(): void {
    window.removeEventListener('resize', resize)
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl)
    }
  }
}
