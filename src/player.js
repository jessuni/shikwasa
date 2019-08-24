import Template from './template'
import Bar from './bar'
import Events from './events'
import { secondToTime, numToString, handleOptions } from './utils'

let pressSpace
const isMobile = /mobile/i.test(window.navigator.userAgent)
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'

class Player {
  constructor(options) {
    this.inited = false
    this.dragging = false
    this.options = handleOptions(options)
    this.muted = this.options.muted
    this.initUI()
    this.initKeyEvents()
    this.currentSpeed = 1
    this.currentTime = 0
    this.events = new Events()
    this.initAudio()
    this.template.mount(this.options.container)
  }

  get duration() {
    if (!this.audio || !this.audio.src) {
      return this.options.audio.duration
    } else {
      return isNaN(this.audio.duration) ? this.options.audio.duration : this.audio.duration
    }
  }

  initUI() {
    this.template = new Template(this.options)
    this.el = this.template.el
    this.bar = new Bar(this.template)
    this.initButtonEvents()
    this.initBarEvents()
  }

  initButtonEvents() {
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

  initBarEvents() {
    let seekingTime = 0
    const dragStartHandler = () => {
      this.el.classList.add('Seeking')
      this.dragging = true
      document.addEventListener(dragMove, dragMoveHandler)
      document.addEventListener(dragEnd, dragEndHandler)
    }
    const dragMoveHandler = (e) => {
      const offset = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0
      let percentage = (offset - this.template.barWrap.getBoundingClientRect().left) / this.template.barWrap.clientWidth
      percentage = Math.min(percentage, 1)
      percentage = Math.max(0, percentage)
      this.bar.set('audioPlayed', percentage)
      seekingTime = percentage * this.duration
      this.template.currentTime.innerHTML = secondToTime(seekingTime)
    }
    const dragEndHandler = () => {
      this.dragging = false
      this.el.classList.remove('Seeking')
      this.seek(seekingTime)
      document.removeEventListener(dragMove, dragMoveHandler)
      document.removeEventListener(dragEnd, dragEndHandler)
    }
    const instantSeek = (e) => {
      if (this.dragging) return
      dragMoveHandler(e)
      this.seek(seekingTime)
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
      this.events.audioEvents.forEach(name => {
        this.audio.addEventListener(name, (e) => {
          this.events.trigger(name, e)
        })
      })
      if (this.options.preload !== 'none') {
        this.updateAudio(this.options.audio.src)
        this.inited = true
      }
    }
  }

  initAudioEvents() {
    this.on('play', () => {
      if (this.el.classList.contains('Pause')) {
        this.setUIPlaying()
      }
    })
    this.on('pause', () => {
      if (this.el.classList.contains('Pause')) {
        this.setUIPaused()
      }
    })
    this.on('ended', () => {
      this.setUIPaused()
      this.seek(0)
    })
    this.on('durationchange', () => {
      if (this.duration !== 1) {
        this.template.duration.innerHTML = secondToTime(this.duration)
      }
    })
    this.on('progress', () => {
      if (this.audio.buffered.length) {
        const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0
        this.bar.set('audioLoaded', percentage)
      }
    })
    this.on('timeupdate', () => {
      if (Math.floor(this.currentTime) !== Math.floor(this.audio.currentTime)) {
        this.currentTime = +this.audio.currentTime
        if (!this.dragging) {
          this.template.currentTime.innerHTML = secondToTime(this.audio.currentTime)
          const percentage = this.audio.currentTime ? this.audio.currentTime / this.duration : 0
          this.bar.set('audioPlayed', percentage)
        }
      }
    })
  }

  initLoadingEvents() {
    const addLoadingClass = () => {
      if (this.el.classList.contains('Loading')) {
        this.el.classList.remove('Loading')
      }
    }
    this.on('canplay', () => {
      addLoadingClass()
    })
    this.on('canplaythrough', () => {
      addLoadingClass()
    })
    this.on('waiting', () => {
      if (!this.el.classList.contains('Loading')) {
        this.el.classList.add('Loading')
      }
    })
  }

  on(name, callback) {
    this.events.on(name, callback)
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
      this.updateAudio(audio.src)
      this.currentTime = 0
      this.seek(this.currentTime)
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
    this.currentTime = time
    if (this.audio) {
      this.audio.currentTime = time
    }
  }

  updateAudio(src) {
    this.audio.src = src
    this.audio.preload = this.options.preload
    this.audio.muted = this.muted
    if (this.options.autoplay && this.muted) {
      this.audio.autoplay = this.options.autoPlay
    }
    this.audio.playbackRate = this.currentSpeed
  }

  destroyAudio() {
    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
    this.audio = null
  }

  destroy() {
    this.destroyAudio()
    this.template.destroy()
    this.container.innerHTML = ''
    document.removeEventListener('keyup', pressSpace)
  }
}

export default Player
