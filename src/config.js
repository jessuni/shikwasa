const CONFIG = {
  container: 'body',
  parser: null,
  fixed: {
    type: 'auto',
    position: 'bottom',
  },
  download: false,
  themeColor: '#00869B',
  theme: 'auto',
  autoPlay: false,
  muted: false,
  preload: 'metadata',
  speedOptions: [0.5, 0.75, 1.25, 1.5],
  audio: null,
  // not in options
  fixedOptions: ['auto', 'static', 'fixed'],
  audioOptions: {
    title: 'Unknown Title',
    artist: 'Unknown Artist',
    duration: NaN,
    cover: null,
    chapters: [],
    src: null,
  },
}



export default CONFIG
