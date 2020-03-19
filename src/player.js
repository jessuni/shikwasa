import UI from './ui'
import Events from './events'
import { handleOptions } from './utils'

const playerArr = []
const REGISTERED_COMPS = {}
const isMobile = typeof window !== 'undefined' ? /mobile/i.test(window.navigator.userAgent) : false
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'

class Player {
  constructor(options) {
    this.id = playerArr.length
    playerArr.push(this)
    this.comps = {}
    this._inited = false
    this._hasMediaSession = false
    this._initSeek = 0
    this._canplay = false
    this._dragging = false
    this.events = new Events()
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

  get seekable() {
    return Boolean(this.duration)
  }

  set seekable(v) {
    if (v !== true) return
    this.ui.seekControls.forEach(el => {
      el.removeAttribute('disabled')
    })
  }

  get currentTime() {
    return this.audio ? this.audio.currentTime : undefined
  }

  get playbackRate() {
    return this.audio ? this.audio.playbackRate : undefined
  }

  set playbackRate(val) {
    if (this.audio) {
      this.audio.playbackRate = val
      this.audio.defaultPlaybackRate = val
      return val
    }
    return false
  }

  initUI() {
    this.ui = new UI(this.options)
    this.el = this.ui.el
    this.initControlEvents()
    this.initBarEvents()
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
      const index = this.options.speedOptions.indexOf(this.playbackRate)
      const speedRange = this.options.speedOptions
      this.playbackRate = (index + 1 >= speedRange.length) ? speedRange[0] : speedRange[index + 1]
      this.ui.setSpeed(this.playbackRate)
    })
  }

  initBarEvents() {
    let targetTime = 0
    const dragStartHandler = (e) => {
      if (!this.seekable) return
      e.preventDefault()
      this.el.classList.add('Seeking')
      this._dragging = true
      document.addEventListener(dragMove, dragMoveHandler)
      document.addEventListener(dragEnd, dragEndHandler)
    }
    const dragMoveHandler = (e) => {
      this.ui.setProgress(null, this.ui.getPercentByPos(e), this.duration)
    }
    const dragEndHandler = (e) => {
      e.preventDefault()
      document.removeEventListener(dragMove, dragMoveHandler)
      document.removeEventListener(dragEnd, dragEndHandler)
      targetTime = this.ui.getPercentByPos(e) * this.duration
      this.seek(targetTime)
      this._dragging = false
      this.el.classList.remove('Seeking')
    }
    const keydownHandler = (e) => {
      if (!this.seekable) return

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
      const currentTime = this._canplay ? this.currentTime : this._initSeek
      const time = step * this.duration + currentTime
      this.seek(time)
    }
    this.ui.barWrap.addEventListener(dragStart, dragStartHandler)
    this.ui.handle.addEventListener('keydown', keydownHandler)
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
        this.update(this.options.audio.src)
        this._inited = true
      }
    }
  }

  initAudioEvents() {
    this.on('play', () => {
      this.ui.setPlaying()
      playerArr.forEach(player => {
        if (player.id !== this.id && player.audio && !player.audio.paused) {
          player.pause()
        }
      })
    })
    this.on('pause', () => {
      this.ui.setPaused()
    })
    this.on('ended', () => {
      this.ui.setPaused()
      this.seek(0)
    })
    this.on('durationchange', () => {
      if (this.duration && this.duration !== 1) {
        this.seekable = true
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
      if (!this._dragging) {
        this.ui.setProgress(this.audio.currentTime, null, this.duration)
      }
    })
    this.on('canplaythrough', () => {
      this.el.classList.remove('Loading')
    })
    this.on('waiting', () => {
      this.el.classList.add('Loading')
    })
    this.on('canplay', () => {
      if (!this._canplay) {
        this._canplay = true
        if (this._initSeek) {
          this.seek(this._initSeek)
        }
      }
    })
    this.on('abort', () => {
      this.ui.setPaused()
    })
  }

  initMediaSession() {
    if ('mediaSession' in navigator) {
      this._hasMediaSession = true
      this.setMediaMetadata(this.options.audio)
      const controls = {
        play: this.play,
        pause: this.pause,
        seekforward: this.seekBySpan,
        seekbackward: () => this.seekBySpan({ forward: false }),
      }
      Object.keys(controls).forEach(key => {
        navigator.mediaSession.setActionHandler(key, () => {
          controls[key]()
        })
      })
    }
  }

  setMediaMetadata(audio) {
    /* global MediaMetadata */
    navigator.mediaSession.metadata = new MediaMetadata({
      title: audio.title,
      artist: audio.artist,
      artwork: [{ src: audio.cover }],
    })
  }

  on(name, callback) {
    this.events.on(name, callback)
  }

  play() {
    if (!this._inited) {
      this.update(this.options.audio)
      this._inited = true
    }

    if (!this.audio.paused) return
    const promise = this.audio.play()
    if (promise instanceof Promise) {
      promise.then(() => {
        this.initMediaSession()
      })
      promise.catch((e) => {
        if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
          this.pause()
        }
      })
    } else {
      this.initMediaSession()
    }
  }

  pause() {
    if (this.audio.paused) return
    this.audio.pause()
  }

  toggle() {
    this.audio.paused ? this.play() : this.pause()
  }

  seek(time) {
    if (!this.seekable) return
    time = parseInt(time)
    if (isNaN(time)) {
      throw new Error('Shikwasa: seeking time is NaN')
    }
    time = Math.min(time, this.duration)
    time = Math.max(time, 0)
    this.ui.setProgress(time, null, this.duration)
    if (!this._canplay) {
      this._initSeek = time
    } else if (this.audio) {
      this.audio.currentTime = time
    }
  }

  seekBySpan({ time = 10, forward = true } = {}) {
    const currentTime = this._canplay ? this.audio.currentTime : this._initSeek
    const targetTime = currentTime + time * (forward ? 1 : -1)
    this.seek(targetTime)
  }

  update(audio) {
    this.audio.src = audio.src
    // prevent setting audio info twice on initiation
    if (this._inited) {
      this.ui.setAudioInfo(audio)
    }
    if (this._hasMediaSession) {
      this.setMediaMetadata(audio)
    }
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
