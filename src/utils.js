import config from './config'

export function secondToTime(time) {
  time = Math.round(time)
  let hour = Math.floor(time / 3600)
  let min = Math.floor((time - hour * 3600) / 60)
  let sec = Math.floor(time - hour * 3600 - min * 60)
  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec
  if (hour === 0) {
    hour = hour < 10 ? '0' + hour : hour
    return `${min}:${sec}`
  }
  return `${hour}:${min}:${sec}`
}

export function numToString(num) {
  const float = parseFloat(num).toFixed(2)
  return float.slice(-1) === '0' ? float.slice(0, -1) :float
}

export function carousel(el, distance = 0, pause = 1000) {
  let carouselTimeout, carouselInterval
  const duration = distance * 50
  const interval = duration + pause
  function transform() {
    el.style.transitionDuration = `${duration / 1000}s`
    el.style.transform = `translateX(-${distance}px)`
    carouselTimeout = setTimeout(() => {
      el.style.transform = 'translateX(0px)'
    }, interval)
  }
  transform()
  carouselInterval = setInterval(() => transform(), interval * 2)
  return [carouselTimeout, carouselInterval]
}

export function handleOptions(options) {
  options.container = document.querySelector(options.container ? options.container : config.container)
  options.fixed = options.fixed || config.fixed
  options.download = typeof options.download === 'boolean' ? options.download : config.download
  const fixedOptions = ['auto', 'static', 'fixed']
  const result = fixedOptions.find(item => item === options.fixed.type)
  if (!result) {
    options.fixed.type = config.fixed.type
  }
  options.themeColor = options.themeColor || config.themeColor
  options.autoPlay = options.autoPlay || config.autoPlay
  options.muted = options.muted || config.muted
  options.preload = options.preload || config.preload
  options.speedOptions = options.speedOptions || config.speedOptions
  if (!Array.isArray(options.speedOptions)) {
    options.speedOptions = [options.speedOptions]
  }
  if (!options.speedOptions.includes(1)) {
    options.speedOptions.push(1)
  }
  options.speedOptions = options.speedOptions
  .map(sp => parseFloat(sp))
  .filter(sp => !isNaN(sp))
  if (options.speedOptions.length > 1) {
    options.speedOptions.sort((a, b) => a - b)
  }
  if (!options.audio) {
    console.error('audio is not specified')
  } else {
    options.audio.title = options.audio.title || 'Unknown Title'
    options.audio.artist = options.audio.artist || 'Unknown Artist'
    options.audio.cover = options.audio.cover || null
    options.audio.duration = options.audio.duration || 0
  }
  return options
}

export function setMediaSession(audio, fns = {}, self) {
  if ('mediaSession' in navigator) {
    /* global MediaMetadata */
    navigator.mediaSession.metadata = new MediaMetadata({
      title: audio.title,
      artist: audio.artist,
      artwork: [
        { src: audio.cover }
      ]
    })
    if (Object.entries(fns).length && fns.constructor === Object) {
      Object.keys(fns).forEach(key => {
        navigator.mediaSession.setActionHandler(key, fns[key].bind(self))
      })
    }
  }
}
