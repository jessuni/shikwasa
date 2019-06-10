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

export function getCoords(el) {
  return el.getBoundingClientRect()
}

export function handleOptions(options) {
  options.fixed = options.fixed || config.fixed
  options.autoPlay = options.autoPlay || config.autoPlay
  options.muted = options.muted || config.muted
  options.preload = options.preload || config.preload
  options.speed = options.speed || config.speed
  // put a regex here to tranlate string into seconds
  //const hour = options.audio.duration.match(/([0-1]?\d|2[0-3])/)[0]
  if (!Array.isArray(options.speed)) {
    options.speed = [options.speed]
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
