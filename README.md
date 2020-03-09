![shikwasa branding image](https://i.typcdn.com/jessuni/8438051210_7579.png)

<br>

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![dependency][dependency]][dependency-url]
[![jsdelivr][jsdelivr]][jsdelivr-url]
[![license][license]][license-url]

## About

Shikwasa is an web audio player born for podcast. If you're tired of using music players as a substitute to play podcast, you've come to the right place. **SAY NO** to players that does not even support podcast common features!

- 🚀Ultra lightweight
- 🐣Dependency free
- 🏎Playback speed control
- 🎮Skip forward/backward
- 🎵Web Audio API
- [ ] Podcast Chapters
- [ ] Playlist

[**➡️DEMO here⬅️**](https://jessuni.github.io/shikwasa/)

<details>
  <summary>📖Table of Contents</summary>

  * [Installation](#installation)
  * [Usage](#usage)
  * [API](#api)
    * [Methods](#methods)
    * [Properties](#properties)
  * [Options](#options)
    * [audio](#audio)
    * [container](#container)
    * [fixed](#fixed)
    * [themeColor](#themecolor)
    * [autoplay](#autoplay)
    * [muted](#muted)
    * [preload](#preload)
    * [speedOptions](#speedoptions)
    * [download](#download)
  * [Events](#events)
  * [Roadmap](#roadmap)
  * [What about the weird name of this project?](#what-about-the-weird-name-of-this-project)
  * [License](#license)

</details>

## Installation
`npm install shikwasa`

## Usage
1. include stylesheet and script

   ```html
    <head>
      <link rel="stylesheet" href="shikwasa.min.css">
    </head>
    <body>
      <script src="shikwasa.min.js"></script>
    </body>
   ```
2. Specify a container for the player to be injected into. For example:

   ```html
    <div class="element-of-your-choice">
      <!-- this is where the player will be injected -->
    </div>
   ```

3. Create an instance of the player

   ```javascript
   // an example with basic init options

   const player = new Shikwasa({
     container: '.element-of-your-choice',
     audio: {
       title: 'Hello World!',
       artist: 'Shikwasa FM',
       cover: 'image.png',
       src: 'audio.mp3',
     },
   })
   ```

  If `container` has any child nodes, it will be cleared before Shikwasa mounts.

4. If you use module system, import like this:

   ```javascript
    import 'shikwasa/dist/shikwasa.min.css'
    import Shikwasa from 'shikwasa'

    const player = new Shikwasa(options)
   ```

## API

### Methods

**.play(audio)**

If no parameter supplied, calling it will play the current audio. Passing an [`audio` object](#audio) in will replace the previous audio source, and play the new one immediately.

```javascript
// play with the current audio source
player.play()

// pass an audio object to play with the new audio source immediately
player.play({
  title: 'Embrace the universe with a cup of shikwasa juice',
  artist: 'Shikwasa',
  cover: 'image.png',
  src: 'sourceAudio.mp3'
})
```
**.pause()**

Pause the current audio.

**.toggle()**

Toggle audio play state between play and pause.

**.seek(time)**

`time` is a **number** that specifies target playback time. Calling this method with `time` will seek the audio to the new time.

**.destroy()**

Destroy the player instance.

**.on(event, callback)**

Register an event listener. Supported events see: [Events](#events)

### Properties

**.currentTime**

A read-only property that indicates the current playback time. Similar to the native [`htmlMediaElement.currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime).

## Options

### audio

(Required) The target audio to be played. If `duration` is passed in, players with `preload` option set to `none` will have a audio duration time display before the audio metadata is fetched. However, after the audio metadata is loaded, this prop will be ignored.

- **required**
- type: `Object`
- default: `null`
- properties:

```javascript
  audio: {
    title: String,
    artist: String,
    cover: String,
    src: String,
    duration: Number,  // optional
  }
```

### container

(Optional) The container element for the player, in CSS selector pattern.

- type: `String`
- default: `body`

### fixed

(Optional) Whether player should be fixed to viewport.

- type: `Object`
- default:

```javascript
fixed: {
  type: 'auto',
  position: 'bottom',
}
```
- details:

| Property      | Type     |  Description                             |
|---------------|----------|------------------------------------------|
| type          | `String` |  either `auto`, `static` or `fixed` <br>`auto`: player position is controlled by media queries. Normally the player stays static, but on small screens it will be fixed to viewport<br>`static`: force the player to remain static regardless of screen width<br>`fixed`: force the player to fix to viewport |
| position      | `String` | either `bottom` or `top` <br>⚠️Note: `position` will be ignored when `type` is set to `static`         |

### themeColor

(Optional) Theme color of the player.

- type: `String`
- default: `#00869B`

### autoplay

(Optional) If audio should autoplay on load. ⚠️Note: Chrome and Safari disable audio autoplay unless `muted` is set to `true` by default. To comply with this policy, see details in [Chrome Developers](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) and [Webkit Announcement](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/).

- type: `Boolean`
- default: `false`

### muted

Whether audio should be muted by default. Right now this will not have any impact on `audio` object's `defaultMuted` property.

- type: `Boolean`
- default: `false`

### preload

(Optional) Choose from `auto`, `metadata` and `none`. For details view [MDN Doumentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-preload).

- type: `String`
- default: `metadata`

### speedOptions

(Optional) The playback speed range. Each value of the array should be between the range of 0.25 to 5.0, or will likely be ignored by certain browsers. If `1` is not set in the array, it will be injected upon initiation. Audio's playback speed is always defaulted to `1`.

- type: `Array`
- default: `[0.5, 0.75, 1.25, 1.5]`

### download

(Optional) Whether the current audio file is download-able. When set to `true`, a download button shows up on the player.

- type: `Boolean`
- default: `false`

## Events
Support all [htmlMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) native events.

## Roadmap

Under v2.0:
- [ ] supporting audio id3 metadata --currently working on this one
- [x] cleaner & sleeker interface
- [x] dark mode

Others:
- [ ] podcast playlist

## What about the weird name of this project?

*Shikwasa* is the name of a popular citrus fruit from Okinawa, Japan. 🍊

Love it, name after it.

## License
[MIT](./LICENSE)


[npm]: https://img.shields.io/npm/v/shikwasa.svg?style=flat-square
[npm-url]: https://npmjs.com/package/shikwasa
[size]:https://badge-size.herokuapp.com/jessuni/shikwasa/master/dist/shikwasa.min.js?compression=gzip&style=flat-square
[size-url]:https://github.com/jessuni/shikwasa/tree/master/dist
[license]:https://img.shields.io/github/license/jessuni/shikwasa?style=flat-square
[license-url]:https://github.com/jessuni/shikwasa/blob/master/LICENSE.md
[jsdelivr]: https://badgen.net/jsdelivr/hits/npm/shikwasa?color=orange&style=flat-square
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/shikwasa
[dependency]: https://badgen.net/david/dep/jessuni/shikwasa?color=grey&style=flat-square
[dependency-url]: https://david-dm.org/jessuni/shikwasa
