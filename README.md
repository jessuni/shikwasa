## About

Shikwasa is an audio player born for podcast. You may enjoy a podcast with occasional playback controls to get the best listening experience, just like I do - tweaking with handy forward/backward or speed buttons. But chances are traditional html audio players don't offer them - who would play a music on 1.5x speed?

### What does Shikwasa mean?

In case you wonder, it's a popular citrus fruit from Okinawa, Japan. 

## Usage
1. Specify a container for the player to be injected into. For example:
   ```html
   <div class="elementOfYourChoice">
   /* this is where the player will be placed */
   </div>
   ```
2. create a new instance
```javascript
const player = new Shikwasa({
  fixed: {
    value: true,
    position: bottom,
  },
  container: document.querySelector('.elementOfYourChoice'),
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

```
player.play()  // play the current audio

player.play({  // pass a designated audio object to play it immediately
  title: 'Embrace the universe with a cup of shikwasa juice',
  artist: 'Shikwasa',
  cover: 'image.png',
  src: 'sourceAudio.mp3'
})

player.pause()  // pause the current audio

player.toggle()  // toggle audio play state between play and pause

player.destroy() // destroy player
```

### Options

| Property               | Type            | default Value                                           | Valid values                                                                                                       |
|------------------------|-----------------|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| fixed(optional)        | Object          | <code>{<br>value: false,<br>position: null,<br>}</code> | value: Boolean<br>position: `top`, `bottom`                                                                    |
| container(optional)    | HTMLCollection  | `document.querySelector('body')`                        |                                                                                                                    |
| themeColor(optional)   | String          | `#00869B`                                               |                                                                                                                    |
| autoplay(optional)     | Boolean         | `false`                                                 |                                                                                                                    |
| muted(optional)        | Boolean         | `false `                                                |                                                                                                                    |
| preload(optional)      | String          | `metadata`                                              | `auto`, `metadata`, `none`, for details view [MDN Doumentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-preload)                                                                                    |
| speedOptions(optional) | Array           | `[0.5, 0.75, 1.25, 1.5]`                                | each value of the array should be between the range of 0.25 to 5.0, or will likely be ignored by certain browsers  |
| audio(required)        | Object          | `null`                                                  | <code>{<br>title: String,<br>artist: String,<br>cover: String,<br>src: String,<br>}</code>                         |




