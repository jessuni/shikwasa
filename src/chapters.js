import chapterTemplate from './templates/chapterTemplate'
import { createElement, secondToTime } from './utils'

let _oldCurrentTime = 0

class Chapter {
  constructor(ctx, options) {
    this.player = ctx
    this.options = options
    this.list = []
    this.current = null
  }

  async afterCanplay() {
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
    if (this.current === null) {
      this.setCurrent(this.list[0])
    }
    if (this.beyondRange(this.player.currentTime, this.current)) {
      const index = this.list.indexOf(this.current)
      if (index === -1) {
        console.error('Shikwasa: could not find the current chapter.')
      } else {
        const searchPool = this.player.currentTime > _oldCurrentTime ?
            this.list.slice(index) :
            this.list.slice(0, index + 1)
        const currentChapter = searchPool.find(ch => {
          return !this.beyondRange(this.player.currentTime, ch)
        })
        this.setCurrent(currentChapter)

        _oldCurrentTime = this.player.currentTime
      }
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

  beyondRange(time, chapter) {
    if (chapter.startTime > time) {
      return -1
    }
    if (chapter.endTime <= time) {
      return 1
    }
    return 0
  }

  parseChapters(info) {
    if (info && info.tags && info.tags.CHAP.length) {
      console.log(info.tags)
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
}

class ChapterUI {
  constructor(player) {
    this.initEl(player)
    this.initEvents(player)
    this.renderChapterList(player.chapters)
    player.ui.el.append(this.el)
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
      <button class="shk-btn shk-btn_chapter">
        <span class="shk-icon_chapter" aria-hidden="true">
          <span class="shk-icon_playing"></span>
          <span class="shk-icon_triangle">
            <svg>
              <use xlink:href="#shk-icon_triangle" />
            </svg>
          </span>
        </span>
        <span class="shk-chapter_duration">${startTime}</span>
        <span class="shk-chapter_title">${chapter.title}</span>
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
        } else {
          chEl.classList.remove('Active')
        }
      })
  }
}

export default Chapter
