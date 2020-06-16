import { DEFAULT ,CONFIG } from './config'

export function secondToTime(time) {
  time = Math.round(time)
  let hour = Math.floor(time / 3600)
  let min = Math.floor((time - hour * 3600) / 60)
  let sec = Math.floor(time - hour * 3600 - min * 60)
  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec
  if (hour === 0) {
    return `${min}:${sec}`
  }
  hour = hour < 10 ? '0' + hour : hour
  return `${hour}:${min}:${sec}`
}

export function numToString(num) {
  const float = parseFloat(num).toFixed(2)
  return float.slice(-1) === '0' ? float.slice(0, -1) :float
}

export function marquee(textWrap, textEl, speed = 60) {
  const overflow = textEl.offsetWidth - textWrap.offsetWidth
  if (overflow > 0) {
    textWrap.setAttribute('data-overflow', '')
    const duration = textEl.offsetWidth / speed
    textWrap.style.animationDuration = `${duration}s`
  } else {
    textWrap.removeAttribute('data-overflow')
  }
}

export function handleOptions(options) {
  const _options = Object.assign({}, options)
  _options.audio = Object.assign({}, options.audio)
  Object.keys(DEFAULT).forEach(k => {
    _options[k] = (_options[k] || typeof _options[k] === 'boolean') ?
      _options[k] : DEFAULT[k]
  })
  if (typeof _options.container === 'function') {
    _options.container = _options.container()
  }
  const fixedType = CONFIG.fixedOptions.find(item => item === _options.fixed.type)
  if (!fixedType) {
    _options.fixed.type = DEFAULT.fixed.type
  }
  if (!Array.isArray(_options.speedOptions)) {
    _options.speedOptions = [_options.speedOptions]
  }
  if (_options.speedOptions.indexOf(1) === -1) {
    _options.speedOptions.push(1)
  }
  _options.speedOptions = _options.speedOptions
    .map(sp => parseFloat(sp))
    .filter(sp => !isNaN(sp))
  if (_options.speedOptions.length > 1) {
    _options.speedOptions.sort((a, b) => a - b)
  }
  return _options
}

export function handleAudio(audio = {}, parsedData = {}) {
  let audioData = Object.assign({}, audio)
  Object.keys(CONFIG.audioOptions).forEach(k => {
    audioData[k] = audioData[k] ||
      parsedData[k] ||
      CONFIG.audioOptions[k]
  })
  return audioData
}

export async function parseAudio(audio = {}, parser = {}) {
  const { tags } = await parserWrap(audio.src, parser) || {}
  const tagData = handleParsedTags(tags)
  return handleAudio(audio, tagData)
}

export function parserWrap(src, parser) {
  return new Promise((resolve, reject) => {
    parser.read(src, {
      onSuccess: resolve,
      onError: reject,
    })
  })
}

export function handleParsedTags(tags = {}) {
  let cover, chapters, duration
  const { title, artist } = tags
  if (tags.picture && tags.picture.data && tags.picture.format) {
    const byteArray = new Uint8Array(tags.picture.data)
    const blob = new Blob([byteArray], { type: tags.picture.format })
    cover = URL.createObjectURL(blob)
  }
  if (tags.TLEN && tags.TLEN.data) {
    duration = +tags.TLEN.data / 1000
  }
  if (tags.CHAP && tags.CHAP.length) {
    chapters = tags.CHAP
      .filter(ch => ch.id === 'CHAP')
      .map(ch => {
        if (ch.data && ch.data.subFrames && ch.data.subFrames.TIT2) {
          return {
            id: ch.data.id,
            startTime: ch.data.startTime / 1000,
            endTime: ch.data.endTime / 1000,
            title: ch.data.subFrames.TIT2.data,
          }
        }
        return false
      })
      .sort((a, b) => a.id - b.id)
  }
  return { title, artist, cover, duration, chapters }
}

export function createElement(options) {
  options.tag = options.tag || 'div'
  const el = document.createElement(options.tag)
  if (options.className) {
    if (typeof options.className === 'string') {
      el.classList.add(options.className)
    } else {
      options.className.forEach(className => {
        el.classList.add(className)
      })
    }
  }
  if (options.attrs) {
    Object.keys(options.attrs).forEach(key => {
      el.setAttribute(key, options.attrs[key])
    })
  }
  if (options.innerHTML) {
    el.innerHTML = options.innerHTML
  }
  return el
}

export function toggleAttribute(el, name) {
  if (typeof el.toggleAttribute === 'function') {
    el.toggleAttribute(name)
    return
  }
  if (el.hasAttribute(name)) {
    el.removeAttribute(name)
  } else {
    el.setAttribute(name, '')
  }
}

export function animateScroll(
  timestamp,
  startTime,
  duration,
  startPos,
  distance,
  scrollEl) {
  const elapsed = (timestamp - startTime) / 1000
  const t = elapsed / duration

  // easing in a linear fashion
  scrollEl.scrollTop = startPos + distance * t
  if (t < 1) {
    window.requestAnimationFrame(ts => {
      animateScroll(ts, startTime, duration, startPos, distance, scrollEl)
    })
  }
}
