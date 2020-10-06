import { EventName, CallbackType } from './types'

export default class Events {
  events: Record<EventName, CallbackType[]>

  on(name: EventName, callback: CallbackType) {
    if (!this.events[name]) {
      this.events[name] = []
    }
    this.events[name].push(callback)
  }

  trigger(name: EventName, data = {}): void {
    if (this.events[name] && this.events[name].length) {
      this.events[name].forEach(fn => fn(data))
    }
  }
}
