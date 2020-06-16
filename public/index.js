const baseUrl = `${window.location.origin}/assets`
// const baseUrl = './assets'
let demoPlayer
let throttled = false
let autoShowChapter = true
const chapterTitle = document.querySelector('#chapters')
const keyboardTitle = document.querySelector('#keyboard-control')
const clickChapter = document.querySelector('.demo-chapter')
const themeButtons = document.querySelectorAll('.demo-theme')
const themeColorButtons = document.querySelectorAll('.demo-theme-color')

const audio = {
  title: 'STS-133 FD11 Mission Status Briefing',
  artist: 'NASA',
  src: `${baseUrl}/STS-133_FD11_Mission_Status_Briefing.mp3`,
  cover: 'https://www.nasa.gov/sites/all/themes/custom/nasatwo/images/nasa-logo.svg',
}

const audioWithChapter = Object.assign(audio, {
  chapters: [
    {
      'id': 'chp0',
      'startTime': 0,
      'endTime': 16,
      'title': 'Introduction',
    },
    {
      'id': 'chp1',
      'startTime': 16,
      'endTime': 285,
      'title': 'Mission Status Briefing by Bryan Lunney',
    },
    {
      'id': 'chp2',
      'startTime': 285,
      'endTime': 348,
      'title': 'Elaboration on the Shuttle\'s Status',
    },
    {
      'id': 'chp3',
      'startTime': 348,
      'endTime': 444,
      'title': 'Explaining the Crew\'s Schedule',
    },
    {
      'id': 'chp4',
      'startTime': 444,
      'endTime': 503,
      'title': 'What the Atmosphere Is Like at ISS and Discovery',
    },
    {
      'id': 'chp5',
      'startTime': 503,
      'endTime': 556,
      'title': 'Explaining Cryo Margins',
    },
    {
      'id': 'chp6',
      'startTime': 556,
      'endTime': 637,
      'title': 'Final Q&A',
    },
    {
      'id': 'chp7',
      'startTime': 637,
      'endTime': 666,
      'title': 'Wrap Up',
    },
  ],
})

new window.Shikwasa({
  audio,
  themeColor: '#022188',
  theme: 'light',
  container: document.querySelector('.hero-player'),
  preload: 'metadata',
  fixed: {
    type: 'static',
  },
})

window.Shikwasa.use(window.Chapter)
demoPlayer = new window.Shikwasa({
  audio: audioWithChapter,
  themeColor: '#396ada',
  theme: 'auto',
  container: document.querySelector('.demo-player'),
  preload: 'metadata',
  fixed: {
    type: 'static',
  },
})

window.onload = () => {
  if (demoPlayer) {
    seekTime(demoPlayer)
  }
}

window.onhashchange = () => {
  if (demoPlayer) {
    seekTime(demoPlayer)
  }
}

window.onscroll = () => {
  if (throttled) return
  throttled = true
  setTimeout(() => {
    throttled = false
  }, 100)
  focus()
  if (window.innerWidth > 1000) {
    showChapter()
  }
}

if (clickChapter) {
  clickChapter.addEventListener('click', clickToRandomChapter)
}

demoPlayer.comps.chapter.ui.closeBtn.addEventListener('click', () => {
  autoShowChapter = false
})

for (let i = 0; i < themeButtons.length; i++) {
  const theme = themeButtons[i].getAttribute('data-value')
  themeButtons[i].addEventListener('click', (e) => {
    switchTheme(theme)
    for (let j = 0; j < themeButtons.length; j++) {
      e.currentTarget === themeButtons[j] ?
        themeButtons[j].classList.add('Active') :
        themeButtons[j].classList.remove('Active')
    }
  })
}

for (let i = 0; i < themeColorButtons.length; i++) {
  const color = themeColorButtons[i].getAttribute('data-color')
  themeColorButtons[i].addEventListener('click', () => {
    switchColor(color)
  })
}

function seekTime(shk) {
  const hms = window.location.hash.match(/#t=(\d?\d)?:?(\d\d):(\d\d)/)
  if (!hms) return
  const time = parseInt(hms[1] || 0 * 3600) + parseInt(hms[2] * 60) + parseInt(hms[3])
  shk.seek(time)
}

function isInViewport(el, offset) {
  const bounding = el.getBoundingClientRect()
  return bounding.top + offset > 0 && bounding.bottom < document.documentElement.clientHeight
}

function showChapter() {
  if (demoPlayer &&
    demoPlayer.el.hasAttribute('data-has-chapter') &&
    demoPlayer.el.getAttribute('data-show-chapter') === null &&
    isInViewport(chapterTitle, 300) &&
    autoShowChapter
    ) {
      demoPlayer.el.setAttribute('data-show-chapter', '')
    }
}

function clickToRandomChapter() {
  if (demoPlayer &&
    demoPlayer.chapters &&
    demoPlayer.chapters.length) {
    let id = 0
    if (demoPlayer.currentChapter) {
      id = +demoPlayer.currentChapter.id.slice(2)
    }
    let chapId = id
    while (chapId === id) {
      chapId = Math.round((demoPlayer.chapters.length -1) * Math.random())
    }
    demoPlayer.updateChapter(chapId)
  }
}

function focus() {
  if (isInViewport(keyboardTitle, 200) && demoPlayer) {
    const handle = demoPlayer.ui.handle
    if (handle) {
      handle.focus()
    }
  }
}

function switchTheme(theme) {
  if (demoPlayer) {
    demoPlayer.el.setAttribute('data-theme', theme)
  }
}

function switchColor(color) {
  if (demoPlayer) {
    demoPlayer.el.style = `--color-primary: rgb(${color})`
  }
}




