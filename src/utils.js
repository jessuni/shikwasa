import config from './config'
import { isNumber } from 'util';

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

export function carousel(el, distance = 0, duration = 8000, pause = 2000) {
  function transform() {
    el.style.transitionDuration = `${duration / 1000}s`
    el.style.transform = `translateX(${distance}px)`
    setTimeout(() => {
      el.style.transform = 'translateX(0px)'
    }, duration + pause)
  }
  transform()
  return setInterval(() => transform(), duration * 2 + pause * 2)
}

export function handleOptions(options) {
  options.fixed = options.fixed || config.fixed
  options.autoPlay = options.autoPlay || config.autoPlay
  options.muted = options.muted || config.muted
  options.preload = options.preload || config.preload
  options.speedOptions = options.speedOptions || config.speedOptions
  // put a regex here to tranlate string into seconds
  //const hour = options.audio.duration.match(/([0-1]?\d|2[0-3])/)[0]
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

  if (!Array.isArray(options.audio)) {
    options.audio = [options.audio]
  }
  options.audio.map(item => {
    item.name = item.name || 'Unknown Title'
    item.artist = item.artist || 'Unknown Artist'
    item.cover = item.cover || null
    item.duration = item.duration || 0
  })
  return options
}
