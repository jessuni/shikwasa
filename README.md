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
2. Create a new instance
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

| Property               | Type            | Default Value                                           | Description |
|------------------------|-----------------|---------------------------------------------------------|-------------|
| fixed(optional)        | Object          | <code>{<br>value: false,<br>position: null,<br>}</code> | Whether player should be fixed to viewport.<br>value: Boolean<br>position: `top`, `bottom` |
| container(optional)    | HTMLCollection  | `document.querySelector('body')`                        | Container element for the player |
| themeColor(optional)   | String          | `#00869B`                                               | Theme color of the player |
| autoplay(optional)     | Boolean         | `false`                                                 | If audio should autoplay on load. Note: Chrome and Safari disable audio autoplay unless `muted` is set to `true` by default |
| muted(optional)        | Boolean         | `false `                                                | Whether audio should be muted by default |
| preload(optional)      | String          | `metadata`                                              | `auto`, `metadata`, `none`, for details view [MDN Doumentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-preload) |
| speedOptions(optional) | Array           | `[0.5, 0.75, 1.25, 1.5]`                                | each value of the array should be between the range of 0.25 to 5.0, or will likely be ignored by certain browsers |
| audio(required)        | Object          | `null`                                                  | <code>{<br>title: String,<br>artist: String,<br>cover: String,<br>src: String,<br>}</code> |



## Possible Future Features
1. podcast playlist
2. multiple players with independent controls in one page
