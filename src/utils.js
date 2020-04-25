import config from './config'

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
    textWrap.classList.add('Overflow')
    const duration = textEl.offsetWidth / speed
    textWrap.style.animationDuration = `${duration}s`
  } else {
    textWrap.classList.remove('Overflow')
  }
}

export async function handleOptions(options) {
  Object.keys(config).forEach(k => {
    options[k] = (options[k] || typeof options[k] === 'boolean') ?
      options[k] : config[k]
  })
  options.container = document.querySelector(options.container)
  const fixedType = config.fixedOptions.find(item => item === options.fixed.type)
  if (!fixedType) {
    options.fixed.type = config.fixed.type
  }
  if (!Array.isArray(options.speedOptions)) {
    options.speedOptions = [options.speedOptions]
  }
  if (options.speedOptions.indexOf(1) === -1) {
    options.speedOptions.push(1)
  }
  options.speedOptions = options.speedOptions
  .map(sp => parseFloat(sp))
  .filter(sp => !isNaN(sp))
  if (options.speedOptions.length > 1) {
    options.speedOptions.sort((a, b) => a - b)
  }

  if (options.audio && options.audio.src) {
    let audioInfo = {}
    if (options.parser && (!options.audio.title || !options.audio.artist || !options.audio.cover)) {
      const { tags } = await parseAudio(options.audio.src, options.parser)
      audioInfo = handleParsedTags(tags)
    }
    options.audio.title = options.audio.title || audioInfo.title || config.audioTitle
    options.audio.artist = options.audio.artist || audioInfo.artist || config.audioArtist
    options.audio.cover = options.audio.cover || audioInfo.cover || config.audioCover
    options.audio.duration = options.audio.duration || audioInfo.duration || config.audioDuration
    options.audio.chapters = options.audio.chapters || audioInfo.chapters || config.audioChapters
  } else {
    throw new Error('Shikwasa: audio is not specified')
  }
  return options
}

export function parseAudio(src, parser) {
  return new Promise((resolve, reject) => {
    parser.read(src, {
      onSuccess: resolve,
      onError: reject,
    })
  })
}

export function handleParsedTags(tags) {
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
