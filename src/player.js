import UI from './ui'
import Events from './events'
import { toggleAttribute, handleOptions, handleAudio, parseAudio } from './utils'

const playerArr = []
const REGISTERED_COMPS = []
const isMobile = typeof window !== 'undefined' ? /mobile/i.test(window.navigator.userAgent) : false
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'

// detecting addEventListener option support
let supportsPassive = false
if (typeof window !== 'undefined') {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true
        return false
      },
    })
    window.addEventListener('testPassvie', null, opts)
    window.removeEventListener('testPassvie', null, opts)
  } catch (e) {
    supportsPassive = false
  }
}
const addPassive = supportsPassive && isMobile

class Player {
  constructor(options) {
    this.id = playerArr.length
    playerArr.push(this)
    this.comps = {}
    this._audio = {}
    this._hasMediaSession = false
    this._initSeek = 0
    this.live = false
    this._canplay = false
    this._dragging = false
    this.events = new Events()
    this.options = handleOptions(options)
    this.renderComponents()
    this.initUI(this.options)
    this.initAudio()
    this.ui.mount(this.options.container, supportsPassive)
  }

  get duration() {
    if (!this.audio || !this.audio.duration) {
      return this._audio.duration
    }
    return this.audio.duration
  }

  get seekable() {
    return !this.live && Boolean(this.duration)
  }

  set seekable(v) {
    if (v) {
      this.ui.seekControls.forEach((el) => {
        el.removeAttribute('disabled')
      })
    } else {
      this.ui.seekControls.forEach((el) => {
        el.setAttribute('disabled', '')
      })
    }
  }

  get currentTime() {
    return this.audio ? this.audio.currentTime : undefined
  }

  get playbackRate() {
    return this.audio ? this.audio.playbackRate : undefined
  }

  set playbackRate(v) {
    if (this.audio) {
      this.audio.playbackRate = v
      this.audio.defaultPlaybackRate = v
    }
  }

  get muted() {
    return this.audio ? this.audio.muted : undefined
  }

  set muted(v) {
    if (this.audio) {
      this.audio.muted = v
      this.audio.defaultMuted = v
    }
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
      toggleAttribute(this.el, 'data-mute')
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
      this.playbackRate = index + 1 >= speedRange.length ? speedRange[0] : speedRange[index + 1]
      this.ui.setSpeed(this.playbackRate)
    })
  }

  initBarEvents() {
    let targetTime = 0
    const dragStartHandler = (e) => {
      if (!this.seekable) return
      e.preventDefault()
      this.el.setAttribute('data-seeking', '')
      this._dragging = true
      document.addEventListener(dragMove, dragMoveHandler, addPassive ? { passive: true } : false)
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

      // disable barPlayed transition on drag
      setTimeout(() => this.el.removeAttribute('data-seeking'), 50)
    }

    // seeking with keyboard
    const keydownHandler = (e) => {
      if (!this.seekable) return

      // for early browser compatibility
      const key = e.key.replace('Arrow', '')

      const backwardKeys = ['Left', 'Down']
      const forwardKeys = ['Right', 'Up']
      const largeStepKeys = ['PageDown', 'PageUp']
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
        return
      }
      if (isEnd) {
        this.seek(this.duration)
        return
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
      this.initAudioEvents()
      this.events.audioEvents.forEach((name) => {
        this.audio.addEventListener(name, (e) => {
          this.events.trigger(name, e)
        })
      })
      this.audio.preload = this.options.preload
      this.muted = this.options.muted
      this.update(this.options.audio)
    }
  }

  initAudioEvents() {
    this.on('play', () => {
      this.ui.setPlaying()
      playerArr.forEach((player) => {
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
    this.on('waiting', () => {
      this.el.setAttribute('data-loading', '')
    })
    this.on('durationchange', () => {
      // Inifinity indicates audio stream or Safari's quirky behavior
      // update live state single way if it doesn't match current duration state
      if (this.duration !== Infinity && this.live) {
        this.live = false
      }
      if (this.duration && this.duration !== 1 && this.duration !== Infinity) {
        this.seekable = true
        this.ui.setTime('duration', this.duration)
      }
    })
    this.on('canplay', () => {
      if (!this._canplay) {
        this._canplay = true
        if (this._initSeek) {
          this.seek(this._initSeek)
          this._initSeek = 0
        }
      }
      // update live state single way to determine it is live stream and not Safari's quirky behavior
      if (this.duration === Infinity && !this.live) {
        this.live = true
        this.ui.setLive(this.live)
      }
    })
    this.on('canplaythrough', () => {
      this.el.removeAttribute('data-loading')
    })
    this.on('progress', () => {
      if (this.audio.buffered.length) {
        const percentage = this.audio.buffered.length
          ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration
          : 0
        this.ui.setBar('loaded', percentage)
      }
    })
    this.on('timeupdate', () => {
      if (!this._dragging) {
        this.ui.setProgress(this.audio.currentTime, null, this.duration)
      }
    })
    this.on('abort', () => {
      this.ui.setPaused()
    })
    this.on('audioupdate', (audio) => {
      this.seekable = audio.duration && audio.duration !== Infinity
      this.updateMetadata(audio)
    })
    this.on('audioparse', (audio) => {
      this.seekable = audio.duration && audio.duration !== Infinity
      this.updateMetadata(audio)
    })
  }

  initMediaSession() {
    const self = this
    if ('mediaSession' in navigator) {
      this._hasMediaSession = true
      this.setMediaMetadata(this._audio)
      const controls = {
        play: this.play.bind(self),
        pause: this.pause.bind(self),
        seekforward: this.seekBySpan.bind(self),
        seekbackward: () => this.seekBySpan({ forward: false }),
        seekto: this.seek.bind(self),
      }
      Object.keys(controls).forEach((key) => {
        navigator.mediaSession.setActionHandler(key, controls[key])
      })
    }
  }

  setMediaMetadata(audio) {
    const artwork = audio.cover ? [{ src: audio.cover, sizes: '150x150' }] : undefined
    if ('MediaMetadata' in window) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: audio.title,
        artist: audio.artist,
        album: audio.album,
        artwork,
      })
    }
  }

  on(name, callback) {
    this.events.on(name, callback)
  }

  play() {
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
    return promise
  }

  pause() {
    if (this.audio.paused) return
    this.audio.pause()
  }

  toggle() {
    return this.audio.paused ? this.play() : this.pause()
  }

  seek(time) {
    if (!this.seekable) return
    time = parseInt(time)
    if (isNaN(time)) {
      console.error('Shikwasa: seeking time is NaN')
    }
    time = Math.min(time, this.duration)
    time = Math.max(time, 0)
    this.ui.setProgress(time, null, this.duration)
    if (!this._canplay) {
      this._initSeek = time
    } else {
      this.audio.currentTime = time
    }
  }

  seekBySpan({ time = 10, forward = true } = {}) {
    const currentTime = this._canplay ? this.audio.currentTime : this._initSeek
    const targetTime = currentTime + time * (forward ? 1 : -1)
    this.seek(targetTime)
  }

  update(audio) {
    if (audio && audio.src) {
      this._audio = handleAudio(audio)
      this.live = this._audio.live
      this._canplay = false

      this.audio.src = this._audio.src
      this.events.trigger('audioupdate', this._audio)
      const metaIncomplete = !audio.title || !audio.artist || !audio.cover || !audio.chapters
      if (!this.live && this.options.parser && metaIncomplete) {
        parseAudio(Object.assign({}, audio), this.options.parser).then((audioData) => {
          this._audio = audioData || this._audio
          this.events.trigger('audioparse', this._audio)
        })
      }
    } else {
      throw new Error('Shikwasa: audio source is not specified')
    }
  }

  updateMetadata(audio) {
    this.audio.title = audio.title
    this.ui.setAudioInfo(audio)
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
    this.events.destroy()
    this.destroyAudio()
    this.ui.destroy()
    Object.keys(this.comps).forEach((k) => {
      if (this.comps[k].destroy && typeof this.comps[k].destroy === 'function') {
        this.comps[k].destroy()
      }
    })
    this.comps = null
    this.options.container.innerHTML = ''
  }

  renderComponents() {
    if (!REGISTERED_COMPS.length) return
    REGISTERED_COMPS.forEach((comp) => {
      this.comps[comp._name] = new comp(this)
    })
  }
}

Player.use = function (comp) {
  REGISTERED_COMPS.push(comp)
}

export default Player
