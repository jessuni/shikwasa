## how to use after installation

### To create a new instance

```javascript
const player = new Shikwasa({
  fixed: {
    value: true,
    position: bottom,
  }
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

The script will automatically look for container with the classname `shk`, for example:

```html
<div class="shk">
/* this is where the player will be placed */
</div>
```

### Methods

```
player.play()  // play the current audio

player.play({  // pass a designated audio object to play it immediately
  title: 
  artist:
  cover:
  src:
})
```

`player.pause()`
`player.toggle()`
`player.destroy()`


