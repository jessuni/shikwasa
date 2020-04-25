const CONFIG = {
  container: 'body',
  reader: null,
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
  audioTitle: 'Unknown Title',
  audioArtist: 'Unknown Artist',
  audioDuration: NaN,
  audioCover: null,
  audioChapters: [],
  fixedOptions: ['auto', 'static', 'fixed'],
}

export default CONFIG
