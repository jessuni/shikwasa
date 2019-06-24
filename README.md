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

player.pause()  //pause the current audio

player.toggle()  //toggle play/pause
player.destroy() // destroy player
```

### Options

| Property       | Type    | default Value                                           | Valid values                                                                                                     |
|----------------|---------|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `fixed`        | Object  | <code>{<br>value: false,<br> position: null<br>}</code> | `value`: Boolean,<br>`position`: `top`, `bottom`                                                                 |
| `autoplay`     | Boolean | false                                                   |                                                                                                                  |
| `muted`        | Boolean | false                                                   |                                                                                                                  |
| `preload`      | String  | `metadata`                                              | `auto`, `metadata`, `none`                                                                                       |
| `speedOptions` | Array   | `[0.5, 0.75, 1.25, 1.5]`                                | each value of the array should be between the range of 0.25 to 5.0, or will likely be muted by certain browsers  |
| `audio`        | Object  | {}                                                      | <code>{<br>title: String,<br>artist: String,<br>cover: String,<br>src: String<br>}</code>                           |




