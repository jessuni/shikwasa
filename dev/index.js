import Shikwasa from '../src/main'

window.Shikwasa = Shikwasa

new Shikwasa({
  fixed: {
    type: 'auto',
  },
  container: '.container',
  audio: {
    title: 'EP01: How Shikwasa Survives in the Infamous Citrus Family',
    artist: 'Shikwasa',
    cover: './assets/logo-contrast.svg',
    src: './assets/Minyo_San_Kyoku.mp3',
  },
})
