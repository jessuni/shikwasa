export const audioEvents = ['abort', 'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'] as const

const playerEvents = ['audioupdate', 'audioparse'] as const

export type EventName = typeof audioEvents[number] | typeof playerEvents[number]

// TODO: does here really need event?
export interface ICallback { (this: void, data: Event | object): void }

export interface Options {
  container: HTMLElement | ((...args: any) => HTMLElement)
  _container: HTMLElement
  // TODO: object type should be 'jsmediatag' type
  parser: object | null
  fixed: {
    type: 'auto' | 'fixed' | 'static',
    position?: 'top' | 'bottom',
  }
  download: boolean
  themeColor: string
  theme: string
  autoPlay: boolean
  muted: boolean
  preload: string
  speedOptions: Array<number>
  audio: IAudio
  [key: string]: any
}

export interface ITag {
  title?: string
  artist?: string
  TLEN?: {
    data?: string | number
  }
  CHAP?: any[]
  [key: string]: any
}

export interface IChapter {
  id: number,
  startTime: number,
  endTime: number,
  title: string,
}

export interface IElementOptions {
  tag?: keyof HTMLElementTagNameMap
  className?: string | string[],
  attrs?: Record<string, any>,
  innerHTML?: string,
}

export interface TComponents {
  _name: string
}

export interface Type<T> extends Function {
  new (...args: any[]): T
}

// differentiate HTMLAudioElement(this.audio) and AudioOptions(this._audio, options.audio)
export interface IAudio {
  src: string
  cover: string
  title: string
  artist: string
  album?: string
  chapters?: Array<IChapter>
  duration: number,
  [key: string]: any
}


