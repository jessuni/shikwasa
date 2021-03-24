export const DEFAULT = {
  container: () => document.querySelector('body'),
  parser: null,
  fixed: {
    type: 'auto',
    position: 'bottom',
  },
  download: false,
  themeColor: '#0d6efd',
  theme: 'auto',
  autoPlay: false,
  muted: false,
  preload: 'metadata',
  speedOptions: [0.5, 0.75, 1, 1.25, 1.5],
  audio: null,
}

export const CONFIG = {
  fixedOptions: ['auto', 'static', 'fixed'],
  audioOptions: {
    title: 'Unknown Title',
    artist: 'Unknown Artist',
    duration: NaN,
    cover: null,
    chapters: [],
    src: null,
    album: '',
    live: false,
  },
}
