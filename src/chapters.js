import chapterTemplate from './templates/Chapter'
import { createElement, secondToTime, marquee } from './utils'

let resize

class Chapter {
  constructor(ctx, options) {
    this.player = ctx
    this.options = options
    this.list = []
    this.current = null
  }

  async inited() {
    this.audio = this.player.audio
    if (!this.options.jsmediatags) {
      console.error('Shikwasa: could not find audio reader.')
    } else {
      const info = await this.readTags(this.audio, this.options.jsmediatags)
      this.list = this.parseChapters(info)
      if (this.list.length) {
        this.patchPlayer()
        this.ui = new ChapterUI(this.player)
        this.player.on('timeupdate', this.onTimechange.bind(this))
        this.eventClickChapter()
      }
    }
  }

  patchPlayer() {
    const self = this
    Object.defineProperties(this.player, {
      chapters: {
        get() {
          return self.list
        },
      },
      currentChapter: {
        get() {
          return self.current
        },
      },
    })
    this.player.events.playerEvents.push('chapterchange')
    this.player.updateChapter = updateChapter.bind(self)

    function updateChapter(index) {
      this.setCurrent(this.list[index])
      this.player.seek(this.current.startTime)
      this.player.play()
    }
  }

  setCurrent(chapter) {
    const _oldCurrentChapter = this.current ? { ...this.current } : null
    this.current = chapter
    this.player.events.trigger('chapterchange', {
      newVal: this.current,
      oldVal: _oldCurrentChapter,
    })
  }

  onTimechange() {
    const direction = this.searchDirection(this.player.currentTime, this.current)
    if (direction) {
      let searchPool
      const index = this.list.indexOf(this.current)
      if (index === -1) {
        searchPool = this.list
      } else {
        searchPool = direction === 1 ?
          this.list.slice(index) :
          this.list.slice(0, index + 1)
      }
      const currentChapter = searchPool.find(ch => {
        return !this.searchDirection(this.player.currentTime, ch)
      })
      this.setCurrent(currentChapter)
    }
  }

  readTags(audio, jsmediatags) {
    return new Promise((resolve, reject) => {
      jsmediatags.read(audio.src, {
        onSuccess: resolve,
        onError: reject,
      })
    })
  }

  searchDirection(time, chapter) {
    if (!chapter ||
      typeof chapter !== 'object' ||
      chapter.endTime <= time) {
      return 1
    }
    if (chapter.startTime > time) {
      return -1
    }
    return 0
  }

  parseChapters(info) {
    if (info && info.tags && info.tags.CHAP.length) {
      return info.tags.CHAP
        .filter(ch => ch.id === 'CHAP')
        .map(ch => {
          if (ch.data && ch.data.subFrames && ch.data.subFrames.TIT2) {
            return {
              id: ch.data.id,
              startTime: ch.data.startTime / 1000,
              endTime: ch.data.endTime / 1000,
              title: ch.data.subFrames.TIT2.data,
            }
          }
          return false
        })
        .sort((a, b) => a.id - b.id)
    }
    return []
  }

  eventClickChapter() {
    Array.from(this.ui.chapterList.children).forEach(chEl => {
      chEl.addEventListener('click', () => {
        let id = chEl.getAttribute('data-id').match(/\d+$/)
        if (id) {
          this.player.updateChapter(+id[0])
        }
      })
    })
  }

  destroy() {
    this.ui.destroy()
  }
}

class ChapterUI {
  constructor(player) {
    this.initEl(player)
    this.initEvents(player)
    this.renderChapterList(player.chapters)
    player.ui.el.append(this.el)
    this.activeChapterEl = null
  }

  initEl(player) {
    this.el = createElement({
      className: 'shk-chapter',
      innerHTML: chapterTemplate,
    })
    this.chapterBtn = createElement({
      tag: 'button',
      className: ['shk-btn', 'shk-btn_chapter'],
      attrs: {
        title: 'view chapters',
        'aria-label': 'view chapters',
      },
      innerHTML: /* html */`
        <svg aria-hidden="true">
          <use xlink:href="#shk-icon_chapter" />
        </svg>
      `,
    })
    player.ui.extraControls.append(this.chapterBtn)
    this.closeBtn = this.el.querySelector('.shk-btn_close')
    this.chapterList = this.el.querySelector('.shk-chapter_list')
    this.overflowLayer = this.el.querySelector('.shk-chapter_main')
  }

  initEvents(player) {
    this.chapterBtn.addEventListener('click', () => {
      player.el.classList.toggle('show-chapter')
    })
    this.closeBtn.addEventListener('click', () => {
      player.el.classList.remove('show-chapter')
    })
    player.on('chapterchange', (data) => {
      const id = data && data.newVal ? data.newVal.id : null
      this.setChapterActive(id)
    })

    resize = () => {
      if (!this.activeChapterEl) return
      const textWrap = this.activeChapterEl.querySelector('.shk-chapter_title_wrap')
      const text = this.activeChapterEl.querySelector('.shk-chapter_title')
      marquee.call(this, textWrap, text)
    }
    window.addEventListener('resize', resize)
  }

  renderChapterList(chapters) {
    if (!chapters.length) return
    chapters.forEach(ch => {
      const chapterItemEl = this.renderChapterItem(ch)
      this.chapterList.append(chapterItemEl)
    })
  }

  renderChapterItem(chapter) {
    const startTime = secondToTime(chapter.startTime)
    const innerHTML = /* html */`
      <button class="shk-btn shk-btn_chapter" title="seek chapter: ${chapter.title}" aria-label="seek chapter: ${chapter.title}">
        <div class="shk-icon_chapter" aria-hidden="true">
          <span class="shk-icon_playing"></span>
          <span class="shk-icon_triangle">
            <svg>
              <use xlink:href="#shk-icon_triangle" />
            </svg>
          </span>
        </div>
        <div class="shk-chapter_duration">${startTime}</div>
        <div class="shk-chapter_title_wrap">
          <div class="shk-chapter_title_inner" data-chapter="${chapter.title}">
            <div class="shk-chapter_title">${chapter.title}</div>
          </div>
        </div>
      </button>
    `
    return createElement({
      tag: 'li',
      className: 'shk-chapter_item',
      innerHTML: innerHTML,
      attrs: { 'data-id': chapter.id },
    })
  }

  setChapterActive(id) {
    this.chapterList.querySelectorAll('.shk-chapter_item')
      .forEach(chEl => {
        if (chEl.getAttribute('data-id') === id) {
          chEl.classList.add('Active')
          this.scrollIntoView(chEl)
          this.activeChapterEl = chEl
          const titleEl = chEl.querySelector('.shk-chapter_title')
          const titleWrap = chEl.querySelector('.shk-chapter_title_wrap')
          marquee(titleWrap, titleEl)
        } else {
          chEl.classList.remove('Active')
        }
      })
  }

  scrollIntoView(el) {
    const layerMargin = window.getComputedStyle(this.overflowLayer).marginTop
    const listMargin = window.getComputedStyle(this.chapterList).marginTop
    const offsetTop = parseInt(layerMargin) + parseInt(listMargin)
    const outOfView = (this.overflowLayer.scrollTop + offsetTop - el.offsetTop > 0) || (el.offsetTop - this.overflowLayer.scrollTop - this.overflowLayer.offsetHeight > 0)
    const startPos = this.overflowLayer.scrollTop
    const distance = el.offsetTop - startPos - offsetTop
    const startTime = performance.now()
    const duration = 0.2
    if (outOfView) {
      // if supported use native css scroll behavior, otherwise simulate it
      if ('scrollBehavior' in document.documentElement.style) {
        el.scrollIntoView()
      } else {
        animateScroll(
          startTime,
          startTime,
          duration,
          startPos,
          distance,
          this.overflowLayer
        )
      }
    }
  }

  destroy() {
    window.removeEventListener('resize', resize)
  }
}

export default Chapter

function animateScroll(
  timestamp,
  startTime,
  duration,
  startPos,
  distance,
  scrollEl) {
  const elapsed = (timestamp - startTime) / 1000
  const t = elapsed / duration
  // easing in a linear fashion
  console.log(startPos + distance * t)
  scrollEl.scrollTop = startPos + distance * t
  if (t < 1) {
    window.requestAnimationFrame(ts => {
      animateScroll(ts, startTime, duration, startPos, distance, scrollEl)
    })
  }
}

