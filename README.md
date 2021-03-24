![shikwasa branding image](https://i.typlog.com/jessuni/8407706855_086142.png)

<br>

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![dependency][dependency]][dependency-url]
[![jsdelivr][jsdelivr]][jsdelivr-url]
![![CI][CI]][CI-url]
[![license][license]][license-url]

## About

Shikwasa is an web audio player born for podcast. If you're tired of using music players as a substitute to play podcast, you've come to the right place. **SAY NO** to players that does not even support podcast common features!

- 🚀 Ultra lightweight
- 🐣 Dependency free
- 🎬 Podcast chapters
- 🏎 Playback speed control
- 🎮 Skip forward/backward
- 👓 Accessibility-aware
- 🌙 Dark Mode
- 📻 Audio stream support
- 💻 SSR compatible
- [ ] Direct audience to subscription pages
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
    * [theme](#theme)
    * [autoplay](#autoplay)
    * [muted](#muted)
    * [preload](#preload)
    * [speedOptions](#speedoptions)
    * [download](#download)
  * [Events](#events)
  * [Style](#style)
  * [Chapter Plugin](#chapters)
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

    If you use module system, import like this instead:

    ```javascript
      import 'shikwasa/dist/shikwasa.min.css'
      import Shikwasa from 'shikwasa'
    ```

2. Specify a container to inject the player component.

   ```html
    <div class="element-of-your-choice">
      <!-- this is where the player will be injected -->
    </div>
   ```

3. Create an instance of the player

   ```javascript
    // an example with basic init options

    const player = new Shikwasa({
      container: () => document.querySelector('.element-of-your-choice'),
      audio: {
        title: 'Hello World!',
        artist: 'Shikwasa FM',
        cover: 'image.png',
        src: 'audio.mp3',
      },
    })
   ```

   Any child nodes inside `container` will be cleared upon the time Shiwkasa mounts.

Here's a [fiddle](https://jsfiddle.net/jessuni/netgvbwy/8/) to kickstart. To use the chapter feature, you need to import the chapter script and stylesheets as well. [View details](#chapters)

## API

### Methods

**play**

`play(): Promise | void`

Start playing the current audio. In modern browsers and IE9+ it will return a [promise](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play#browser_compatibility) while pre IE9 it will return nothing.

Updating audio via this method is deprecated, use `update` instead.

**pause**

`pause(): void`

Pause the current audio.

**toggle**

`toggle(): Promise | void`

Toggle audio play state between play and pause. [Promise details](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play#browser_compatibility).

**seek**

`seek(time: number): void`

Seek the audio to the new time. `time` is a **number** that specifies target playback time in seconds.

**update**

`update(audio: TAudio): void`

Passing [`TAudio`](#audio) in will replace the current audio source.

```javascript
  player.update({
    title: 'Embrace the universe with a cup of shikwasa juice',
    artist: 'Shikwasa',
    cover: 'image.png',
    src: 'sourceAudio.mp3'
})
```

**destroy**

`destroy(): void`

Destroy the player instance.

**on**

`on(event: string, callback: () => void): void`

Register an event listener. Supported event names see: [Events](#events)

### Properties

**currentTime**
- Read-only
- type: `number`
- default: `0`

The current playback time. Inherits the native [`HTMLMediaElement.currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime).

**muted**

- type: `boolean`
- default: [`options.muted`](#muted)

The current mute state of the player. Similar to the native [`HTMLMediaElement.muted`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted), except that`muted`'s value will not be affected when audio source is updated.

**playbackRate**

- type: `number`
- default: `1`

The current playbackRate of the player. Inherits the native [`HTMLMediaElement.playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate), except that`playbackRate`'s value will not be affected when audio source is updated.

**duration**

- type: `number`
- default: `audio.duration` `||` [`options.audio.duration`](#audio)

## Options

### audio

- **required**
- type: `TAudio | null`
- default: `null`

```javascript
  TAudio {
    src: string,
    title?: string,
    artist?: string,
    cover?: string,
    duration?: number,
    album?: string,
    live?: boolean,
  }
```

The target audio to be played. If `duration` is passed along, players with `preload` option set to `none` will be able to display the custom duration in UI before the audio metadata is fetched. However, after the audio metadata is loaded, this prop will be ignored.

`album` is not visible in the UI. It will only display in the Chrome mini player and any other browsers/devices/operating systems that support `MediaSession`.

`live` is for audio stream.

### container

(Optional) The container element for the player. If `document` is not available in the env, pass a function that will return the container element.

- type: `HTMLElement | () => HTMLElement`
- default: `document.querySelector('body')`

### fixed

(Optional) Whether player should be fixed to viewport.

- type: `TFixed`
  ```javascript
  TFixed {
    type: 'auto' | 'fixed' | 'static',
    position: 'bottom' | 'top',
  }
  ```
- default:
  ```javascript
  {
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

- type: `string`
- default: `'#00869B'`

### theme

(Optional)

- type: `'auto' | 'dark' | 'light'`
- default: `'auto'`

### autoplay

(Optional) If audio should autoplay on load. ⚠️Note: Chrome and Safari disable audio autoplay unless `muted` is set to `true` by default. To comply with this policy, see details in [Chrome Developers](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) and [Webkit Announcement](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/).

- type: `boolean`
- default: `false`

### muted

Whether audio should be muted by default. Similar to HTMLMediaElement's `defaultMuted`.

- type: `boolean`
- default: `false`

### preload

(Optional) Choose from `auto`, `metadata` and `none`. For details view [MDN Doumentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-preload).

If a [`parser`](#parser) is used, the audio will be requested immediately on page load for the parser to work properly, even if `preload` is set to `none`.

- type: `'auto' | 'metadata' | 'none'`
- default: `'metadata'`

### speedOptions

(Optional) The playback speed range. Each value of the array should be between the range of 0.25 to 5.0, or will likely be ignored by certain browsers.
- type: `Array<number>`
- default: `[0.5, 0.75, 1.25, 1.5]`

### download

(Optional) Whether the current audio source is download-able. When set to `true`, the player will provide an anchor with `downlaod` attribute and `href` set to `audio.src`. Cross-origin `href` will not prompt download due to anchor's nature, but you can offer an alternative `blob:`, `data:` url or a same-origin direct download link(DDL).

- type: `string | boolean`
- default: `false`
- alternatives:

```javascript
// direct user to the source url
download: true
// direct user to a custom url, preferrably one configured to generate download
download: 'data:audio/mp3;base64,...'
```

### parser

(Optional) To focus on the player itself as well as to maintain Shikwasa as efficient as possible, we don't extract data from audio files. If you don't have control over the chapter data but would like to implement chapter feature, we support using [`jsmediatags`](https://github.com/aadsm/jsmediatags) as an external parser to parse the current audio's metadata.

It will read the audio's `title`, `artist`, `duration` and `chapters`, meaning you don't have to provide these four properties into `audio` manually unless you preferred your own. **Priority: property values passed to `audio` > parsed data.**

- type: `null | JSMediatags`
- default: `null`
- usage:

```javascript
  npm install jsmediatags // https://github.com/aadsm/jsmediatags
```

```javascript
  import jsmediatags from 'jsmediatags'

  new Shikwasa({
    ...
  parser: jsmediatags,
  audio: { src: ... },
  })
```


⚠️Note: If `audio.src` is not of the same origin, proper CORS configuration will be needed to use the parser.
Due to `jsmediatags` limitation, relative urls are not supported. Please use absolute urls for `audio.src`.

## Events

Support all [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) native events.

Plus player events:

`audioupdate`: fired when audio source is updated.

`audioparse`: fired when audio file data is parsed.

## Style

Although Shikwasa have not yet provided a full customization support of its styles, some CSS variables are available and should cover basic needs.

```css
  --background-body                           /* background of the player body */
  --color-title                               /* color of the title text */
  --color-artist                              /* color of the artist text */
  --color-button: var(--color-primary);       /* color of the buttons, defaults to `themeColor` */
  --color-button-disabled                     /* color of button:disabled */
  --color-button-active-background            /* color of the background of button:active` */
  --color-handle: var(--color-primary);       /* color of the playback progress handle, defaults to `themeColor` */
  --color-handle-disabled                     /* color of the handle:disabled */
  --color-bar-loaded                          /* color of the loaded playback progress, defaults to `themeColor` */
  --color-bar-played: var(--color-primary);   /* color of the loaded playback progress, defaults to `themeColor` */
  --color-time                                /* color of the playback time */
  --color-spinner: var(--color-primary);      /* color of the playback loading indicator, defaults to `themeColor` */
  --color-live-symbol: var(--color-primary);  /* color of the live indicator symbol, defaults to `themeColor` */
  --color-live-text: var(--color-primary);    /* color of the live indicator text, defaults to `themeColor` */
  --shadow-body                               /* box shadow of the player body */
  --shadow-body-mobile                        /* box shadow of the player body in small screens */
  --shadow-handle                             /* box shadow of the playback progress handle */
  --shadow-handle-mobile                      /* box shadow of the playback progress handle in small screens */
```

Usage: overwrite the style property in your player container:
```css
  .container .shk {
    --background-body: linear-gradient(-45deg, #84ccff, #b8e8ff);
  }
```

## Chapters

Shikwasa supports chapters display and playback control with the help of its external chapter plugin. To use this feature:

1. Register the chapter plugin before creating a Shikwasa instance.

   ```javascript
    import Chapter as 'shikwasa/dist/shikwasa.chapter.cjs'
    import 'shikwasa/dist/shikwasa.chapter.min.css'

    Shikwasa.use(Chapter)
    new Shikwasa({...})
   ```

2. This does not guarantee that the audio will display chapters. To display chapters, you need to provide chapter data to the player.

   If you don't have direct access to the chapter data, Shikwasa has built-in support to work with [jsmediatags](https://github.com/aadsm/jsmediatags) to read and extract the data from the audio file;

   - (1) To manually provide chapters, add the `chapters` property when passing `audio` into [options](#options) or [`.update(audio)`](#methods).
      ```javascript
        audio: {
          ...
          // manually provide chapters
          chapters: [
            { title, startTime, endTime }, // the first chapter
            { title, startTime, endTime }, // the second chatper
          ],
        }
      ```

      The structure of a single chapter object:

      | Property      | Type     |  Description                             |
      |---------------|----------|------------------------------------------|
      | title         | string   | chapter title                            |
      | startTime     | number   | chapter start time in seconds            |
      | endTime       | number   | chapter end time in seconds              |

      ⚠️Note: `endTime` should be the same as `startTime` of the next chapter.


   - (2) To use an external parser, pass `jsmediatags` in the `parser` options. [How to use a parser?](#parser)

**(1) will take the higher priority.**

### Registering Chapter plugin will empower Shikwasa instance with the following API:

#### Methods:

**updateChapter**

`updateChapter(index: number): void`

Seek the audio to the target chapter. `index` is the index of of `chapters` array.

#### Properties:

**chapters**

`<property>`
- Read-only
- type: `Array<TChapter> | []`
- default: `[]`

```javascript
  TChapter {
    title: string,
    startTime: number,
    endTime: number,
  }
```

Chapter metadata of the current audio, if any. See [Chapter](#Chapters).

**currentChapter**

- Read-only
- type: `Null | TChapter`
- default: `null`

Indicate which chapter is currently on play, if any. See [Chapter](#Chapters).

#### Events:

`chapterchange`: fired when `currentChapter` changes.

## Roadmap
🟡 v2.3.0:
- [ ] In-player subscription feature that direct the audience to your subsciption pages in major podcasting platforms

🟡 v2.2.0:
- [x] rewritten in Typescript 👉 finished but not tested, contribution welcomed

✅ v2.1.0:
- [x] live mode
- [x] safely update audio metadata
- [x] offer more UI customization options

✅ v2.0.0:
- [x] supporting audio id3 metadata
- [x] cleaner & sleeker interface
- [x] dark mode
- [x] a complete rewrite
- [x] keyboard support

## What about the weird name of this project?

*Shikwasa* is the name of a popular citrus fruit from Okinawa, Japan. 🍊

Love it, name after it.

## License
[MIT](./LICENSE)


[npm]: https://img.shields.io/npm/v/shikwasa.svg?style=flat-square
[npm-url]: https://npmjs.com/package/shikwasa
[size]:http://img.badgesize.io/https://unpkg.com/shikwasa/dist/shikwasa.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-url]:https://github.com/jessuni/shikwasa/tree/master/dist
[license]:https://img.shields.io/github/license/jessuni/shikwasa?style=flat-square
[license-url]:https://github.com/jessuni/shikwasa/blob/master/LICENSE.md
[jsdelivr]: https://badgen.net/jsdelivr/hits/npm/shikwasa?color=orange&style=flat-square
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/shikwasa
[dependency]: https://img.shields.io/badge/dependencies-none-lightgrey.svg?style=flat-square
[dependency-url]: https://david-dm.org/jessuni/shikwasa
[CI]: https://github.com/jessuni/shikwasa/actions
[CI-url]: https://github.com/jessuni/shikwasa/workflows/CI/badge.svg?branch=master
