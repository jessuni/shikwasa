import Events from '../src/events'

let events, cb
let spy = {}

beforeAll(() => {
  spy.console = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  spy.console.mockRestore()
})

beforeEach(() => {
  events = new Events()
  cb = jest.fn()
})

afterEach(() => {
  events = null
})

describe('Events', () => {
  it('adds event handler correctly', () => {
    const eventName = events.audioEvents[0]
    events.on(eventName, cb)
    events.trigger(eventName)
    expect(cb).toHaveBeenCalled()

    const anotherEventName = events.playerEvents[0]
    events.on(anotherEventName, cb)
    events.trigger(anotherEventName)
    expect(cb).toHaveBeenCalled()
  })

  it('warns about unknown events', () => {
    events.on('hello', cb)
    events.trigger('hello')
    expect(cb).not.toHaveBeenCalled()
    expect(spy.console).toHaveBeenCalled()
  })
})
