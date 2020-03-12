/**
 * this should be an independent script outside of src, and should be built seperately.
 * Usage: pass a Shikwasa instance into this chapter constructor,
 * then do modification in chapter constructor to that instance, e.g. making use of shikwasa.audio.
 * activate it with a class function, Player.use() in player.js
 */
import chapterTemplate from './templates/chapterTemplate'
import { createElement } from './utils'


class Chapter {
  constructor(player, options) {
    // don't need to be this. if user provide chapter info, just use it
    if (options.jsmediatags) {
      this.readChapters(options.jsmediatags)
    } else {
      throw new Error('You need to either import a library to decode audio chapter information, or pass in chapter info. See docs https://github.com/jessuni/shikwasa')
    }
    this.audio = player.audio
    this.initUI(player.template)
    // add li
    this.initEvents(player)

  }

  initUI(template) {
    this.el = createElement({
      className: 'shk-chapter',
      innerHTML: chapterTemplate,
    })
    this.triggerEl = createElement({
      tag: 'button',
      className: ['shk-btn', 'shk-btn_chapter'],
      attrs: {
        title: 'chapters',
        'aria-label': 'view chapters',
      },
      innerHTML: /* html */`
        <svg aria-hidden="true">
          <use xlink:href="#shk-icon_chapter" />
        </svg>
      `,
    })
    template.extraControls.append(this.triggerEl)
    template.chapterBtn = this.triggerEl
  }

  initEvents(player) {
    this.triggerEl.addEventListener('click', () => {
      player.el.classList.toggle('Chapters')
    })
  }

  readChapters(jsmediatags) {
  }
}

export default Chapter
