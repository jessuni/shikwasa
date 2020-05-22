import * as utils from '../src/utils'
import Setup from './setup'
import data from './data'
import { mockSetElStyle } from './mock'

describe('secondToTime',() => {
  const secondToTime = utils.secondToTime

  it('does not display hour when it\'s 0', () => {
    const second = 100
    expect(secondToTime(second)).toMatch(/^\d+:\d+$/)
  })

  it('displays "0" before a number if the number is < 10', () => {
    const second = 3661
    expect(secondToTime(second)).toMatch(/^0\d+:0\d+:0\d+$/)
  })

  test('rounds milliseconds',() => {
    const second = 38368.5
    expect(secondToTime(second)).toBe('10:39:29')
  })
})

describe('numToString', () => {
  const numToString = utils.numToString
  const cases = [
    { name: 'converts integer to float strings', in: 1, out: '1.0' },
    { name: 'does not convert number with 1 digit decimal', in: 99.9, out: '99.9' },
    { name: 'does not convert number with 2 digit decimals', in: 99.99, out: '99.99' },
    { name: 'rounds any decimal of > 2 digits after notation', in: 1.277, out: '1.28' },
    { name: 'converts string', in: '1.5', out: '1.5' },
  ]

  cases.forEach(c => {
    it(c.name, () => {
      expect(numToString(c.in)).toBe(c.out)
    })
  })
})

describe('marquee', () => {
  const parent = document.createElement('div')
  const child = document.createElement('div')

  it('sets overflow style when text overflows', () => {
    mockSetElStyle(parent, 'offsetWidth', 1)
    mockSetElStyle(child, 'offsetWidth', 10)
    utils.marquee(parent, child)
    expect(parent.hasAttribute('data-overflow')).toBeTruthy()
  })
  it('remove overflow style when text does not overflow', () => {
    mockSetElStyle(parent, 'offsetWidth', 10)
    utils.marquee(parent, child)
    expect(parent.hasAttribute('data-overflow')).toBeFalsy()
  })
})

describe('handleOptions', () => {
  const { DEFAULT, CONFIG } = require('../src/config')
  const handleOptions = utils.handleOptions
  let options

  beforeEach(() => {
    options = {}
  })

  it('throws error if audio source is not passed', async() => {
    return expect(handleOptions(options)).rejects.toThrow()
  })

  describe('with audio source', () => {
    beforeEach(() => {
      options.audio = { src: '#' }
    })

    it('uses default value for any unprovided options', async () => {
      const audioOptions = {
        ...CONFIG.audioOptions,
        src: '#',
      }
      const rv = await handleOptions(options)
      expect(rv).toMatchObject({
        ...DEFAULT,
        container: DEFAULT.container(),
        audio: audioOptions,
      })
    })

    it('mounts to the right container', () => {
      document.body.innerHTML = '<div class="container"></div>'
      options.container = () => document.querySelector('.container')
      return handleOptions(options).then(options => expect(options).toMatchObject({ container: document.body.querySelector('.container') }))
    })

    it('sets fixed type correctly', () => {
      options.fixed = { type: 'static' }
      return handleOptions(options).then(options => expect(options).toMatchObject(options))
    })

    it('sets fixed type to default if wrong type is provided', () => {
      options.fixed = { type: '' }
      return handleOptions(options).then((options) => expect(options).toMatchObject({ fixed: { type: DEFAULT.fixed.type } }))
    })

    it('adds 1 to speed if not provided', () => {
      options.speedOptions = 5
      return handleOptions(options).then((options) => expect(options).toMatchObject({ speedOptions: [1, 5] }))
    })
  })
})

describe('handleAudio', () => {
  const handleAudio = utils.handleAudio

  it('used passed data as audio info', () => {
    return handleAudio(data.customAudio).then((audio) => expect(audio).toMatchObject(data.customAudio))
  })

  it('parses audio info if a parser is used', () => {
    return handleAudio({ src: data.src }, Setup.Parser).then((audio) => {
      expect(audio).toMatchObject(data.parsedAudio)
    })
  })
})

describe('parseAudio', () => {
  const parseAudio = utils.parseAudio

  it('parses audio', () => {
    return parseAudio(data.src, Setup.Parser).then(tag => {
      expect(tag).toMatchObject(data.tags)
    })
  })
})

describe('handleParsedTags', () => {
  const handleParsedTags = utils.handleParsedTags
  const { artist, title, duration, cover, chapters } = data.parsedAudio

  return expect(handleParsedTags(data.tags.tags)).toMatchObject({ artist, title, duration, cover, chapters })
})

describe('createElement', () => {
  const createElement = utils.createElement
  const options = {
    tag: 'span',
    className: ['a', 'b'],
    attrs: {
      data: 'name',
    },
    innerHTML: 'html',
  }
  const el = createElement(options)
  const anotherEl = createElement({ className: 'c' })
  it('sets property correctly', () => {
    expect(el.tagName).toBe('SPAN')
    expect(el.className).toBe('a b')
    expect(el.getAttribute('data')).toBe('name')
    expect(el.innerHTML).toBe('html')
    expect(anotherEl.className).toBe('c')
  })
})

describe('toggleAttribute', () => {
  const toggleAttribute = utils.toggleAttribute
  const el = document.createElement('div')
  it('toggles attribute', () => {
    toggleAttribute(el, 'data')
    expect(el.hasAttribute('data')).toBeTruthy()
    toggleAttribute(el, 'data')
    expect(el.hasAttribute('data')).toBeFalsy()
  })

  it('polyfills toggleAttribute function', () => {
    mockSetElStyle(el, 'toggleAttribute', undefined)
    toggleAttribute(el, 'data')
    expect(el.hasAttribute('data')).toBeTruthy()
    toggleAttribute(el, 'data')
    expect(el.hasAttribute('data')).toBeFalsy()
  })
})

describe('animateScroll', () => {
  const animateScroll = utils.animateScroll
  let ts = 10
  window.requestAnimationFrame = jest.fn((cb) => {
    ts += 100
    if (ts < 500) {
      return cb(ts)
    }
  })
  const el = document.createElement('div')
  it('animates', () => {
    animateScroll(ts, 0, 0.1, 10, 100, el)
    expect.assertions(2)
    expect(window.requestAnimationFrame).toHaveBeenCalled()
    expect(el.scrollTop).toBeCloseTo(120)
  })
})

