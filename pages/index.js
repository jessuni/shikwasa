import Shikwasa from '../dist/shikwasa.cjs'
import Chapter from '../dist/shikwasa.chapter.cjs'
import '../dist/shikwasa.min.css'
import '../dist/shikwasa.chapter.min.css'

const src = window.location.origin + '/assets/03-06-11_STS-133_FD11_Mission_Status_Briefing.mp3'

Shikwasa.use(Chapter)

window.shk = new Shikwasa({
  fixed: {
    type: 'auto',
  },
  themeColor: '#0b3d91',
  container: () => document.querySelector('.container'),
  audio: {
    cover: 'https://www.nasa.gov/sites/all/themes/custom/nasatwo/images/nasa-logo.svg',
    src,
  },
  parser: window.jsmediatags,
})
