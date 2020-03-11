import Template from './template'
import Bar from './bar'
import Events from './events'
import { secondToTime, numToString, handleOptions, setMediaSession } from './utils'

const playerArr = []
const REGISTERED_COMPS = {}
let initSeek
const isMobile = typeof window !== 'undefined' ? /mobile/i.test(window.navigator.userAgent) : false
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'

class Player {
  constructor(options) {
    this.id = playerArr.length
    playerArr.push(this)
    this.comps = {}
    this.inited = false
    this.canplay = false
    this.dragging = false
    this.options = handleOptions(options)
    this.muted = this.options.muted
    this.initUI()
    this.initKeyEvents()
    this.currentSpeed = 1
    this.events = new Events()
    this.initAudio()
    this._renderComponents()
    const componentEls = Object.keys(this.comps).map(name => this.comps[name].el)
    this.template.mount(this.options.container, componentEls)
  }

  get duration() {
    if (!this.audio || !this.audio.src) {
      return this.options.audio.duration
    } else {
      return isNaN(this.audio.duration) ? this.options.audio.duration : this.audio.duration
    }
  }

  get currentTime() {
    return this.audio ? this.audio.currentTime : undefined
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
      this.seekForward()
    })
    this.template.bwdBtn.addEventListener('click', () => {
      this.seekBackward()
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
      seekingTime = percentage * this.duration
      this.setDisplayAndBarByTime(seekingTime)
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
    const pressSpace = (e) => {
      if (e.keyCode === 32) {
        const activeEl = document.activeElement
        if (!activeEl.classList.contains('shk_btn_toggle')) {
          this.toggle()
        }
      }
    }
    this.el.addEventListener('keyup', pressSpace)
  }

  initAudio() {
    if (this.options.audio.src) {
      this.audio = new Audio()
      this.audio.title = this.options.audio.title
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
      playerArr.forEach(player => {
        if (player.id !== this.id && player.audio && !player.audio.paused) {
          player.pause()
        }
      })
    })
    this.on('pause', () => {
      if (this.el.classList.contains('Play')) {
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
      if (!this.dragging) {
        this.setDisplayAndBarByTime(this.audio.currentTime)
      }
    })
  }

  initLoadingEvents() {
    this.on('canplaythrough', () => {
      if (this.el.classList.contains('Loading')) {
        this.el.classList.remove('Loading')
      }
    })
    this.on('waiting', () => {
      if (!this.el.classList.contains('Loading')) {
        this.el.classList.add('Loading')
      }
    })
    this.on('canplay', () => {
      if (!this.canplay) {
        this.canplay = true
        if (initSeek) {
          this.seek(initSeek)
        }
      }
    })
  }

  on(name, callback) {
    this.events.on(name, callback)
  }

  setDisplayAndBarByTime(time = 0) {
    const percentage = time / this.duration || 0
    this.template.currentTime.innerHTML = secondToTime(time)
    this.bar.set('audioPlayed', percentage)
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
    }
    if (!this.audio.paused) return
    const promise = this.audio.play()
    const self = this
    const targetAudio = audio || this.options.audio
    const controls = {
      play: this.play,
      pause: this.pause,
      seekforward: this.seekForward,
      seekbackward: this.seekBackward,
    }
    if (promise instanceof Promise) {
      promise.then(() => {
        setMediaSession(targetAudio, controls, self)
      })
      promise.catch((e) => {
        if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
          this.pause()
        }
      })
    } else {
      setMediaSession(targetAudio, controls, self)
    }
  }

  pause() {
    if (this.audio.paused) return
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
    let _time = parseInt(time)
    if (isNaN(_time)) {
      console.error('seeking time is NaN')
      return
    }
    _time = Math.min(_time, this.duration)
    _time = Math.max(_time, 0)
    this.setDisplayAndBarByTime(_time)
    if (!this.canplay) {
      initSeek = time
    } else if (this.audio) {
      this.audio.currentTime = _time
    }
  }

  seekForward(time = 10) {
    const seekingTime = Math.min(this.duration, this.audio.currentTime + time)
    this.seek(seekingTime)
  }

  seekBackward(time = 10) {
    const seekingTime = Math.max(0, this.audio.currentTime - time)
    this.seek(seekingTime)
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
    this.options.container.innerHTML = ''
  }

  _renderComponents() {
    const keys = Object.keys(REGISTERED_COMPS)
    if (!keys.length) return
    for (let i = 0; i < keys.length; i++) {
      this.comps[keys[i]] = new REGISTERED_COMPS[keys[i]].comp(this, REGISTERED_COMPS[keys[i]].options)
    }
  }
}

Player.use = function (name, comp, options) {
  REGISTERED_COMPS[name] = { comp, options }
}

export default Player
