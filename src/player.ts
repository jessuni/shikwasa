import { Options, IAudio, IPluginClass, audioEvents, TEventName, TEvent, IEventHandler } from './types'
import UI from './ui'
import Events from './events'
import { toggleAttribute, handleOptions, handleAudio, parseAudio } from './utils'

const REGISTERED_COMPS: Array<IPluginClass<Player>> = []
const isMobile = typeof window !== 'undefined' ? /mobile/i.test(window.navigator.userAgent) : false
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'

// detecting addEventListener option support
let supportsPassive: boolean = false
if (typeof window !== 'undefined') {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        return false
      },
    })
    window.addEventListener('testPassvie'!, null!, opts)
    window.removeEventListener('testPassvie'!, null!, opts)
    supportsPassive = true
  } catch (e) {
    supportsPassive = false
  }
}
const addPassive = supportsPassive && isMobile

class Player {
  private id: number

  protected _hasMediaSession: boolean
  protected _initSeek: number
  protected _canplay: boolean
  protected _dragging: boolean
  protected _audio: IAudio
  protected el: HTMLElement
  protected container: HTMLElement

  static playerArr: Array<Player> = []
  static comps: Record<string, any>
  static use = function (comp: IPluginClass<Player>) {
    REGISTERED_COMPS.push(comp)
  }

  public options: Options
  public audio: HTMLAudioElement
  public events: Events
  public ui: UI

  constructor(options: Options) {
    Player.playerArr.push(this)
    this.id = Player.playerArr.length
    this._audio = {} as IAudio
    this._hasMediaSession = false
    this._initSeek = 0
    this._canplay = false
    this._dragging = false
    this.events = new Events()
    this.options = handleOptions(options)
    this.renderComponents()
    this.initUI()
    this.initAudio()
    this.ui.mount(this.container, supportsPassive)
  }

  get duration(): number | undefined {
    return this.audio && this.audio.duration || this._audio.duration
  }

  get seekable() {
    return Boolean(this.duration)
  }

  set seekable(v: boolean) {
    if (v) {
      this.ui.seekControls.forEach((el: HTMLElement) => {
        el.removeAttribute('disabled')
      })
    } else {
      this.ui.seekControls.forEach((el: HTMLElement) => {
        el.setAttribute('disabled', '')
      })
    }
  }

  get currentTime(): number {
    return this.audio ? this.audio.currentTime : 0
  }

  get playbackRate(): number {
    return this.audio ? this.audio.playbackRate : 1
  }

  set playbackRate(v: number) {
    if (this.audio) {
      this.audio.playbackRate = v
      this.audio.defaultPlaybackRate = v
    }
  }

  get muted(): boolean {
    return this.audio ? this.audio.muted : false
  }

  set muted(v: boolean) {
    if (this.audio) {
      this.audio.muted = v
      this.audio.defaultMuted = v
    }
  }

  initUI(): void {
    this.ui = new UI(this.options)
    this.el = this.ui.el
    this.container = this.options._container
    this.initControlEvents()
    this.initBarEvents()
  }

  initControlEvents(): void {
    this.ui.playBtn?.addEventListener('click', () => {
      this.toggle()
    })
    this.ui.muteBtn?.addEventListener('click', () => {
      this.muted = !this.muted
      toggleAttribute(this.el, 'data-mute')
    })
    this.ui.fwdBtn?.addEventListener('click', () => {
      this.seekBySpan()
    })
    this.ui.bwdBtn?.addEventListener('click', () => {
      this.seekBySpan({ forward: false })
    })
    this.ui.speedBtn?.addEventListener('click', () => {
      const index = this.options.speedOptions.indexOf(this.playbackRate)
      const speedRange = this.options.speedOptions
      this.playbackRate = (index + 1 >= speedRange.length) ? speedRange[0] : speedRange[index + 1]
      this.ui.setSpeed(this.playbackRate)
    })
  }

  initBarEvents(): void {
    let targetTime = 0
    const dragStartHandler = (e: TEvent) => {
      if (!this.seekable) return
      e.preventDefault()
      this.el.setAttribute('data-seeking', '')
      this._dragging = true
      document.addEventListener(dragMove, dragMoveHandler, addPassive ? { passive: true } : false)
      document.addEventListener(dragEnd, dragEndHandler)
    }
    const dragMoveHandler = (e: TEvent) => {
      this.ui.setProgress(undefined, this.ui.getPercentByPos(e), this.duration)
    }
    const dragEndHandler = (e: TEvent) => {
      e.preventDefault()
      document.removeEventListener(dragMove, dragMoveHandler)
      document.removeEventListener(dragEnd, dragEndHandler)
      targetTime = this.ui.getPercentByPos(e) * (this.duration || 0)
      this.seek(targetTime)
      this._dragging = false

      // disable barPlayed transition on drag
      setTimeout(() => this.el.removeAttribute('data-seeking'), 50)
    }

    // seeking with keyboard
    const keydownHandler = (e: KeyboardEvent) => {
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
        this.seek(this.duration || 0)
        return
      }
      const step = (isWayFwd || isWayBack ? 0.1 : 0.01) * (isFwd || isWayFwd ? 1 : -1)
      const currentTime = this._canplay ? this.currentTime : this._initSeek
      const time = step * (this.duration || 0) + currentTime
      this.seek(time)
    }
    this.ui.barWrap?.addEventListener(dragStart, dragStartHandler)
    this.ui.handle?.addEventListener('keydown', keydownHandler)
  }

  initAudio(): void {
    if (this.options.audio.src) {
      this.audio = new Audio()
      this.initAudioEvents()
      audioEvents.forEach(name => {
        this.audio.addEventListener(name, (e) => {
          this.events.trigger(name, e)
        })
      })
      this.audio.preload = this.options.preload
      this.muted = this.options.muted
      this.update(this.options.audio)
    }
  }

  initAudioEvents(): void {
    this.on('play', () => {
      this.ui.setPlaying()
      Player.playerArr.forEach(player => {
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
      if (this.duration && this.duration !== 1) {
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
    })
    this.on('canplaythrough', () => {
      this.el.removeAttribute('data-loading')
    })
    this.on('progress', () => {
      if (this.audio.buffered.length) {
        const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / (this.duration || 1) : 0
        this.ui.setBar('loaded', percentage)
      }
    })
    this.on('timeupdate', () => {
      if (!this._dragging) {
        this.ui.setProgress(this.audio.currentTime, undefined, this.duration)
      }
    })
    this.on('abort', () => {
      this.ui.setPaused()
    })
  }

  initMediaSession(): void {
    const self = this
    if (navigator.mediaSession) {
      this._hasMediaSession = true
      this.setMediaMetadata(this._audio)
      const controls: { [key in MediaSessionAction]?: any } = {
        play: this.play.bind(self),
        pause: this.pause.bind(self),
        seekforward: this.seekBySpan.bind(self),
        seekbackward: () => this.seekBySpan({ forward: false }),
        seekto: this.seek.bind(self)
      }
      Object.keys(controls).forEach((key: MediaSessionAction) => {
        navigator.mediaSession?.setActionHandler(key,controls[key])
      })
    }
  }

  setMediaMetadata(audio: IAudio): void {
    /* global MediaMetadata */
    const artwork = audio.cover ? [{ src: audio.cover, sizes: '150x150'}] : undefined
    navigator.mediaSession!.metadata = new MediaMetadata({
      title: audio.title,
      artist: audio.artist,
      album: audio.album,
      artwork,
    })
  }

  on(name: TEventName, callback: IEventHandler): void {
    this.events.on(name, callback)
  }

  play(): void {
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

  pause(): void {
    if (this.audio.paused) return
    this.audio.pause()
  }

  toggle(): void {
    this.audio.paused ? this.play() : this.pause()
  }

  seek(time: number | string): void {
    if (!this.seekable) return
    time = +time
    if (isNaN(time)) {
      console.error('Shikwasa: seeking time is NaN')
    }
    time = Math.min(time, this.duration || 0)
    time = Math.max(time, 0)
    this.ui.setProgress(time, undefined, this.duration)
    if (!this._canplay) {
      this._initSeek = time
    } else {
      this.audio.currentTime = time
    }
  }

  seekBySpan({ time = 10, forward = true }: { time?: number, forward?: boolean } = { time: 10, forward: true }): void {
    const currentTime = this._canplay ? this.audio.currentTime : this._initSeek
    const targetTime = currentTime + time * (forward ? 1 : -1)
    this.seek(targetTime)
  }

  update(audio: Partial<IAudio>): void | Error {
    if (audio && audio.src) {
      this._audio = handleAudio(audio)
      this._canplay = false

      this.audio.src = this._audio.src
      this.updateAudioData(this._audio)
      this.events.trigger('audioupdate', this._audio)
      if (this.options.parser &&
        (!audio.title ||
        !audio.artist ||
        !audio.cover ||
        !audio.chapters)
      ) {
        parseAudio(Object.assign({}, audio), this.options.parser).then(audioData => {
          this._audio = audioData || this._audio
          this.updateAudioData(this._audio)
          this.events.trigger('audioparse', this._audio)
        })
      }
    } else {
      throw new Error('Shikwasa: audio source is not specified')
    }
  }

  updateAudioData(audio: IAudio): void {
    this.audio.title = audio.title
    this.ui.setAudioInfo(audio)
    this.seekable = Boolean(audio.duration)
    if (this._hasMediaSession) {
      this.setMediaMetadata(audio)
    }
  }

  destroyAudio(): void {
    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
  }

  destroy(): void {
    this.destroyAudio()
    this.ui.destroy()
    Object.keys(Player.comps).forEach(k => {
      if (Player.comps[k].destroy &&
        typeof Player.comps[k].destroy === 'function') {
        Player.comps[k].destroy()
      }
    })
    Player.comps = {}
    this.container.innerHTML = ''
  }

  renderComponents(): void {
    if (!REGISTERED_COMPS.length) return
    REGISTERED_COMPS.forEach(comp => {
      Player.comps[comp._name] = new comp(this)
    })
  }
}

export default Player
