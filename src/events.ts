import { TEventName, TEventsArray, IEventHandler } from './types'

export default class Events {
  events: TEventsArray = {} as TEventsArray

  on(name: TEventName, callback: IEventHandler): void {
    if (!this.events[name]) {
      this.events[name] = []
    }
    this.events[name].push(callback)
  }

  trigger(name: TEventName, data: Event | Record<string, any> = {}): void {
    if (this.events[name] && this.events[name].length) {
      this.events[name].forEach(fn => fn(data))
    }
  }
}
