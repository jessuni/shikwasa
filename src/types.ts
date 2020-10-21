export const audioEvents = ['abort', 'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'] as const

const playerEvents = ['audioupdate', 'audioparse'] as const

export type TEventName = typeof audioEvents[number] | typeof playerEvents[number]

export type TEventsArray = Record<TEventName, IEventHandler[]>

export type TEvent = MouseEvent | TouchEvent

export interface IEventHandler { (this: void, data: Event | Record<string, any>): void }

export interface Options {
  container: HTMLElement | ((...args: any) => HTMLElement)
  _container: HTMLElement
  parser: any
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
  id: number
  startTime: number
  endTime: number
  title: string
}

export interface IElementOptions<K> {
  tag?: K
  className?: string | string[]
  attrs?: Record<string, any>
  innerHTML?: string
}

export interface IComponents {
  _name: string
}

export interface Type<T> extends Function {
  new (...args: any[]): T
}

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

export type TComponents = HTMLElement | null

export type TButtonComponents = HTMLButtonElement | null

export enum Bar {
  played = 'audioPlayed',
  loaded = 'audioLoaded',
}

export declare class IPlugin<T> {
  constructor(ctx: T, ...args: any)
}

export interface IPluginClass<T> {
  new(ctx: T): IPlugin<T>
  _name: string
}

