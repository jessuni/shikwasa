import playerElement from '../template/player.html'
import Template from './template'
import Bar from './bar'
import { secondToTime, getCoords, numToString, handleOptions } from '../utils'

const isMobile = /mobile/i.test(window.navigator.userAgent)
const dragStart = isMobile ? 'touchstart' : 'mousedown'
const dragMove = isMobile ? 'touchmove' : 'mousemove'
const dragEnd = isMobile ? 'touchend' : 'mouseup'



class Player {
  constructor(options) {
    this.options = handleOptions(options)
    this.init = false
    this.player = document.getElementsByClassName('shk')[0]
    this.muted = this.options.muted
    this.initUI()
    this.dragging = false
    this.currentSpeed = 1
    this.currentTime = 0
    this.updateTime = () => {
      const length = getCoords(this.template.bar).width
      const position = getCoords(this.template.handle).left - getCoords(this.template.bar).left
      const time = position / length * this.duration
      this.seek(time)
    }
  }

  get duration() {
    if (!this.audio) {
      return this.options.audio[0].duration
    } else {
      return isNaN(this.audio.duration) ? 0 : this.audio.duration
    }
  }

  initUI() {
    this.player.innerHTML = playerElement
    this.template = new Template(this.player, this.options.audio[0])
    this.bar = new Bar(this.template)

    if (this.options.fixed) {
      this.player.classList.add('Fixed')
    }
    if (this.options.muted) {
      this.player.classList.add('Mute')
    }
    this.options.autoPlay ? this.player.classList.add('Play') : this.player.classList.add('Pause')

    this.initButtons()
    this.initBar()
  }

  initButtons() {
    this.template.playBtn.addEventListener('click', () => {
      this.toggle()
    })
    this.template.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted
      this.player.classList.toggle('Mute')
      if (this.audio) {
        this.audio.muted = this.muted
      }
    })
    this.template.speedBtn.addEventListener('click', () => {
      const index = this.options.speedOptions.indexOf(this.currentSpeed)
      this.currentSpeed = (index + 1 >= this.options.speedOptions.length) ? this.options.speedOptions[0] : this.options.speedOptions[index + 1]
      this.template.speedBtn.innerHTML = numToString(this.currentSpeed) + 'x'
      if(this.audio) {
        this.audio.playbackRate = this.currentSpeed
        console.log(this.audio.playbackRate)
      }
    })
  }

  initBar() {
    const dragStartHandler = () => {
      this.player.classList.add('Seeking')
      this.dragging = true
      document.addEventListener(dragMove, dragMoveHandler)
      document.addEventListener(dragEnd, dragEndHandler)
    }

    const dragMoveHandler = (e) => {
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - this.template.barWrap.getBoundingClientRect().left) / this.template.barWrap.clientWidth
      this.bar.set('audioPlayed', percentage)
    }

    const dragEndHandler = () => {
      this.dragging = false
      this.player.classList.remove('Seeking')
      document.removeEventListener(dragMove, dragMoveHandler)
      document.removeEventListener(dragEnd, dragEndHandler)
      this.updateTime()
    }

    const instantSeek = (e) => {
      dragMoveHandler(e)
      this.updateTime()
    }
    this.template.barWrap.addEventListener('click', instantSeek)
    this.template.handle.addEventListener(dragStart, dragStartHandler)
  }

  initAudio() {
    if (this.options.audio.length) {
      this.audio = new Audio()
      this.audio.src = this.options.audio[0].src
      /* configurations to be completed */
      this.audio.preload = this.options.preload
      this.audio.autoplay = this.options.autoPlay
      this.audio.defaultMuted = this.options.muted
      this.audio.muted = this.muted
      //this.audio.playbackRate = this.currentSpeed

      this.addLoadingEvents()
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

      this.audio.addEventListener('durationchange', () => {
        // Android browsers will output 1 at first
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
    if (!this.inited) {
      this.initAudio()
    }
    if (!this.audio.paused) return
    this.setUIPlaying()
    this.audio.play()
  }

  pause() {
    if (!this.inited) {
      this.initAudio()
    }
    if (this.audio.paused) return
    this.setUIPaused()
    this.audio.pause()
  }

  toggle() {
    if (!this.inited) {
      this.initAudio()
    }
    if (this.audio) {
      this.audio.paused ? this.play() : this.pause()
    }
  }

  updateSpeed() {
  }

  addLoadingEvents() {
    this.audio.addEventListener('canplay', () => {
      if (this.player.classList.contains('Loading')) {
        this.player.classList.remove('Loading')
      }
    })
    this.audio.addEventListener('canplaythrough', () => {
      if (this.player.classList.contains('Loading'))
        this.player.classList.remove('Loading')
    })
    this.audio.addEventListener('loadstart', () => {
      if (!this.player.classList.contains('Loading')) {
        this.player.classList.add('Loading')
      }
    })
    this.audio.addEventListener('waiting', () => {
      if (!this.player.classList.contains('Loading')) {
        this.player.classList.add('Loading')
      }
    })
  }

  seek(time) {
    this.template.currentTime.innerHTML = secondToTime(time)
    if (this.audio) {
      this.audio.currentTime = time
    } else {
      this.currentTime = time
    }
    // 一开始放的时候如果 currentTime 不为 0, currentTime !== this.audio.currentTime, 应该去 seek(currentTime)
  }

  destroy() {
    audio.pause()
    audio.src = ''
  }
}

export default Player

