import LinearWave from './linearwave'
import CircleWave from './circlewave'
import DotWave from './dotwave'
// import jsmediatags from 'jsmediatags-web'
import { secondToTime } from '../src/utils'
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let file, player
const input1 = document.getElementById('input1')

function initAudio(input) {
  const container = document.createElement('div')
  document.body.append(container)
  input.onchange = (e) => {
    file = e.target.files[0]
    // should call URL.revokeObjectURL() on audio destruction to release URL
    const audioSrc = URL.createObjectURL(file)
    const fetchAudio = new Promise((resolve, reject) => {
      fetch(audioSrc).then((resp) => {
        if (resp.status === 200) {
          resolve(resp.blob())
        }
        // unfinished
        reject()
      })
    })

    // read id3
    fetchAudio.then((blob) => {
      return new Promise((resolve, reject) => {
        jsmediatags.read(blob, {
          onSuccess: resolve,
          onError: reject,
        })
      })
    }).then((tag) => {
      const picture = tag.tags.picture
      if (picture) {
        const bytes = new Uint8Array(picture.data)
        const blob = new Blob([bytes.buffer], { type: picture.format })
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve({ tag: tag.tags, src: reader.result })
          }
        })
      }
      return { tag: tag.tags }
    }).then(({ tag = {}, src = '' }) => {
      // for multiple audio display
      player = new Shikwasa({
        container: container,
        themeColor: '#50C54C',
        audio: {
          title: tag.title,
          artist: tag.artist,
          cover: src,
          src: audioSrc,
        }
      })
      let chapters
      if (tag && tag.CHAP) {
        chapters = tag.CHAP.filter(chap => chap.id === 'CHAP')
          .map(chap => {
            if (chap.data && chap.data.subFrames && chap.data.subFrames.TIT2) {
              return {
                id: chap.data.id,
                startTime: chap.data.startTime,
                endTime: chap.data.endTime,
                title: chap.data.subFrames.TIT2.data
              }
            }
            return false
          })
          .sort((a, b) => (a.id - b.id))
        const wrapper = document.createElement('div')
        wrapper.classList.add('chapters')
        document.body.append(wrapper)
        document.body.append()
        chapters.forEach(chap => {
          const el = document.createElement('div')
          const title = document.createElement('span')
          const duration = document.createElement('span')
          el.classList.add('chapter-item')
          title.classList.add('chapter_title')
          duration.classList.add('chapter_duration')
          title.innerHTML = chap.title
          duration.innerHTML = secondToTime((chap.endTime - chap.startTime) / 1000)
          el.append(title)
          el.append(duration)
          document.querySelector('.chapters').append(el)
          el.addEventListener('click', () => {
            player.seek(chap.startTime / 1000)
          })
        })
      }
    }).then(() => {
      var source = audioCtx.createMediaElementSource(player.audio)
      var analyser = audioCtx.createAnalyser()
      // should disconnect on completed with
      // source.disconnect()
      // source = null
      source.connect(analyser)
      analyser.connect(audioCtx.destination)
      var bufferLength = analyser.frequencyBinCount
      var dataArray = new Uint8Array(bufferLength)

      var canvas = document.createElement('canvas')
      var canvas2 = document.createElement('canvas')

      const linearWave = new LinearWave({
        canvas: canvas,
        analyser: analyser,
        data: dataArray,
        width: document.body.getBoundingClientRect().width,
        height: 200,
      })
      //linearWave.draw()

      const circlewave = new CircleWave({
        canvas: canvas2,
        analyser,
        data: dataArray,
      })
      //circlewave.draw()

      const dotwave = new DotWave({
        canvas,
        analyser,
        data: dataArray,
      })
      dotwave.draw()
      document.body.append(canvas)
      document.body.append(canvas2)

    }).catch((e) => {
      console.log(e)
    })
  }
}

initAudio(input1)
