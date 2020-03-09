import Shikwasa from '../src/main'
import '../src/css/base.css'
import '../src/css/chapter.css'
// import Chapters from '../src/chapters'
// import Shikwasa from '../dist/shikwasa.cjs'


const ep1 = {
  title: '11 Dr. Greg Siegle: What if Freaking Out and Shutting Down are Perfectly Normal? ',
  artist: '神爱玩财',
  cover: 'https://i.typcdn.com/fourgifts/8435942724_374157.jpg',
  src: 'https://v.typcdn.com/fourgifts/8433169807_124642.mp3',

}
const ep2 = {
  title: 'How Do Psychedelics Help Recovering the Deepest Wound in Heart',
  artist: 'Shikwasa',
  cover: 'https://i.typcdn.com/spiralpodcast/8436694584_827319.jpg',
  src: 'https://v.typcdn.com/spiralpodcast/8436720158_175515.mp3',
  duration: 4430,
}

// const jsmediatags = window.jsmediatags
// Shikwasa.use('chapter', Chapters, { jsmediatags })

new Shikwasa({
  fixed: {
    type: 'auto',
    position: 'bottom',
  },
  preload: 'metadata',
  container: '.container',
  theme: 'auto',
  themeColor: '#00CCB8',
  audio: ep2,
  download: true,
})

new Shikwasa({
  preload: 'none',
  container: '.container-2',
  theme: 'dark',
  themeColor: '#00CCB8',
  audio:ep1,
  download: true,
})




