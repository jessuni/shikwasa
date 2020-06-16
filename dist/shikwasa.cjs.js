'use strict';function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}var PlayerTemplate =
"\n  <div class=\"shk-player\">\n    <div class=\"shk-bar_wrap\">\n      <div class=\"shk-bar\" aria-label=\"progress bar\">\n        <div class=\"shk-bar_loaded\"\n          role=\"progressbar\"\n          aria-label=\"loaded progress\"\n          aria-valuenow=\"0\"\n          aria-valuemin=\"0\"\n          aria-valuemax=\"1\"></div>\n        <div class=\"shk-bar_played\"\n          role=\"progressbar\"\n          aria-label=\"played progress\"\n          aria-valuenow=\"0\"\n          aria-valuemin=\"0\"\n          aria-valuemax=\"1\">\n          <button class=\"shk-bar-handle\"\n            role=\"slider\"\n            aria-label=\"seek progress\"\n            aria-valuenow=\"0\"\n            aria-valuemin=\"0\"\n            aria-orientation=\"horizontal\"\n            aria-valuemax=\"1\"></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"shk-body\">\n      <div class=\"shk-cover\">\n        <div class=\"shk-img\"></div>\n      </div>\n      <div class=\"shk-main\">\n        <div class=\"shk-text\">\n          <div class=\"shk-artist_wrap\">\n            <span class=\"shk-artist\"></span>\n          </div>\n          <div class=\"shk-title_wrap\">\n            <div class=\"shk-title_inner\">\n              <span class=\"shk-title\"></span>\n            </div>\n          </div>\n        </div>\n        <div class=\"shk-controls\">\n          <div class=\"shk-controls_basic\">\n            <button class=\"shk-btn shk-btn_speed\"\n              aria-label=\"toggle playback rate\"\n              title=\"change playback rate\"\n              aria-live=\"polite\">1.0x</button>\n            <button class=\"shk-btn shk-btn_backward\"\n              aria-label=\"rewind 10 seconds\"\n              title=\"rewind 10 seconds\">\n              <svg aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_backward\" />\n              </svg>\n            </button>\n            <button class=\"shk-btn shk-btn_toggle\" aria-label=\"toggle play and pause\">\n              <svg class=\"shk-btn_play\" aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_play\" />\n              </svg>\n              <svg class=\"shk-btn_pause\" aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_pause\" />\n              </svg>\n            </button>\n            <button class=\"shk-btn shk-btn_forward\" aria-label=\"forward 10 seconds\" title=\"forward 10 seconds\">\n              <svg aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_forward\" />\n              </svg>\n            </button>\n            <button class=\"shk-btn shk-btn_more\" aria-label=\"more controls\" title=\"more controls\">\n              <svg aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_more\" />\n              </svg>\n            </button>\n          </div>\n          <div class=\"shk-controls_extra\">\n            <button class=\"shk-btn shk-btn_volume\" aria-label=\"toggle volume\" title=\"volume\">\n              <svg class=\"shk-btn_unmute\" aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_unmute\" />\n              </svg>\n              <svg class=\"shk-btn_mute\" aria-hidden=\"true\">\n                <use xlink:href=\"#shk-icon_mute\" />\n              </svg>\n            </button>\n          </div>\n        </div>\n        <div class=\"shk-display\">\n          <span class=\"shk-loader\" aria-live=\"polite\">\n            <span class=\"shk-visuallyhidden\" tabindex=\"-1\">loading</span>\n            <svg aria-hidden=\"true\" aria-label=\"loading\" aria-live=\"polite\" viewbox=\"0 0 66 66\">\n              <circle cx=\"33\" cy=\"33\" r=\"30\" fill=\"transparent\" stroke=\"url(#shk-gradient)\" stroke-dasharray=\"170\"\n                stroke-dashoffset=\"20\" stroke-width=\"6\" />\n              <lineargradient id=\"shk-gradient\">\n                <stop offset=\"50%\" stop-color=\"currentColor\" />\n                <stop offset=\"65%\" stop-color=\"currentColor\" stop-opacity=\".5\" />\n                <stop offset=\"100%\" stop-color=\"currentColor\" stop-opacity=\"0\" />\n              </lineargradient>\n            </svg>\n          </span>\n          <span class=\"shk-time\">\n            <span class=\"shk-time_now\">00:00</span><span class=\"shk-time_duration\">00:00</span>\n          </span>\n        </div>\n      </div>\n    </div>\n  </div>\n";var IconTemplate =
"\n  <svg class=\"shk-icons\" xmlns=\"http://www.w3.org/2000/svg\">\n    <symbol id=\"shk-icon_play\" viewbox=\"0 0 64 64\">\n      <path\n        d=\"M32 0a32 32 0 1 1 0 64 32 32 0 0 1 0-64zm-9 17.8c-1 0-1.7.6-1.7 1.4v25.6c0 .8.8 1.4 1.7 1.4 0 0 25-12 26.2-13.1 1-1 .3-1.9.1-2.1z\" />\n    </symbol>\n\n    <symbol id=\"shk-icon_pause\" viewbox=\"0 0 64 64\">\n      <path fill-rule=\"nonzero\"\n        d=\"M32 0a32 32 0 1 0 0 64 32 32 0 0 0 0-64zm-4 40a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V24c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v16zm16 0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V24c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v16z\" />\n    </symbol>\n\n    <symbol id=\"shk-icon_download\" viewbox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\">\n      <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3\" />\n    </symbol>\n\n    <symbol id=\"shk-icon_forward\" viewbox=\"0 0 128 139\">\n      <path\n        d=\"M64 11v14h-.8A50 50 0 1 0 114 75h14a64 64 0 1 1-64-64zm16.9 35c6.6 0 11.8 2.7 15.6 8.3a38 38 0 0 1 5.3 21.4c0 9-1.8 16-5.3 21.3-3.8 5.6-9 8.4-15.6 8.4-6.7 0-12-2.8-15.6-8.4A38 38 0 0 1 60 75.7c0-9 1.8-16.1 5.3-21.4C69 48.7 74.2 46 80.9 46zm-32.5 1v57.1H39V58.3a32.3 32.3 0 0 1-13 7V56a34 34 0 0 0 15.4-9h7zm32.5 7c-4.6 0-7.8 2.4-9.6 7.5-1.3 3.5-2 8.2-2 14.2 0 5.9.7 10.6 2 14.1 1.8 5 5 7.6 9.6 7.6 4.5 0 7.7-2.5 9.6-7.6 1.3-3.5 1.9-8.2 1.9-14.1 0-6-.6-10.7-2-14.2-1.8-5.1-5-7.6-9.5-7.6zM64 0l48 19-48 19V0z\" />\n    </symbol>\n\n    <symbol id=\"shk-icon_backward\" viewbox=\"0 0 128 139\">\n      <path\n        d=\"M64 0v11A64 64 0 1 1 0 75h14a50 50 0 1 0 50-50v13L16 19 64 0zm17 45.8c6.6 0 11.8 2.7 15.6 8.3a38 38 0 0 1 5.3 21.3c0 9-1.8 16.1-5.3 21.4a18 18 0 0 1-15.6 8.3c-6.7 0-12-2.8-15.6-8.3a38 38 0 0 1-5.3-21.4c0-9 1.8-16 5.3-21.3 3.7-5.6 8.9-8.3 15.6-8.3zm-32.4 1V104h-9.4V58.2a32.3 32.3 0 0 1-13 7v-9.4a34 34 0 0 0 15.4-9h7zm32.4 7c-4.6 0-7.8 2.5-9.6 7.6-1.3 3.4-2 8.1-2 14.1s.7 10.7 2 14.2c1.8 5 5 7.6 9.6 7.6 4.5 0 7.7-2.6 9.6-7.6 1.3-3.5 2-8.2 2-14.2s-.7-10.7-2-14.1c-2-5.1-5.1-7.6-9.6-7.6z\" />\n    </symbol>\n\n    <symbol id=\"shk-icon_more\" viewbox=\"0 0 64 64\">\n      <path\n        d=\"M8 24a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm48 0a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm-24 0a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm0 0\" />\n    </symbol>\n\n    <symbol id=\"shk-icon_chapter\" viewbox=\"0 0 64 64\">\n      <path d=\"M60.8 55.3H18.1a3.2 3.2 0 1 1 0-6.4h42.8a3.2 3.2 0 0 1 3.1 4.9c-.7 1-1.9 1.6-3.1 1.5zm0-20.2H18.1a3.2 3.2 0 1 1 0-6.4h42.8a3.2 3.2 0 1 1 0 6.4zm0-20H18.1a3.2 3.2 0 1 1 0-6.3h42.8a3.2 3.2 0 0 1 0 6.3zM8.5 12.3a4.2 4.2 0 1 1-8.5 0 4.2 4.2 0 0 1 8.5 0zm0 19.8A4.2 4.2 0 1 1 0 32a4.2 4.2 0 0 1 8.5 0zm0 19.8a4.3 4.3 0 1 1-8.5 0 4.3 4.3 0 0 1 8.5 0zm0 0\"/>\n    </symbol>\n\n    <symbol id=\"shk-icon_unmute\" viewBox=\"0 0 64 66\">\n      <path d=\"M34.3 0c1.5.1 2.6 1.4 2.9 2.8v60.3c-.3 1.4-1.4 2.7-3 2.8-.7.1-1.6-.1-2.6-.7L13.7 50H4.2a4 4 0 0 1-4.1-4V20.6c0-2.2 1.8-4 4-4.1h9.6c.7-.8 17.2-15.1 17.9-15.8 1-.6 1.9-.8 2.6-.7zm6.4 9.3a2 2 0 0 1 2.4-1.6 25.8 25.8 0 0 1 0 50.5l-.4.1a2 2 0 1 1-.4-4.1 21.7 21.7 0 0 0 0-42.5 2 2 0 0 1-1.6-2.4zm4.7 12.8a12.1 12.1 0 0 1 0 21.8 2 2 0 0 1-2.8-1c-.5-1-.1-2.2 1-2.8a8 8 0 0 0 0-14.4 2 2 0 0 1-1-2.7 2 2 0 0 1 2.8-.9zm0 0\"/>\n    </symbol>\n\n    <symbol id=\"shk-icon_mute\" viewBox=\"0 0 64 64\">\n      <path d=\"M33.2 0c-.8 0-1.6.1-2.6.7l-17.4 15H4a4 4 0 0 0-4 4v24.1a4 4 0 0 0 4 4h9.2l17.4 14.5c1 .6 1.8.8 2.6.7 1.4-.1 2.5-1.4 2.8-2.6V2.7C35.7 1.4 34.6 0 33.2 0zm23.2 31.5l6.9-6.8c.7-.6 1-1.5.7-2.4-.2-.8-.9-1.5-1.8-1.7-.8-.2-1.8 0-2.4.7L53 28.1 46 21.3c-.6-.6-1.5-1-2.4-.7-.9.2-1.5.9-1.8 1.7-.2.9.1 1.8.8 2.4l6.9 6.8-7 6.8c-.8 1-.8 2.4.2 3.3.9 1 2.4 1 3.3.1l7-6.8 6.8 6.8c1 .9 2.5.8 3.4 0 1-1 1-2.4 0-3.4l-6.8-6.8zm0 0\"/>\n    </symbol>\n\n    <symbol id=\"shk-icon_triangle\" viewbox=\"0 0 64 64\"><path d=\"M59 29.2L7.8.4A3.2 3.2 0 003 3.2v57.6a3.2 3.2 0 004.8 2.8L59 34.8a3.2 3.2 0 000-5.6z\" /></symbol>\n    <symbol id=\"shk-icon_chart\" viewbox=\"0 0 64 64\"><g transform=\"matrix(1 0 0 -1 0 64)\"><rect x=\"10\" width=\"8\" height=\"54.1\" rx=\"3\"><animate attributeName=\"height\" begin=\"0s\" dur=\"2s\" values=\"64;55;33;5;60;23;58;33;12;14;52;64\" calcMode=\"linear\" repeatCount=\"indefinite\"/></rect><rect x=\"26\" width=\"8\" height=\"32.8\" rx=\"3\"><animate attributeName=\"height\" begin=\"0s\" dur=\"2s\" values=\"50;34;64;23;56;23;34;4;64;54;21;50\" calcMode=\"linear\" repeatCount=\"indefinite\"/></rect><rect x=\"42\" width=\"8\" height=\"42.6\" rx=\"3\"><animate attributeName=\"height\" begin=\"0s\" dur=\"2s\" values=\"30;45;13;64;56;24;45;64;34;23;64;30\" calcMode=\"linear\" repeatCount=\"indefinite\"/></rect></g></symbol>\n    <symbol id=\"shk-icon_close\" viewbox=\"0 0 16 16\"><path d=\"M3.207 14.207a1 1 0 1 1-1.414-1.414l11-11a1 1 0 0 1 1.414 1.414zm11-1.414a1 1 0 0 1-1.414 1.414l-11-11a1 1 0 0 1 1.414-1.414z\"></path></symbol>\n  </svg>\n";
var DEFAULT = {
  container: () => document.querySelector('body'),
  parser: null,
  fixed: {
    type: 'auto',
    position: 'bottom'
  },
  download: false,
  themeColor: '#00869B',
  theme: 'auto',
  autoPlay: false,
  muted: false,
  preload: 'metadata',
  speedOptions: [0.5, 0.75, 1, 1.25, 1.5],
  audio: null
};
var CONFIG = {
  fixedOptions: ['auto', 'static', 'fixed'],
  audioOptions: {
    title: 'Unknown Title',
    artist: 'Unknown Artist',
    duration: NaN,
    cover: null,
    chapters: [],
    src: null
  }
};function secondToTime(time) {
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
function numToString(num) {
  var float = parseFloat(num).toFixed(2);
  return float.slice(-1) === '0' ? float.slice(0, -1) : float;
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
function handleOptions(options) {
  var _options = Object.assign({}, options);
  _options.audio = Object.assign({}, options.audio);
  Object.keys(DEFAULT).forEach(k => {
    _options[k] = _options[k] || typeof _options[k] === 'boolean' ? _options[k] : DEFAULT[k];
  });
  if (typeof _options.container === 'function') {
    _options.container = _options.container();
  }
  var fixedType = CONFIG.fixedOptions.find(item => item === _options.fixed.type);
  if (!fixedType) {
    _options.fixed.type = DEFAULT.fixed.type;
  }
  if (!Array.isArray(_options.speedOptions)) {
    _options.speedOptions = [_options.speedOptions];
  }
  if (_options.speedOptions.indexOf(1) === -1) {
    _options.speedOptions.push(1);
  }
  _options.speedOptions = _options.speedOptions.map(sp => parseFloat(sp)).filter(sp => !isNaN(sp));
  if (_options.speedOptions.length > 1) {
    _options.speedOptions.sort((a, b) => a - b);
  }
  return _options;
}
function handleAudio() {
  var audio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var parsedData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var audioData = Object.assign({}, audio);
  Object.keys(CONFIG.audioOptions).forEach(k => {
    audioData[k] = audioData[k] || parsedData[k] || CONFIG.audioOptions[k];
  });
  return audioData;
}
function parseAudio() {
  return _parseAudio.apply(this, arguments);
}
function _parseAudio() {
  _parseAudio = _asyncToGenerator(function* () {
    var audio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var parser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      tags
    } = (yield parserWrap(audio.src, parser)) || {};
    var tagData = handleParsedTags(tags);
    return handleAudio(audio, tagData);
  });
  return _parseAudio.apply(this, arguments);
}
function parserWrap(src, parser) {
  return new Promise((resolve, reject) => {
    parser.read(src, {
      onSuccess: resolve,
      onError: reject
    });
  });
}
function handleParsedTags() {
  var tags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cover, chapters, duration;
  var {
    title,
    artist
  } = tags;
  if (tags.picture && tags.picture.data && tags.picture.format) {
    var byteArray = new Uint8Array(tags.picture.data);
    var blob = new Blob([byteArray], {
      type: tags.picture.format
    });
    cover = URL.createObjectURL(blob);
  }
  if (tags.TLEN && tags.TLEN.data) {
    duration = +tags.TLEN.data / 1000;
  }
  if (tags.CHAP && tags.CHAP.length) {
    chapters = tags.CHAP.filter(ch => ch.id === 'CHAP').map(ch => {
      if (ch.data && ch.data.subFrames && ch.data.subFrames.TIT2) {
        return {
          id: ch.data.id,
          startTime: ch.data.startTime / 1000,
          endTime: ch.data.endTime / 1000,
          title: ch.data.subFrames.TIT2.data
        };
      }
      return false;
    }).sort((a, b) => a.id - b.id);
  }
  return {
    title,
    artist,
    cover,
    duration,
    chapters
  };
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
}function applyFocusVisiblePolyfill(parent, supportsPassive) {
  var hadKeyboardEvent = true;
  var hadFocusVisibleRecently = false;
  var hadFocusVisibleRecentlyTimeout = null;
  function isValidFocusTarget(el) {
    if (el && el !== document && el.nodeName !== 'HTML' && el.nodeName !== 'BODY' && 'classList' in el && 'contains' in el.classList) {
      return true;
    }
    return false;
  }
  function addFocusVisibleClass(el) {
    if (el.classList.contains('focus-visible')) {
      return;
    }
    el.classList.add('focus-visible');
    el.setAttribute('data-focus-visible-added', '');
  }
  function removeFocusVisibleClass(el) {
    if (!el.hasAttribute('data-focus-visible-added')) {
      return;
    }
    el.classList.remove('focus-visible');
    el.removeAttribute('data-focus-visible-added');
  }
  function onKeyDown(e) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }
    if (isValidFocusTarget(document.activeElement) && parent.contains(document.activeElement)) {
      addFocusVisibleClass(document.activeElement);
    }
    hadKeyboardEvent = true;
  }
  function onPointerDown() {
    hadKeyboardEvent = false;
  }
  function onFocus(e) {
    if (!isValidFocusTarget(e.target)) {
      return;
    }
    if (hadKeyboardEvent) {
      addFocusVisibleClass(e.target);
    }
  }
  function onBlur(e) {
    if (!isValidFocusTarget(e.target)) {
      return;
    }
    if (e.target.classList.contains('focus-visible') || e.target.hasAttribute('data-focus-visible-added')) {
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(function () {
        hadFocusVisibleRecently = false;
      }, 100);
      removeFocusVisibleClass(e.target);
    }
  }
  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      if (hadFocusVisibleRecently) {
        hadKeyboardEvent = true;
      }
      addInitialPointerMoveListeners();
    }
  }
  function addInitialPointerMoveListeners() {
    parent.addEventListener('mousemove', onInitialPointerMove);
    parent.addEventListener('mousedown', onInitialPointerMove);
    parent.addEventListener('mouseup', onInitialPointerMove);
    parent.addEventListener('pointermove', onInitialPointerMove);
    parent.addEventListener('pointerdown', onInitialPointerMove);
    parent.addEventListener('pointerup', onInitialPointerMove);
    parent.addEventListener('touchmove', onInitialPointerMove, supportsPassive ? {
      passive: true
    } : false);
    parent.addEventListener('touchstart', onInitialPointerMove, supportsPassive ? {
      passive: true
    } : false);
    parent.addEventListener('touchend', onInitialPointerMove, supportsPassive ? {
      passive: true
    } : false);
  }
  function removeInitialPointerMoveListeners(el) {
    parent.removeEventListener('mousemove', onInitialPointerMove);
    parent.removeEventListener('mousedown', onInitialPointerMove);
    parent.removeEventListener('mouseup', onInitialPointerMove);
    parent.removeEventListener('pointermove', el);
    parent.removeEventListener('pointerdown', onInitialPointerMove);
    parent.removeEventListener('pointerup', onInitialPointerMove);
    parent.removeEventListener('touchmove', onInitialPointerMove, supportsPassive ? {
      passive: true
    } : false);
    parent.removeEventListener('touchstart', onInitialPointerMove, supportsPassive ? {
      passive: true
    } : false);
    parent.removeEventListener('touchend', onInitialPointerMove, supportsPassive ? {
      passive: true
    } : false);
  }
  function onInitialPointerMove() {
    hadKeyboardEvent = false;
    removeInitialPointerMoveListeners();
  }
  parent.addEventListener('keydown', onKeyDown, true);
  parent.addEventListener('mousedown', onPointerDown, true);
  parent.addEventListener('pointerdown', onPointerDown, true);
  parent.addEventListener('touchstart', onPointerDown, supportsPassive ? {
    passive: true,
    capture: true
  } : true);
  parent.addEventListener('visibilitychange', onVisibilityChange, true);
  addInitialPointerMoveListeners();
  parent.addEventListener('focus', onFocus, true);
  parent.addEventListener('blur', onBlur, true);
  parent.classList.add('js-focus-visible');
}var resize,
    coverUrl = null,
    cooldown = true;
class UI {
  constructor(options) {
    this.mounted = false;
    if (!document.querySelector('.shk-icons')) {
      this.icons = createElement({
        className: 'shk-icons',
        innerHTML: IconTemplate
      });
    }
    this.initEl();
    this.initOptions(options);
  }
  initEl() {
    var _this = this;
    return _asyncToGenerator(function* () {
      _this.el = createElement({
        className: ['shk', 'shikwasa'],
        attrs: {
          'data-name': 'shikwasa'
        },
        innerHTML: PlayerTemplate
      });
      _this.playBtn = _this.el.querySelector('.shk-btn_toggle');
      _this.fwdBtn = _this.el.querySelector('.shk-btn_forward');
      _this.bwdBtn = _this.el.querySelector('.shk-btn_backward');
      _this.speedBtn = _this.el.querySelector('.shk-btn_speed');
      _this.moreBtn = _this.el.querySelector('.shk-btn_more');
      _this.muteBtn = _this.el.querySelector('.shk-btn_volume');
      _this.extraControls = _this.el.querySelector('.shk-controls_extra');
      _this.texts = _this.el.querySelector('.shk-text');
      _this.artist = _this.el.querySelector('.shk-artist');
      _this.artistWrap = _this.el.querySelector('.shk-artist_wrap');
      _this.titleWrap = _this.el.querySelector('.shk-title_wrap');
      _this.titleInner = _this.el.querySelector('.shk-title_inner');
      _this.title = _this.el.querySelector('.shk-title');
      _this.currentTime = _this.el.querySelector('.shk-time_now');
      _this.duration = _this.el.querySelector('.shk-time_duration');
      _this.bar = _this.el.querySelector('.shk-bar');
      _this.barWrap = _this.el.querySelector('.shk-bar_wrap');
      _this.audioPlayed = _this.el.querySelector('.shk-bar_played');
      _this.audioLoaded = _this.el.querySelector('.shk-bar_loaded');
      _this.handle = _this.el.querySelector('.shk-bar-handle');
      _this.cover = _this.el.querySelector('.shk-cover');
      _this.seekControls = [_this.fwdBtn, _this.bwdBtn, _this.handle];
    })();
  }
  initOptions(options) {
    this.el.style = "--color-primary: ".concat(options.themeColor);
    this.el.setAttribute('data-theme', options.theme);
    if (options.download && options.audio && options.audio.src) {
      this.downloadBtn = createElement({
        tag: 'a',
        className: ['shk-btn', 'shk-btn_download'],
        attrs: {
          title: 'download',
          'aria-label': 'download',
          href: typeof options.download === 'string' ? options.download : options.audio.src,
          download: '',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        innerHTML:
        "\n          <svg aria-hidden=\"true\">\n            <use xlink:href=\"#shk-icon_download\" />\n          </svg>\n        "
      });
      this.extraControls.append(this.downloadBtn);
    }
    this.el.setAttribute('data-fixed-type', options.fixed.type);
    if (options.fixed.type !== 'static' && options.fixed.position === 'top') {
      this.el.setAttribute('data-fixed-pos', options.fixed.position);
    }
    var playStatus = options.autoPlay ? 'playing' : 'paused';
    this.el.setAttribute('data-play', playStatus);
    if (options.muted) {
      this.el.setAttribute('data-mute', '');
    }
  }
  initEvents(supportsPassive) {
    this.moreBtn.addEventListener('click', () => {
      toggleAttribute(this.el, 'data-extra');
    });
    Array.from(this.extraControls.children).forEach(el => {
      this.hideExtraControl(el);
    });
    applyFocusVisiblePolyfill(this.el, supportsPassive);
    resize = () => {
      if (!cooldown) return;
      cooldown = false;
      setTimeout(() => cooldown = true, 100);
      marquee.call(this, this.titleWrap, this.title);
    };
    window.addEventListener('resize', resize);
  }
  setAudioInfo() {
    var audio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl);
      coverUrl = null;
    }
    if (/blob/.test(audio.cover)) {
      coverUrl = audio.cover;
    }
    if (audio.cover) {
      this.cover.style.backgroundImage = "url(".concat(audio.cover, ")");
    } else {
      this.cover.style.backgroundImage = 'none';
    }
    this.title.innerHTML = audio.title;
    this.titleInner.setAttribute('data-title', audio.title);
    this.artist.innerHTML = audio.artist;
    if (audio.duration) {
      this.duration.innerHTML = secondToTime(audio.duration);
    }
    if (this.downloadBtn) {
      this.downloadBtn.href = audio.src;
    }
    this.setBar('loaded', 0);
  }
  setPlaying() {
    this.el.setAttribute('data-play', 'playing');
  }
  setPaused() {
    this.el.setAttribute('data-play', 'paused');
    this.el.removeAttribute('data-loading');
  }
  setTime(type, time) {
    this[type].innerHTML = secondToTime(time);
  }
  setBar(type, percentage) {
    var typeName = 'audio' + type.charAt(0).toUpperCase() + type.substr(1);
    percentage = Math.min(percentage, 1);
    percentage = Math.max(percentage, 0);
    this[typeName].style.width = percentage * 100 + '%';
    var ariaNow = percentage.toFixed(2);
    this[typeName].setAttribute('aria-valuenow', ariaNow);
    this.handle.setAttribute('aria-valuenow', ariaNow);
  }
  setProgress() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var percentage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    if (time && !percentage) {
      percentage = duration ? time / duration : 0;
    } else {
      time = percentage * (duration || 0);
    }
    this.setTime('currentTime', time);
    this.setBar('played', percentage);
  }
  setSpeed(speed) {
    this.speedBtn.innerHTML = numToString(speed) + 'x';
  }
  getPercentByPos(e) {
    var handlePos = e.clientX || e.changedTouches && e.changedTouches[0].clientX || 0;
    var initPos = this.barWrap.getBoundingClientRect().left;
    var barLength = this.barWrap.clientWidth;
    var percentage = (handlePos - initPos) / barLength;
    percentage = Math.min(percentage, 1);
    percentage = Math.max(0, percentage);
    return percentage;
  }
  hideExtraControl(el) {
    el.addEventListener('click', () => {
      setTimeout(() => {
        this.el.removeAttribute('data-extra');
      }, 800);
    });
  }
  mount(container, supportsPassive) {
    container.innerHTML = '';
    container.append(this.el);
    if (this.icons) {
      container.append(this.icons);
    }
    this.mounted = true;
    this.initEvents(supportsPassive);
    marquee(this.titleWrap, this.title);
  }
  destroy() {
    window.removeEventListener('resize', resize);
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl);
    }
  }
}class Events {
  constructor() {
    this.audioEvents = ['abort', 'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
    this.playerEvents = ['audioupdate', 'audioparse'];
    this.events = {};
  }
  on(name, callback) {
    if (this.type(name) && typeof callback == 'function') {
      if (!this.events[name]) {
        this.events[name] = [];
      }
      this.events[name].push(callback);
    }
  }
  trigger(name) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (this.events[name] && this.events[name].length) {
      this.events[name].forEach(fn => fn(data));
    }
  }
  type(name) {
    if (this.playerEvents.indexOf(name) !== -1) {
      return 'player';
    } else if (this.audioEvents.indexOf(name) !== -1) {
      return 'audio';
    }
    console.error("Shikwasa: unknown event name: ".concat(name));
    return null;
  }
}var playerArr = [];
var REGISTERED_COMPS = [];
var isMobile = typeof window !== 'undefined' ? /mobile/i.test(window.navigator.userAgent) : false;
var dragStart = isMobile ? 'touchstart' : 'mousedown';
var dragMove = isMobile ? 'touchmove' : 'mousemove';
var dragEnd = isMobile ? 'touchend' : 'mouseup';
var supportsPassive = false;
if (typeof window !== 'undefined') {
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
        return false;
      }
    });
    window.addEventListener('testPassvie', null, opts);
    window.removeEventListener('testPassvie', null, opts);
  } catch (e) {
    supportsPassive = false;
  }
}
var addPassive = supportsPassive && isMobile;
class Player {
  constructor(options) {
    this.id = playerArr.length;
    playerArr.push(this);
    this.comps = {};
    this._audio = {};
    this._hasMediaSession = false;
    this._initSeek = 0;
    this._canplay = false;
    this._dragging = false;
    this.events = new Events();
    this.options = handleOptions(options);
    this.renderComponents();
    this.initUI(this.options);
    this.initAudio();
    this.ui.mount(this.options.container, supportsPassive);
  }
  get duration() {
    if (!this.audio || !this.audio.duration) {
      return this._audio.duration;
    }
    return this.audio.duration;
  }
  get seekable() {
    return Boolean(this.duration);
  }
  set seekable(v) {
    if (v) {
      this.ui.seekControls.forEach(el => {
        el.removeAttribute('disabled');
      });
    } else {
      this.ui.seekControls.forEach(el => {
        el.setAttribute('disabled', '');
      });
    }
  }
  get currentTime() {
    return this.audio ? this.audio.currentTime : undefined;
  }
  get playbackRate() {
    return this.audio ? this.audio.playbackRate : undefined;
  }
  set playbackRate(v) {
    if (this.audio) {
      this.audio.playbackRate = v;
      this.audio.defaultPlaybackRate = v;
    }
  }
  get muted() {
    return this.audio ? this.audio.muted : undefined;
  }
  set muted(v) {
    if (this.audio) {
      this.audio.muted = v;
      this.audio.defaultMuted = v;
    }
  }
  initUI() {
    this.ui = new UI(this.options);
    this.el = this.ui.el;
    this.initControlEvents();
    this.initBarEvents();
  }
  initControlEvents() {
    this.ui.playBtn.addEventListener('click', () => {
      this.toggle();
    });
    this.ui.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted;
      toggleAttribute(this.el, 'data-mute');
    });
    this.ui.fwdBtn.addEventListener('click', () => {
      this.seekBySpan();
    });
    this.ui.bwdBtn.addEventListener('click', () => {
      this.seekBySpan({
        forward: false
      });
    });
    this.ui.speedBtn.addEventListener('click', () => {
      var index = this.options.speedOptions.indexOf(this.playbackRate);
      var speedRange = this.options.speedOptions;
      this.playbackRate = index + 1 >= speedRange.length ? speedRange[0] : speedRange[index + 1];
      this.ui.setSpeed(this.playbackRate);
    });
  }
  initBarEvents() {
    var targetTime = 0;
    var dragStartHandler = e => {
      if (!this.seekable) return;
      e.preventDefault();
      this.el.setAttribute('data-seeking', '');
      this._dragging = true;
      document.addEventListener(dragMove, dragMoveHandler, addPassive ? {
        passive: true
      } : false);
      document.addEventListener(dragEnd, dragEndHandler);
    };
    var dragMoveHandler = e => {
      this.ui.setProgress(null, this.ui.getPercentByPos(e), this.duration);
    };
    var dragEndHandler = e => {
      e.preventDefault();
      document.removeEventListener(dragMove, dragMoveHandler);
      document.removeEventListener(dragEnd, dragEndHandler);
      targetTime = this.ui.getPercentByPos(e) * this.duration;
      this.seek(targetTime);
      this._dragging = false;
      setTimeout(() => this.el.removeAttribute('data-seeking'), 50);
    };
    var keydownHandler = e => {
      if (!this.seekable) return;
      var key = e.key.replace('Arrow', '');
      var backwardKeys = ['Left', 'Down'];
      var forwardKeys = ['Right', 'Up'];
      var largeStepKeys = ['PageDown', 'PageUp'];
      var edgeKeys = ['Home', 'End'];
      var isBack = backwardKeys.indexOf(key) !== -1;
      var isFwd = forwardKeys.indexOf(key) !== -1;
      var isWayBack = key === largeStepKeys[0];
      var isWayFwd = key === largeStepKeys[1];
      var isStart = key === edgeKeys[0];
      var isEnd = key === edgeKeys[1];
      if (!isBack && !isFwd && largeStepKeys.indexOf(key) === -1 && edgeKeys.indexOf(key) === -1) {
        return;
      }
      if (isStart) {
        this.seek(0);
        return;
      }
      if (isEnd) {
        this.seek(this.duration);
        return;
      }
      var step = (isWayFwd || isWayBack ? 0.1 : 0.01) * (isFwd || isWayFwd ? 1 : -1);
      var currentTime = this._canplay ? this.currentTime : this._initSeek;
      var time = step * this.duration + currentTime;
      this.seek(time);
    };
    this.ui.barWrap.addEventListener(dragStart, dragStartHandler);
    this.ui.handle.addEventListener('keydown', keydownHandler);
  }
  initAudio() {
    if (this.options.audio.src) {
      this.audio = new Audio();
      this.initAudioEvents();
      this.events.audioEvents.forEach(name => {
        this.audio.addEventListener(name, e => {
          this.events.trigger(name, e);
        });
      });
      this.audio.preload = this.options.preload;
      this.muted = this.options.muted;
      this.update(this.options.audio);
    }
  }
  initAudioEvents() {
    this.on('play', () => {
      this.ui.setPlaying();
      playerArr.forEach(player => {
        if (player.id !== this.id && player.audio && !player.audio.paused) {
          player.pause();
        }
      });
    });
    this.on('pause', () => {
      this.ui.setPaused();
    });
    this.on('ended', () => {
      this.ui.setPaused();
      this.seek(0);
    });
    this.on('waiting', () => {
      this.el.setAttribute('data-loading', '');
    });
    this.on('durationchange', () => {
      if (this.duration && this.duration !== 1) {
        this.seekable = true;
        this.ui.setTime('duration', this.duration);
      }
    });
    this.on('canplay', () => {
      if (!this._canplay) {
        this._canplay = true;
        if (this._initSeek) {
          this.seek(this._initSeek);
          this._initSeek = 0;
        }
      }
    });
    this.on('canplaythrough', () => {
      this.el.removeAttribute('data-loading');
    });
    this.on('progress', () => {
      if (this.audio.buffered.length) {
        var percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0;
        this.ui.setBar('loaded', percentage);
      }
    });
    this.on('timeupdate', () => {
      if (!this._dragging) {
        this.ui.setProgress(this.audio.currentTime, null, this.duration);
      }
    });
    this.on('abort', () => {
      this.ui.setPaused();
    });
  }
  initMediaSession() {
    var self = this;
    if ('mediaSession' in navigator) {
      this._hasMediaSession = true;
      this.setMediaMetadata(this.options.audio);
      var controls = {
        play: this.play.bind(self),
        pause: this.pause.bind(self),
        seekforward: this.seekBySpan.bind(self),
        seekbackward: () => this.seekBySpan({
          forward: false
        }).bind(self)
      };
      Object.keys(controls).forEach(key => {
        navigator.mediaSession.setActionHandler(key, () => {
          controls[key]();
        });
      });
    }
  }
  setMediaMetadata(audio) {
    var artwork = audio.cover ? [{
      src: audio.cover
    }] : undefined;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: audio.title,
      artist: audio.artist,
      artwork
    });
  }
  on(name, callback) {
    this.events.on(name, callback);
  }
  play() {
    if (!this.audio.paused) return;
    var promise = this.audio.play();
    if (promise instanceof Promise) {
      promise.then(() => {
        this.initMediaSession();
      });
      promise.catch(e => {
        if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
          this.pause();
        }
      });
    } else {
      this.initMediaSession();
    }
  }
  pause() {
    if (this.audio.paused) return;
    this.audio.pause();
  }
  toggle() {
    this.audio.paused ? this.play() : this.pause();
  }
  seek(time) {
    if (!this.seekable) return;
    time = parseInt(time);
    if (isNaN(time)) {
      console.error('Shikwasa: seeking time is NaN');
    }
    time = Math.min(time, this.duration);
    time = Math.max(time, 0);
    this.ui.setProgress(time, null, this.duration);
    if (!this._canplay) {
      this._initSeek = time;
    } else {
      this.audio.currentTime = time;
    }
  }
  seekBySpan() {
    var {
      time = 10,
      forward = true
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var currentTime = this._canplay ? this.audio.currentTime : this._initSeek;
    var targetTime = currentTime + time * (forward ? 1 : -1);
    this.seek(targetTime);
  }
  update(audio) {
    if (audio && audio.src) {
      this._audio = handleAudio(audio);
      this._canplay = false;
      this.audio.src = this._audio.src;
      this.updateAudioData(this._audio);
      this.events.trigger('audioupdate', this._audio);
      if (this.options.parser && (!audio.title || !audio.artist || !audio.cover || !audio.chapters)) {
        parseAudio(Object.assign({}, audio), this.options.parser).then(audioData => {
          this._audio = audioData || this._audio;
          this.updateAudioData(this._audio);
          this.events.trigger('audioparse', this._audio);
        });
      }
    } else {
      throw new Error('Shikwasa: audio source is not specified');
    }
  }
  updateAudioData(audio) {
    this.audio.title = audio.title;
    this.ui.setAudioInfo(audio);
    this.seekable = audio.duration;
    if (this._hasMediaSession) {
      this.setMediaMetadata(audio);
    }
  }
  destroyAudio() {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
    this.audio = null;
  }
  destroy() {
    this.destroyAudio();
    this.ui.destroy();
    Object.keys(this.comps).forEach(k => {
      if (this.comps[k].destroy && typeof this.comps[k].destroy === 'function') {
        this.comps[k].destroy();
      }
    });
    this.comps = null;
    this.options.container.innerHTML = '';
  }
  renderComponents() {
    if (!REGISTERED_COMPS.length) return;
    REGISTERED_COMPS.forEach(comp => {
      this.comps[comp._name] = new comp(this);
    });
  }
}
Player.use = function (comp) {
  REGISTERED_COMPS.push(comp);
};console.log("%c\uD83C\uDF4A%c Shikwasa Podcast Player v2.0.0 %c https://shikwasa.js.org", 'background-color:#00869B40;padding:4px;', 'background:#00869B80;color:#fff;padding:4px 0', 'padding: 2px 0;');
module.exports=Player;