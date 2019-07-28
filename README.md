![shikwasa branding image](https://i.typcdn.com/jessuni/8438051210_7579.png)
## About

Shikwasa is a web audio player born for podcast. You may enjoy a podcast with occasional playback controls to get the best listening experience, just like I do - tweaking with handy forward/backward or speed buttons. But chances are traditional html audio players don't offer them - who would play a music on 1.5x speed?

[**➡️DEMO here⬅️**](https://jessuni.github.io/shikwasa/)

### What does Shikwasa mean?

In case you wonder, it's the name of a popular citrus fruit from Okinawa, Japan. 🍊

## Installation
`npm install shikwasa`

## Usage
1. Specify a container for the player to be injected into. For example:
   ```html
   <div class="elementOfYourChoice">
   /* this is where the player will be placed */
   </div>
   ```
2. Create a new instance
   ```javascript
   const player = new Shikwasa({
     fixed: {
       type: 'auto',
       position: 'bottom',
     },
     container: document.querySelector('.elementOfYourChoice'),
     transitionDuration: 5000,
     themeColor: '#00869B',
     autoPlay: false,
     muted: false,
     preload: 'metadata',
     speedOptions: [0.5, 0.75, 1.25, 1.5],
     audio: {
       title: 'Hello World!',
       artist: 'Shikwasa FM',
       cover: 'image.png',
       src: 'audio.mp3',
     },
   })
   ```

Note: For now, only one player per page is supported.

## Methods

```javascript
// play the current audio
player.play()

// pass a designated audio object to play it immediately
player.play({
  title: 'Embrace the universe with a cup of shikwasa juice',
  artist: 'Shikwasa',
  cover: 'image.png',
  src: 'sourceAudio.mp3'
})

// pause the current audio
player.pause()

// toggle audio play state between play and pause
player.toggle()

// destroy player
player.destroy()
```

## Options

### audio (required)

type: `Object`

default: `null`

description: The target audio to be played.

properties:

```
  audio: {
    title: String,
    artist: String,
    cover: String,
    src: String,
  }
```


### container (optional)

type: `HTMLCollection`

default: `document.querySelector('body')`

description: Container element for the player

### fixed (optional)

type: `Object`

default:
```
fixed: {
  type: 'auto',
  position: 'bottom',
}
```

description: Whether player should be fixed to viewport.

| Property      | Type     |  Description                             |
|---------------|----------|------------------------------------------|
| type          | `String` |  either `auto`, `static` or `fixed` <br>`auto`: player position is controlled by media queries. Normally the player stays static, but on small screens it will be fixed to viewport<br>`static`: force the player to remain static regardless of screen width<br>`fixed`: force the player to fixed to viewport |
| position      | `String` | either `bottom` or `top` <br>Note: `position` will be ignored when `type` is set to `static`         |

### transitionDuration (optional)

type: `Number`

default: `5000`

description: If audio title is longer than container, a text-scroll will be triggered. This property will control the duration of one complete scroll.

### themeColor (optional)

type: `String`

default: `#00869B`

description: Theme color of the player.

### autoplay (optional)

type: `Boolean`

default: `false`

description: If audio should autoplay on load. Note: Chrome and Safari disable audio autoplay unless `muted` is set to `true` by default


### muted (optional)

type: `Boolean`

default: `false`

description: Whether audio should be muted by default. Right now this will not have any impact on `audio` object's `defaultMuted` property.

### preload (optional)

type: `String`

default: `metadata`

description: choose from `auto`, `metadata` and `none`. For details view [MDN Doumentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-preload).

### speedOptions (optional)

type: `Array`

default: `[0.5, 0.75, 1.25, 1.5]`

description: The playback speed range. Each value of the array should be between the range of 0.25 to 5.0, or will likely be ignored by certain browsers

### download (optional)

type: `Boolean`

default: `true`

description: whether a user can download the audio file. When set to `true`, a download button shows up on the player.

## Possible Future Features
1. podcast playlist
2. multiple players with independent controls in one page
