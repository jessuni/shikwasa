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
- 🎬Podcast chapters
- 🏎Playback speed control
- 🎮Skip forward/backward
- 👓Accessibility-aware
- 🌙Dark Mode
- SSR compatible
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
  * [Chapters](#chapters)
  * [Roadmap](#roadmap)
  * [What about the weird name of this project?](#what-about-the-weird-name-of-this-project)
  * [License](#license)

</details>

## Installation
`npm install shikwasa`

Also available on CDN: https://www.jsdelivr.com/package/npm/shikwasa

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
    <div class="elementOfYourChoice">
      <!-- this is where the player will be injected -->
    </div>
   ```

3. Create an instance of the player

   ```javascript
   // an example with basic init options

   const player = new Shikwasa({
     container: () => document.querySelector('.elementOfYourChoice'),
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

**.play()**

Start playing the current audio. Updating audio via this method is deprecated, please use `update(audio)` instead.

**.pause()**

Pause the current audio.

**.toggle()**

Toggle audio play state between play and pause.

**.seek(time)**

`time` is a **number** that specifies target playback time. Calling this method with `time` will seek the audio to the new time.

**.update(audio)**

Passing an [`audio` object](#audio) in will replace the current audio source.

```javascript
player.update({
  title: 'Embrace the universe with a cup of shikwasa juice',
  artist: 'Shikwasa',
  cover: 'image.png',
  src: 'sourceAudio.mp3'
})
```

**.updateChapter(index)**

Seek the audio to the target chapter. `index` is the index of of `chapters` array. Part of the [Chapter Feature](#Chapters).

**.destroy()**

Destroy the player instance.

**.on(event, callback)**

Register an event listener. Supported events see: [Events](#events)

### Properties

**.chapters**

- Read-only
- type: `Array`
- default: `[]`

Chapter metadata of the current audio. Part of the [Chapter Feature](#Chapters).

**.currentChapter**

**.currentTime**
- Read-only
- type: `Array`
- default: `null`

Indicate which chapter is currently on play. Chapter feature is available only when `audio.chapters` is passed or an audio parser is used.

- Read-only
- type: `Number`
- default: `0`

The current playback time. Similar to the native [`HTMLMediaElement.currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime).

**.muted**

- type: `Boolean`
- default: `options.muted`

The current mute state of the player. Similar to the native [`HTMLMediaElement.muted`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted), except that`muted`'s value will not be affected when audio source is updated.

**.playbackRate**

- type: `Number`
- default: `1`

The current playbackRate of the player. Similar to the native [`HTMLMediaElement.playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate), except that`playbackRate`'s value will not be affected when audio source is updated.

**.duration**

- type: `Number`
- default: `audio.duration || options.audio.duration`

## Options

### Audio

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
    chapters: Array,  // optional, read below for details
  }
```

This is part of the [Chapter Feature](#Chapters).

```javascript
  audio.chapters: [{
    title,
    startTime,
    endTime,
  }]`
```

| Property      | Type     |  Description                             |
|---------------|----------|------------------------------------------|
| title         | String   | chapter title                            |
| startTime     | Number   | chapter start time in seconds            |
| endTime       | Number   | chapter end time in seconds              |

⚠️Note: `endTime` should be the same as `startTime` of the next chapter.

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

Whether audio should be muted by default. Similar to HTMLMediaElement's `defaultMuted`.

- type: `Boolean`
- default: `false`

### preload

(Optional) Choose from `auto`, `metadata` and `none`. For details view [MDN Doumentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-preload).

When set to `none`, Shikwasa's behavior will be slightly different from that of the native `<audio>` element in Webkit browsers: unlike the native one that will request audio source even when `preload = none`, Shikwasa will not trigger any request until the audio is played – to prevent uneccessary requests and ensure the same behavior across all browsers.

- type: `String`
- default: `metadata`

### speedOptions

(Optional) The playback speed range. Each value of the array should be between the range of 0.25 to 5.0, or will likely be ignored by certain browsers.
- type: `Array`
- default: `[0.5, 0.75, 1.25, 1.5]`

### download

(Optional) Whether the current audio source is download-able. When set to `true`, the player will provide an anchor with `downlaod` attribute and `href` set to `audio.src`. Cross-origin `href` will not prompt download due to anchor's nature, but you can offer an alternative `blob:`, `data:` url or a same-origin direct download link(DDL).

- type: `Boolean|String`
- default: `false`
- alternatives:

```javascript
download: true
// or with a url
download: 'data:audio/mp3;base64,...'
```

### parser

(Optional) Use an external parser to parse the current audio's metadata. If a parser passed, it will read the audio's `title`, `artist`, `duration` and `chapters`, meaning you don't have to provide these four properties into `audio` manually unless you preferred your own. **Priority: property values passed to `audio` > parsed data.**

-type: `Null|Object`
-default: `null`
-usage: `parser: jsmediatags`

⚠️Note: If `audio.src` is not of the same origin, proper CORS configuration will be needed to use the parser.
Due to `jsmediatags` limitation, relative urls are not supported. Please use absolute urls for `audio.src`.

## Events

Support all [htmlMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) native events.

## Chapters

The chapter feature will be dynamically available in either ways:

1. If a `chapters` array is included in `audio` in options / audio update. [How to pass chapter?](#Audio)
2. Pass an external parser, [jsmediatags](https://github.com/aadsm/jsmediatags), in the `parser` options. [How to use a parser?](#parser)

Then `.updateChapter(index)`(see [here](#methods)), `chapters` and `currentChapter`(see [here](#properties)) will also be available to use.

`chapters` array passed in the options / audio update will take higher priority.

### Using parser for chapters

```javascript
import jsmediatags from 'jsmediatags'

const shk = new Shikwasa({
  ...
  parser: jsmediatags,
  audio: {
    src: ...
    // the parser will read title, artist, duration and chapters info from the audio file, so you don't need to provide them anymore
  }
})
```
Other information check out [parser](#parser).

## Roadmap

Under v1.0.0:
- [ ] supporting audio id3 metadata --currently working on this one
- [ ] cleaner & sleeker interface
- [ ] dark mode

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
