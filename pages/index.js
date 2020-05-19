import Shikwasa from '../src/main'
import Chapter from '../src/chapter'

const src = window.location.origin + '/assets/03-06-11_STS-133_FD11_Mission_Status_Briefing.mp3'

Shikwasa.use(Chapter)

window.shk = new Shikwasa({
  fixed: {
    type: 'auto',
  },
  themeColor: '#0b3d91',
  container: () => document.querySelector('.container'),
  audio: {
    // title: 'STS-133 FD11 Mission Status Briefing',
    // artist: 'NASA',
    cover: 'https://www.nasa.gov/sites/all/themes/custom/nasatwo/images/nasa-logo.svg',
    src,
  },
  parser: window.jsmediatags,
})
