'use strict';function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}var chapterTemplate =
"\n  <div class=\"shk-chapter_main\">\n    <ol class=\"shk-chapter_list\"></ol>\n  </div>\n  <button class=\"shk-btn shk-btn_close\" aria-label=\"close chapter panel\" title=\"close chapter panel\">\n    <svg class=\"shk-icon_close\" aria-hidden=\"true\">\n      <use xlink:href=\"#shk-icon_close\" />\n    </svg>\n  </button>\n";function secondToTime(time) {
  time = Math.round(time);
  var hour = Math.floor(time / 3600);
  var min = Math.floor((time - hour * 3600) / 60);
  var sec = Math.floor(time - hour * 3600 - min * 60);
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;
  if (hour === 0) {
    return "".concat(min, ":").concat(sec);
  }
  hour = hour < 10 ? '0' + hour : hour;
  return "".concat(hour, ":").concat(min, ":").concat(sec);
}
function marquee(textWrap, textEl) {
  var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  var overflow = textEl.offsetWidth - textWrap.offsetWidth;
  if (overflow > 0) {
    textWrap.setAttribute('data-overflow', '');
    var duration = textEl.offsetWidth / speed;
    textWrap.style.animationDuration = "".concat(duration, "s");
  } else {
    textWrap.removeAttribute('data-overflow');
  }
}
function createElement(options) {
  options.tag = options.tag || 'div';
  var el = document.createElement(options.tag);
  if (options.className) {
    if (typeof options.className === 'string') {
      el.classList.add(options.className);
    } else {
      options.className.forEach(className => {
        el.classList.add(className);
      });
    }
  }
  if (options.attrs) {
    Object.keys(options.attrs).forEach(key => {
      el.setAttribute(key, options.attrs[key]);
    });
  }
  if (options.innerHTML) {
    el.innerHTML = options.innerHTML;
  }
  return el;
}
function toggleAttribute(el, name) {
  if (typeof el.toggleAttribute === 'function') {
    el.toggleAttribute(name);
    return;
  }
  if (el.hasAttribute(name)) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, '');
  }
}
function animateScroll(timestamp, startTime, duration, startPos, distance, scrollEl) {
  var elapsed = (timestamp - startTime) / 1000;
  var t = elapsed / duration;
  scrollEl.scrollTop = startPos + distance * t;
  if (t < 1) {
    window.requestAnimationFrame(ts => {
      animateScroll(ts, startTime, duration, startPos, distance, scrollEl);
    });
  }
}var resize;
class Chapter {
  constructor(ctx) {
    this.ctx = ctx;
    this.list = [];
    this.initEvents();
    this.current = null;
    this._currentSrc = null;
    this._chapterPatched = false;
  }
  init() {
    this.patchPlayer();
    this.ui = new ChapterUI(this.ctx);
    this.ctx.on('chapterchange', data => {
      var id = data && data.newVal ? data.newVal.id : null;
      this.ui.setChapterActive(id);
    });
  }
  initEvents() {
    this.ctx.on('audioupdate', audio => {
      if (!this._chapterPatched) {
        this.init();
        this._chapterPatched = true;
      }
      this.updateList(audio);
    });
    this.ctx.on('audioparse', audio => {
      this.updateList(audio);
    });
    this.ctx.on('timeupdate', this.onTimeupdate.bind(this));
  }
  clearList() {
    this.ui.chapterList.innerHTML = '';
    this.list = [];
    this.current = null;
  }
  updateList(audio) {
    if (this.list.length) {
      this.clearList();
    }
    if (audio.chapters.length) {
      this.list = this.handleChapters(audio);
      this.ui.renderChapterList(this.ctx.chapters);
      this.clickChapterHandler();
    }
    this.ui.handleChapterPanel(this.ctx, audio);
  }
  handleChapters(audio) {
    if (audio.chapters && audio.chapters.length) {
      return audio.chapters.map((chap, i) => {
        if (!/^ch\d+$/.test(chap.id)) {
          chap.id = "ch".concat(i);
        }
        return chap;
      });
    }
  }
  patchPlayer() {
    var self = this;
    Object.defineProperties(this.ctx, {
      chapters: {
        get() {
          return self.list;
        }
      },
      currentChapter: {
        get() {
          return self.current;
        }
      }
    });
    this.ctx.events.playerEvents.push('chapterchange');
    this.ctx.updateChapter = updateChapter.bind(self);
    function updateChapter(index) {
      this.setCurrent(this.list[index]);
      this.ctx.seek(this.current.startTime);
      this.ctx.play();
    }
  }
  setCurrent(chapter) {
    var _oldCurrentChapter = this.current ? _objectSpread2({}, this.current) : null;
    this.current = chapter;
    this.ctx.events.trigger('chapterchange', {
      newVal: this.current,
      oldVal: _oldCurrentChapter
    });
  }
  onTimeupdate(e) {
    if (this._currentSrc !== e.currentTarget.src) {
      this._currentSrc = e.currentTarget.src;
      return;
    }
    var direction = this.searchDirection(this.ctx.currentTime, this.current);
    if (direction) {
      var searchPool;
      var index = this.list.indexOf(this.current);
      if (index === -1) {
        searchPool = this.list;
      } else {
        searchPool = direction === 1 ? this.list.slice(index) : this.list.slice(0, index + 1);
      }
      var currentChapter = searchPool.find(ch => {
        return !this.searchDirection(this.ctx.currentTime, ch);
      });
      this.setCurrent(currentChapter);
    }
  }
  searchDirection(time, chapter) {
    time = Math.round(time);
    if (!chapter || typeof chapter !== 'object' || chapter.endTime <= time) {
      return 1;
    }
    if (chapter.startTime > time) {
      return -1;
    }
    return 0;
  }
  clickChapterHandler() {
    Array.from(this.ui.chapterList.children).forEach(chEl => {
      chEl.addEventListener('click', () => {
        if (!this.ctx.seekable) return;
        var id = chEl.getAttribute('data-id').match(/\d+$/);
        if (id) {
          this.ctx.updateChapter(+id[0]);
        }
      });
    });
  }
  destroy() {
    this.ui.destroy();
  }
}
class ChapterUI {
  constructor(player, audio) {
    this.initEl(player);
    this.initEvents(player, audio);
    this.renderChapterList(player.chapters);
    player.ui.el.append(this.el);
    this.activeChapterEl = null;
  }
  initEl(player) {
    this.el = createElement({
      className: 'shk-chapter',
      innerHTML: chapterTemplate
    });
    var attrs = {
      title: 'view chapters',
      'aria-label': 'view chapters'
    };
    if (!player.seekable) {
      attrs.disabled = '';
    }
    this.chapterBtn = createElement({
      tag: 'button',
      className: ['shk-btn', 'shk-btn_chapter'],
      attrs,
      innerHTML:
      "\n        <svg aria-hidden=\"true\">\n          <use xlink:href=\"#shk-icon_chapter\" />\n        </svg>\n      "
    });
    player.ui.seekControls.push(this.chapterBtn);
    player.ui.extraControls.append(this.chapterBtn);
    this.closeBtn = this.el.querySelector('.shk-btn_close');
    this.chapterList = this.el.querySelector('.shk-chapter_list');
    this.overflowLayer = this.el.querySelector('.shk-chapter_main');
  }
  initEvents(player) {
    this.chapterBtn.addEventListener('click', () => {
      toggleAttribute(player.el, 'data-show-chapter');
    });
    player.ui.hideExtraControl(this.chapterBtn);
    this.closeBtn.addEventListener('click', () => {
      player.el.removeAttribute('data-show-chapter');
    });
    resize = () => {
      if (!this.activeChapterEl) return;
      var textWrap = this.activeChapterEl.querySelector('.shk-chapter_title_wrap');
      var text = this.activeChapterEl.querySelector('.shk-chapter_title');
      marquee.call(this, textWrap, text);
    };
    window.addEventListener('resize', resize);
  }
  handleChapterPanel(player, audio) {
    if (audio.chapters.length) {
      player.el.setAttribute('data-has-chapter', '');
    } else {
      player.el.removeAttribute('data-has-chapter');
    }
    if (!audio.chapters.length || !player.seekable) {
      player.el.removeAttribute('data-show-chapter');
    }
  }
  renderChapterList(chapters) {
    if (!chapters.length) return;
    chapters.forEach(ch => {
      var chapterItemEl = this.renderChapterItem(ch);
      this.chapterList.append(chapterItemEl);
    });
  }
  renderChapterItem(chapter) {
    var startTime = secondToTime(chapter.startTime);
    var innerHTML =
    "\n      <button class=\"shk-btn shk-chapter_btn\" title=\"seek chapter: ".concat(chapter.title, "\" aria-label=\"seek chapter: ").concat(chapter.title, "\">\n        <div class=\"shk-icon_chapter\" aria-hidden=\"true\">\n          <span class=\"shk-icon_playing\"></span>\n          <span class=\"shk-icon_triangle\">\n            <svg>\n              <use xlink:href=\"#shk-icon_triangle\" />\n            </svg>\n          </span>\n        </div>\n        <div class=\"shk-chapter_duration\">").concat(startTime, "</div>\n        <div class=\"shk-chapter_title_wrap\">\n          <div class=\"shk-chapter_title_inner\" data-chapter=\"").concat(chapter.title, "\">\n            <div class=\"shk-chapter_title\">").concat(chapter.title, "</div>\n          </div>\n        </div>\n      </button>\n    ");
    return createElement({
      tag: 'li',
      className: 'shk-chapter_item',
      innerHTML: innerHTML,
      attrs: {
        'data-id': chapter.id
      }
    });
  }
  setChapterActive(id) {
    this.chapterList.querySelectorAll('.shk-chapter_item').forEach(chEl => {
      if (chEl.getAttribute('data-id') === id) {
        chEl.setAttribute('data-active', '');
        this.scrollIntoView(chEl);
        this.activeChapterEl = chEl;
        var titleEl = chEl.querySelector('.shk-chapter_title');
        var titleWrap = chEl.querySelector('.shk-chapter_title_wrap');
        marquee(titleWrap, titleEl);
      } else {
        chEl.removeAttribute('data-active');
      }
    });
  }
  scrollIntoView(el) {
    if (this.el.style.visibility === 'hidden') return;
    var layerMargin = window.getComputedStyle(this.overflowLayer).marginTop;
    var listMargin = window.getComputedStyle(this.chapterList).marginTop;
    var offsetTop = parseInt(layerMargin) + parseInt(listMargin);
    var outOfView = this.overflowLayer.scrollTop + offsetTop - el.offsetTop > 0 || el.offsetTop - this.overflowLayer.scrollTop - this.overflowLayer.offsetHeight > 0;
    var startPos = this.overflowLayer.scrollTop;
    var distance = el.offsetTop - startPos - offsetTop;
    var startTime = performance.now();
    var duration = 0.2;
    if (outOfView) {
      animateScroll(startTime, startTime, duration, startPos, distance, this.overflowLayer);
    }
  }
  destroy() {
    window.removeEventListener('resize', resize);
  }
}
Chapter._name = 'chapter';module.exports=Chapter;