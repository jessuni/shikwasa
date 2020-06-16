import './css/chapter.css'
import chapterTemplate from './templates/Chapter'
import { createElement, secondToTime, marquee, toggleAttribute, animateScroll } from './utils'

let resize

class Chapter {
  constructor(ctx) {
    this.ctx = ctx
    this.list = []
    this.initEvents()
    this.current = null
    this._currentSrc = null
    this._chapterPatched = false
  }

  init() {
    this.patchPlayer()
    this.ui = new ChapterUI(this.ctx)
    this.ctx.on('chapterchange', (data) => {
      const id = data && data.newVal ? data.newVal.id : null
      this.ui.setChapterActive(id)
    })
  }

  initEvents() {
    this.ctx.on('audioupdate',(audio) => {
      if (!this._chapterPatched) {
        this.init()
        this._chapterPatched = true
      }
      this.updateList(audio)
    })

    this.ctx.on('audioparse', (audio) => {
      this.updateList(audio)
    })
    this.ctx.on('timeupdate', this.onTimeupdate.bind(this))
  }

  clearList() {
    this.ui.chapterList.innerHTML = ''
    this.list = []
    this.current = null
  }

  updateList(audio) {
    if (this.list.length) {
      this.clearList()
    }
    if (audio.chapters.length) {
      this.list = this.handleChapters(audio)
      this.ui.renderChapterList(this.ctx.chapters)
      this.clickChapterHandler()
    }
    this.ui.handleChapterPanel(this.ctx, audio)
  }

  handleChapters(audio) {
    if (audio.chapters && audio.chapters.length) {
      return audio.chapters.map((chap, i) => {
        if (!/^ch\d+$/.test(chap.id)) {
          chap.id = `ch${i}`
        }
      return chap
      })
    }
  }

  patchPlayer() {
    const self = this
    Object.defineProperties(this.ctx, {
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
    this.ctx.events.playerEvents.push('chapterchange')
    this.ctx.updateChapter = updateChapter.bind(self)

    function updateChapter(index) {
      this.setCurrent(this.list[index])
      this.ctx.seek(this.current.startTime)
      this.ctx.play()
    }
  }

  setCurrent(chapter) {
    const _oldCurrentChapter = this.current ? { ...this.current } : null
    this.current = chapter
    this.ctx.events.trigger('chapterchange', {
      newVal: this.current,
      oldVal: _oldCurrentChapter,
    })
  }

  onTimeupdate(e) {

    // ignore handling when audio src changes
    if (this._currentSrc !== e.currentTarget.src) {
      this._currentSrc = e.currentTarget.src
      return
    }
    const direction = this.searchDirection(this.ctx.currentTime, this.current)
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
        return !this.searchDirection(this.ctx.currentTime, ch)
      })
      this.setCurrent(currentChapter)
    }
  }

  searchDirection(time, chapter) {
    time = Math.round(time)
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

  clickChapterHandler() {
    Array.from(this.ui.chapterList.children).forEach(chEl => {
      chEl.addEventListener('click', () => {
        if (!this.ctx.seekable) return
        let id = chEl.getAttribute('data-id').match(/\d+$/)
        if (id) {
          this.ctx.updateChapter(+id[0])
        }
      })
    })
  }

  destroy() {
    this.ui.destroy()
  }
}

class ChapterUI {
  constructor(player, audio) {
    this.initEl(player)
    this.initEvents(player, audio)
    this.renderChapterList(player.chapters)
    player.ui.el.append(this.el)
    this.activeChapterEl = null
  }

  initEl(player) {
    this.el = createElement({
      className: 'shk-chapter',
      innerHTML: chapterTemplate,
    })
    const attrs = {
      title: 'view chapters',
      'aria-label': 'view chapters',
    }
    if (!player.seekable) {
      attrs.disabled = ''
    }
    this.chapterBtn = createElement({
      tag: 'button',
      className: ['shk-btn', 'shk-btn_chapter'],
      attrs,
      innerHTML: /* html */`
        <svg aria-hidden="true">
          <use xlink:href="#shk-icon_chapter" />
        </svg>
      `,
    })
    player.ui.seekControls.push(this.chapterBtn)
    player.ui.extraControls.append(this.chapterBtn)
    this.closeBtn = this.el.querySelector('.shk-btn_close')
    this.chapterList = this.el.querySelector('.shk-chapter_list')
    this.overflowLayer = this.el.querySelector('.shk-chapter_main')
  }

  initEvents(player) {
    this.chapterBtn.addEventListener('click', () => {
      toggleAttribute(player.el, 'data-show-chapter')
    })
    player.ui.hideExtraControl(this.chapterBtn)
    this.closeBtn.addEventListener('click', () => {
      player.el.removeAttribute('data-show-chapter')
    })

    // this.handleChapterPanel(player, audio)
    resize = () => {
      if (!this.activeChapterEl) return
      const textWrap = this.activeChapterEl.querySelector('.shk-chapter_title_wrap')
      const text = this.activeChapterEl.querySelector('.shk-chapter_title')
      marquee.call(this, textWrap, text)
    }
    window.addEventListener('resize', resize)
  }

  handleChapterPanel(player, audio) {
    if (audio.chapters.length) {
      player.el.setAttribute('data-has-chapter', '')
    } else {
      player.el.removeAttribute('data-has-chapter')
    }
    if (!audio.chapters.length || !player.seekable) {
      player.el.removeAttribute('data-show-chapter')
    }
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
      <button class="shk-btn shk-chapter_btn" title="seek chapter: ${chapter.title}" aria-label="seek chapter: ${chapter.title}">
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
          chEl.setAttribute('data-active', '')
          this.scrollIntoView(chEl)
          this.activeChapterEl = chEl
          const titleEl = chEl.querySelector('.shk-chapter_title')
          const titleWrap = chEl.querySelector('.shk-chapter_title_wrap')
          marquee(titleWrap, titleEl)
        } else {
          chEl.removeAttribute('data-active')
        }
      })
  }

  scrollIntoView(el) {
    if (this.el.style.visibility === 'hidden') return
    const layerMargin = window.getComputedStyle(this.overflowLayer).marginTop
    const listMargin = window.getComputedStyle(this.chapterList).marginTop
    const offsetTop = parseInt(layerMargin) + parseInt(listMargin)
    const outOfView = (this.overflowLayer.scrollTop + offsetTop - el.offsetTop > 0) || (el.offsetTop - this.overflowLayer.scrollTop - this.overflowLayer.offsetHeight > 0)
    const startPos = this.overflowLayer.scrollTop
    const distance = el.offsetTop - startPos - offsetTop
    const startTime = performance.now()
    const duration = 0.2
    if (outOfView) {
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

  destroy() {
    window.removeEventListener('resize', resize)
  }
}

Chapter._name = 'chapter'

export default Chapter

