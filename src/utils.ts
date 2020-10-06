import { CONFIG ,CONFIG_AUDIO } from './config'
import { Options, IAudio, ITag, IChapter, IElementOptions } from './types'



export function secondToTime(time: string | number): string {
  time = Math.round(+time)
  const hour: number = Math.floor(time / 3600)
  const min: number = Math.floor((time - hour * 3600) / 60)
  const sec: number = Math.floor(time - hour * 3600 - min * 60)
  const minStr: string = min < 10 ? '0' + min : min.toString()
  const secStr: string = sec < 10 ? '0' + sec : sec.toString()
  if (hour === 0) {
    return `${minStr}:${secStr}`
  }
  const hourStr = hour < 10 ? '0' + hour : hour.toString()
  return `${hourStr}:${minStr}:${secStr}`
}

export function numToString(num: number): string {
  // const float = parseFloat(num).toFixed(2)
  const float: string = num.toFixed(2)
  return float.slice(-1) === '0' ? float.slice(0, -1) :float
}

export function marquee(textWrap: HTMLElement, textEl: HTMLElement, speed = 60): void {
  const overflow: number = textEl.offsetWidth - textWrap.offsetWidth
  if (overflow > 0) {
    textWrap.setAttribute('data-overflow', '')
    const duration: number = textEl.offsetWidth / speed
    textWrap.style.animationDuration = `${duration}s`
  } else {
    textWrap.removeAttribute('data-overflow')
  }
}


export function handleOptions(options: Partial<Options>): Options {
  let _options = CONFIG
  for (let k in _options) {
    _options[k] = typeof options[k] === 'undefined' ? _options[k] : options[k]
  }
  _options._container = typeof _options.container === 'function' ? _options.container() : _options.container
  if (_options.speedOptions.indexOf(1) === -1) {
    _options.speedOptions.push(1)
  }
  _options.speedOptions.sort((a: number, b: number) => a - b)
  return _options
}

export function handleAudio(
  audio: Partial<IAudio>,
  parsedData: Record<string, any> = {},
): IAudio {
  let _audio: IAudio = CONFIG_AUDIO
  for (let k in _audio) {
    _audio[k] = audio[k] || parsedData[k] || _audio[k]
  }
  return _audio
}

export async function parseAudio(audio: Partial<IAudio> = {}, parser = {}) {
  // TODO: should define parser type
  if (audio.src) {
    const { tags } = await parserWrap(audio.src, parser)
    const tagData = handleParsedTags(tags)
    return handleAudio(audio, tagData)
  }
}

function parserWrap(src: string, parser: any): Promise<any> {
  return new Promise((resolve: object, reject) => {
    parser.read(src, {
      onSuccess: resolve,
      onError: reject,
    })
  })
}

function handleParsedTags(tags: ITag): Partial<IAudio> {
  let cover: string | undefined
  let chapters: Array<IChapter> = []
  let duration: number | undefined
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
      .filter(ch => ch.id === 'CHAP' && ch.data)
      .reduce((sum, ch) => {
        const chapter: IChapter = {
          id: +ch.data.id,
          startTime: ch.data.startTime / 1000,
          endTime: ch.data.endTime / 1000,
          title: '',
        }
        if (ch.data.subFrames && ch.data.subFrames.TIT2) {
          chapter.title = ch.data.subFrames.TIT2.data
        }
        return sum.push(chapter)
      }, [])
      .sort((a: IChapter, b: IChapter) => a.id - b.id)
  }
  return { title, artist, cover, duration, chapters }
}

export function createElement(options: IElementOptions): HTMLElement {
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
    for(let key in options.attrs) {
      el.setAttribute(key, options.attrs[key])
    }
  }
  if (options.innerHTML) {
    el.innerHTML = options.innerHTML
  }
  return el
}

export function toggleAttribute(el: HTMLElement, name: string) {
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
  timestamp: number,
  startTime: number,
  duration: number,
  startPos: number,
  distance: number,
  scrollEl: HTMLElement
): void {
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
