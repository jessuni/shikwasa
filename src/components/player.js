import playerElement from '../template/player.html'
import Template from './template'
import Bar from './bar'
import { secondToTime, carousel, numToString, handleOptions } from '../utils'

let carouselInterval, pressSpace
const isMobile = /mobile/i.test(window.navigator.userAgent)
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'

class Player {
  constructor(options) {
    this.el = document.createElement('div')
    this.el.classList.add('shk')
    this.options = handleOptions(options)
    this.inited = false
    this.initAudio()
    this.muted = this.options.muted
    this.initUI()
    this.initKeyEvents()
    this.dragging = false
    this.currentSpeed = 1
    this.currentTime = 0
    this.mount(this.options.container)
    this.afterMount()
  }

  get duration() {
    if (!this.audio) {
      return this.options.audio.duration
    } else {
      return isNaN(this.audio.duration) ? 0 : this.audio.duration
    }
  }

  initUI() {
    this.el.innerHTML = playerElement
    this.el.style = `--theme-color: ${this.options.themeColor}`
    this.el.style.boxShadow = `0px 0px 14px 6px ${this.options.themeColor}20`
    this.template = new Template(this.el, this.options)
    this.bar = new Bar(this.template)
    this.initOptions()
    this.initButtons()
    this.initBar()
  }

  initOptions() {
    if (this.options.fixed.type !== 'static' ) {
      this.options.fixed.type === 'fixed' ? this.el.classList.add('Fixed') : this.el.classList.add('Auto')
      if (this.options.fixed.position === 'top') {
        this.el.classList.add('Top')
      }
    }
    if (this.options.muted) {
      this.el.classList.add('Mute')
    }
    this.options.autoPlay ? this.el.classList.add('Play') : this.el.classList.add('Pause')
  }

  initButtons() {
    this.template.playBtn.addEventListener('click', () => {
      this.toggle()
    })
    this.template.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted
      this.el.classList.toggle('Mute')
      if (this.audio) {
        this.audio.muted = this.muted
      }
    })
    this.template.fwdBtn.addEventListener('click', () => {
      const time = Math.min(this.duration, this.currentTime + 10)
      this.seek(time)
    })
    this.template.bwdBtn.addEventListener('click', () => {
      const time = Math.max(0, this.currentTime - 10)
      this.seek(time)
    })
    this.template.speedBtn.addEventListener('click', () => {
      const index = this.options.speedOptions.indexOf(this.currentSpeed)
      const speedRange = this.options.speedOptions
      this.currentSpeed = (index + 1 >= speedRange.length) ? speedRange[0] : speedRange[index + 1]
      this.template.speedBtn.innerHTML = numToString(this.currentSpeed) + 'x'
      if (this.audio) {
        this.audio.playbackRate = this.currentSpeed
      }
    })
  }

  initBar() {
    const dragStartHandler = () => {
      this.el.classList.add('Seeking')
      this.dragging = true
      document.addEventListener(dragMove, dragMoveHandler)
      document.addEventListener(dragEnd, dragEndHandler)
    }

    const dragMoveHandler = (e) => {
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - this.template.barWrap.getBoundingClientRect().left) / this.template.barWrap.clientWidth
      percentage = Math.min(percentage, 1)
      percentage = Math.max(0, percentage)
      this.bar.set('audioPlayed', percentage)
      this.currentTime = percentage * this.duration
      this.template.currentTime.innerHTML = secondToTime(this.currentTime)
    }

    const dragEndHandler = (e) => {
      this.dragging = false
      this.el.classList.remove('Seeking')
      this.seek(this.currentTime)
      document.removeEventListener(dragMove, dragMoveHandler)
      document.removeEventListener(dragEnd, dragEndHandler)
    }

    const instantSeek = (e) => {
      if (this.dragging) return
      dragMoveHandler(e)
      this.seek(this.currentTime)
    }
    this.template.barWrap.addEventListener(dragEnd, instantSeek)
    this.template.handle.addEventListener(dragStart, dragStartHandler)
  }

  initKeyEvents() {
    pressSpace = (e) => {
      if (e.keyCode === 32) {
        this.toggle()
      }
    }
    document.addEventListener('keyup', pressSpace)
  }

  initAudio() {
    if (this.options.audio.src) {
      this.audio = new Audio()
      this.initLoadingEvents()
      this.initAudioEvents()
      if (this.options.preload !== 'none') {
        this.updateAudio(this.options.audio.src)
        this.inited = true
      }
    }
  }

  initAudioEvents() {
    this.audio.addEventListener('play', () => {
      if (this.el.classList.contains('Pause')) {
        this.setUIPlaying()
      }
    })
    this.audio.addEventListener('pause', () => {
      if (this.el.classList.contains('Pause')) {
        this.setUIPaused()
      }
    })
    this.audio.addEventListener('ended', () => {
      this.setUIPaused()
      this.seek(0)
    })
    this.audio.addEventListener('durationchange', () => {
      if (this.duration !== 1) {
        this.template.duration.innerHTML = secondToTime(this.duration)
      }
    })
    this.audio.addEventListener('progress', () => {
      if (this.audio.buffered.length) {
        const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0
        this.bar.set('audioLoaded', percentage)
      }
    })
    this.audio.addEventListener('timeupdate', () => {
      if (this.dragging) return
      if (Math.floor(this.currentTime) !== Math.floor(this.audio.currentTime)) {
        this.template.currentTime.innerHTML = secondToTime(this.audio.currentTime)
        this.currentTime = +this.audio.currentTime
        const percentage = this.audio.currentTime ? this.audio.currentTime / this.duration : 0
        this.bar.set('audioPlayed', percentage)
      }
    })
  }

  initLoadingEvents() {
    const addLoadingClass = () => {
      if (this.el.classList.contains('Loading')) {
        this.el.classList.remove('Loading')
      }
    }
    this.audio.addEventListener('canplay', () => {
      addLoadingClass()
    })
    this.audio.addEventListener('canplaythrough', () => {
      addLoadingClass()
    })
    this.audio.addEventListener('waiting', () => {
      if (!this.el.classList.contains('Loading')) {
        this.el.classList.add('Loading')
      }
    })
  }

  setUIPlaying() {
    this.el.classList.add('Play')
    this.el.classList.remove('Pause')
  }

  setUIPaused() {
    this.el.classList.add('Pause')
    this.el.classList.remove('Play')
    this.el.classList.remove('Loading')
  }

  play(audio) {
    if (!this.inited) {
      this.audio.src = this.options.audio.src
      this.inited = true
    }
    if (audio && audio.src) {
      this.template.update(audio)
      this.currentTime = 0
      this.updateAudio(audio.src)
    }
    if (!this.audio.paused) return
    this.setUIPlaying()
    const promise = this.audio.play()
    if (promise instanceof Promise) {
      promise.catch((e) => {
        if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
          this.pause()
        }
      })
    }
  }

  pause() {
    if (this.audio.paused) return
    this.setUIPaused()
    this.audio.pause()
  }

  toggle() {
    if (!this.inited) {
      this.audio.src = this.options.audio.src
      this.inited = true
    }

    this.audio.paused ? this.play() : this.pause()
  }

  seek(time) {
    time = Math.min(time, this.duration)
    time = Math.max(time, 0)
    this.template.currentTime.innerHTML = secondToTime(time)
    if (this.audio) {
      this.audio.currentTime = time
    } else {
      this.currentTime = time
    }
  }

  updateAudio(src) {
    this.audio.src = src
    this.audio.autoplay = false
    this.audio.preload = this.options.preload
    this.audio.autoplay = this.options.autoPlay
    this.audio.muted = this.muted
    this.audio.currentTime = this.currentTime
    this.audio.playbackRate = this.currentSpeed
  }

  mount(container) {
    container.append(this.el)
  }

  afterMount() {
    const titleOverflow = this.template.title.offsetWidth - this.template.texts.offsetWidth
    if (titleOverflow > 0) {
      carouselInterval = carousel(this.template.title, -titleOverflow, this.options.transitionDuration)
    }
  }

  destroy() {
    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
    this.audio = null
    clearInterval(carouselInterval)
    document.removeEventListener('keyup', pressSpace)
  }
}

export default Player
