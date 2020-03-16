import UI from './ui'
import Events from './events'
import { handleOptions, setMediaSession } from './utils'

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
    this.inited = false
    this.comps = {}
    this.events = new Events()
    this.canplay = false
    this.dragging = false
    this.currentSpeed = 1
    this.options = handleOptions(options)
    this.muted = this.options.muted
    this.initUI()
    this.initAudio()
    this._renderComponents()
    const componentEls = Object.keys(this.comps).map(name => this.comps[name].el)
    this.ui.mount(this.options.container, componentEls)
  }

  get duration() {
    if (!this.audio || !this.audio.src) {
      return this.options.audio.duration || NaN
    }
    return this.audio.duration
  }

  get currentTime() {
    return this.audio ? this.audio.currentTime : undefined
  }

  initUI() {
    this.ui = new UI(this.options)
    this.el = this.ui.el
    this.initControlEvents()
    this.initBarEvents()
    this.initKeyEvents()
  }

  initControlEvents() {
    this.ui.playBtn.addEventListener('click', () => {
      this.toggle()
    })
    this.ui.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted
      this.el.classList.toggle('Mute')
      if (this.audio) {
        this.audio.muted = this.muted
      }
    })
    this.ui.fwdBtn.addEventListener('click', () => {
      this.seekBySpan()
    })
    this.ui.bwdBtn.addEventListener('click', () => {
      this.seekBySpan({ forward: false })
    })
    this.ui.speedBtn.addEventListener('click', () => {
      const index = this.options.speedOptions.indexOf(this.currentSpeed)
      const speedRange = this.options.speedOptions
      this.currentSpeed = (index + 1 >= speedRange.length) ? speedRange[0] : speedRange[index + 1]
      this.ui.setSpeed(this.currentSpeed)
      if (this.audio) {
        this.audio.playbackRate = this.currentSpeed
      }
    })
  }

  initBarEvents() {
    let targetTime = 0
    const dragStartHandler = (e) => {
      e.preventDefault()
      this.el.classList.add('Seeking')
      this.dragging = true
      document.addEventListener(dragMove, dragMoveHandler)
      document.addEventListener(dragEnd, dragEndHandler)
    }
    const dragMoveHandler = (e) => {
      e.preventDefault()
      this.ui.setProgress(null, this.ui.getPercentByPos(e), this.duration)
    }
    const dragEndHandler = (e) => {
      e.preventDefault()
      document.removeEventListener(dragMove, dragMoveHandler)
      document.removeEventListener(dragEnd, dragEndHandler)
      targetTime = this.ui.getPercentByPos(e) * this.duration
      this.seek(targetTime)
      this.dragging = false
      this.el.classList.remove('Seeking')
    }
    const keydownHandler = (e) => {
      // for early browser compatibility
      const key = e.key.replace('Arrow', '')

      const backwardKeys = ['Left', 'Down']
      const forwardKeys = ['Right', 'Up']
      const largeStepKeys = ['pageDown', 'pageUp']
      const edgeKeys = ['Home', 'End']
      const isBack = backwardKeys.indexOf(key) !== -1
      const isFwd = forwardKeys.indexOf(key) !== -1
      const isWayBack = key === largeStepKeys[0]
      const isWayFwd = key === largeStepKeys[1]
      const isStart = key === edgeKeys[0]
      const isEnd = key === edgeKeys[1]
      if (!isBack && !isFwd && largeStepKeys.indexOf(key) === -1 && edgeKeys.indexOf(key) === -1) {
        return
      }
      if (isStart) {
        this.seek(0)
      }
      if (isEnd) {
        this.seek(this.duration)
      }
      const step = (isWayFwd || isWayBack ? 0.1 : 0.01) * (isFwd || isWayFwd ? 1 : -1)
      const time = step * this.duration + this.currentTime
      this.seek(time)
    }
    this.ui.barWrap.addEventListener(dragStart, dragStartHandler)
    this.ui.handle.addEventListener('keydown', keydownHandler)
  }

  initKeyEvents() {
    const pressSpace = (e) => {
      if (e.keyCode === 32) {
        const activeEl = document.activeElement
        if (!activeEl.classList.contains('shk-btn_toggle')) {
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
        this.ui.setPlaying()
      }
      playerArr.forEach(player => {
        if (player.id !== this.id && player.audio && !player.audio.paused) {
          player.pause()
        }
      })
    })
    this.on('pause', () => {
      if (this.el.classList.contains('Play')) {
        this.ui.setPaused()
      }
    })
    this.on('ended', () => {
      this.ui.setPaused()
      this.seek(0)
    })
    this.on('durationchange', () => {
      if (this.duration !== 1) {
        this.ui.setTime('duration', this.duration)
      }
    })
    this.on('progress', () => {
      if (this.audio.buffered.length) {
        const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0
        this.ui.setBar('loaded', percentage)
      }
    })
    this.on('timeupdate', () => {
      if (!this.dragging) {
        this.ui.setProgress(this.audio.currentTime, null, this.duration)
      }
    })
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

  play(audio) {
    if (!this.inited) {
      this.audio.src = this.options.audio.src
      this.inited = true
    }
    if (audio && audio.src) {
      this.ui.setAudioInfo(audio)
      this.updateAudio(audio.src)
    }
    if (!this.audio.paused) return
    const promise = this.audio.play()
    const self = this
    const targetAudio = audio || this.options.audio
    const controls = {
      play: this.play,
      pause: this.pause,
      seekforward: this.seekBySpan,
      seekbackward: () => this.seekBySpan({ forward: false }),
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
    time = parseInt(time)
    if (isNaN(time)) {
      throw new Error('seeking time is NaN')
    }
    time = Math.min(time, this.duration)
    time = Math.max(time, 0)
    this.ui.setProgress(time, null, this.duration)
    if (!this.canplay) {
      initSeek = time
    } else if (this.audio) {
      this.audio.currentTime = time
    }
  }
  seekBySpan({ time = 10, forward = true } = {}) {
    const targetTime = this.audio.currentTime + time * (forward ? 1 : -1)
    this.seek(targetTime)
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
    this.ui.destroy()
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
