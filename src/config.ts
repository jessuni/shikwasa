import { Options, IAudio } from './types'

export const CONFIG_AUDIO: IAudio = {
  title: 'Unknown Title',
  artist: 'Unknown Artist',
  duration: undefined,
  cover: '',
  chapters: [],
  src: '',
}

export const CONFIG: Options = {
  container: document.querySelector('body') as HTMLElement,
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
  speedOptions: [0.5, 0.75, 1, 1.25, 1.5],
  audio: CONFIG_AUDIO
}


