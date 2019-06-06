import playerElement from './player.html'
import Template from './Template'
import { secondToTime } from './utils'

let currentTime = 0
const _CONFIG = {
  fixed: false,
  autoPlay: false, // autoplay the next track
  muted: false,
  preload: 'metadata', // none, metadata, auto
  audio:[],
}

class Player {
  constructor(options) {
    this.options = handleOptions(options)
    this.init = false
    this.player = document.getElementsByClassName('player')[0]
    this.initUI()
    this.initAudio()
    this.muted = this.options.muted
  }

  get duration () {
    if (this.options.audio.duration) {
      return options.audio.duration
    }
    return isNaN(this.audio.duration) ? 0 : this.audio.duration
  }

  initUI() {
    this.player.innerHTML = playerElement
    if (this.options.fixed) {
      this.player.classList.add('Fixed')
    }
    if (this.options.muted) {
      this.player.classList.add('Mute')
    }
    this.options.autoPlay ? this.player.classList.add('Play') : this.player.classList.add('Pause')
    this.template = new Template(this.player, this.options.audio[0])

    this.template.playBtn.addEventListener('click', () => {
      this.toggle()
    })
    this.template.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted
      this.player.classList.toggle('Mute')
      if(this.audio) {
        this.audio.muted = this.muted
      }
    })
  }

  initAudio() {
    if (this.options.audio.length) {
      this.audio = new Audio()
      this.audio.src = this.options.audio[0].src
      if (this.audio.networkState === 3) {
        console.error('media source not found')
      }
      /* configurations to be completed */
      this.audio.preload = this.options.preload
      this.audio.autoplay = this.options.autoPlay
      this.audio.defaultMuted = this.muted

      this.audio.addEventListener('play', () => {
        if (this.player.classList.contains('Pause')) {
          this.setUIPlaying()
        }
      })
      this.audio.addEventListener('pause', () => {
        if (this.player.classList.contains('Pause')) {
          this.setUIPaused()
        }
      })
      this.audio.addEventListener('ended', () => {
        this.setUIPaused()
        this.seek(0)
        // not finished
      })
      this.audio.addEventListener('canplay',() => {
        this.player.classList.remove('Loading')
      })
      this.audio.addEventListener('canplaythrough',() => {
        this.player.classList.remove('Loading')
      })
      this.audio.addEventListener('durationChange', () => {
        // Android browsers will output 1 at first
        if (this.duration !== 1) {
          this.template.duration.innerHTML = secondToTime(this.duration)
        }
      })
      this.audio.addEventListener('loadstart', () => {
        this.player.classList.add('Loading')
      })
      this.audio.addEventListener('waiting', () => {
        this.player.classList.add('Loading')
      })
      this.audio.addEventListener('progress', () => {
        if (this.audio.buffered.length) {
          const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0
          this.template.audioLoaded.style.width = `${percentage * 100}%`
        }
      })
      this.audio.addEventListener('timeupdate', () => {
        if (Math.floor(currentTime) !== Math.floor(this.audio.currentTime)) {
          this.template.currentTime.innerHTML = secondToTime(this.audio.currentTime)
          currentTime = +this.audio.currentTime
        }
      })

      this.audio.addEventListener('error', () => {

      })

      this.inited = true
    }
  }

  setUIPlaying() {
    this.player.classList.add('Play')
    this.player.classList.remove('Pause')
  }

  setUIPaused() {
    this.player.classList.add('Pause')
    this.player.classList.remove('Play')
    this.player.classList.remove('Loading')
  }

  play() {
    if (!this.audio.paused) return

    this.setUIPlaying()
    if (!this.inited) {
      this.initAudio()
    }
    const playPromise = this.audio.play()
    if (playPromise) {
      playPromise.catch((e) => {
        console.error(e)
        if (e.name === 'NotAllowedError') {
          this.setUIPaused()
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
    this.audio.paused ? this.play() : this.pause()
  }

  seek(range) {}

  updateTime() {}

  destroy() {
    audio.pause()
    audio.src = ''
  }
}

function handleOptions(options) {
  options.fixed = options.fixed || _CONFIG.fixed
  options.autoPlay = options.autoPlay || _CONFIG.autoPlay
  options.muted = options.muted || _CONFIG.fixed
  options.preload = options.preload || _CONFIG.preload
  if (!options.audio) {
    console.error('audio object is required')
  } else if (!Array.isArray(options.audio)) {
    options.audio = [options.audio]
  }
  options.audio.map(item => {
    item.name = item.name || 'Unknown Title'
    item.artist = item.artist || 'Unknown Artist'
    item.cover = item.cover || null
  })
  return options
}

const player = new Player({
  audio: {
    cover: 'https://i.typcdn.com/spiralpodcast/jcgXQ_pNlQsvFI3C_EPiOA.png',
    artist: 'Food FM',
    src: 'https://v.typcdn.com/spiralpodcast/8442357089_216588.mp3',
    title: 'EP01: 唯有爱与美食不可辜负',
    duration: '01:30:21',
  }
})
