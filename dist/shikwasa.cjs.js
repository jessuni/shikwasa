'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var playerTemplate = "<div class=\"shk_cover\"> <div class=\"shk_img\"> </div> <button class=\"shk_btn shk_btn_toggle\" aria-label=\"toggle play and pause\"> <svg class=\"shk_btn_play\" aria-hidden=\"true\"> <use xlink:href=\"#shk_icon_play\"/> </svg> <svg class=\"shk_btn_pause\" aria-hidden=\"true\" viewbox=\"0 0 82 82\"> <g fill=\"#FFFFFF\" stroke-width=\"1\" fill-rule=\"evenodd\" transform=\"translate(1.000000, 1.000000)\"> <rect id=\"shk_path_rectangle\" x=\"28\" y=\"20\" width=\"6\" height=\"40\"></rect> <use xlink:href=\"#shk_path_rectangle\" x=\"18\"/> <circle stroke=\"#FFFFFF\" stroke-width=\"2\" fill-opacity=\"0.3\" fill-rule=\"nonzero\" cx=\"40\" cy=\"40\" r=\"40\"></circle> </g> </svg> </button> </div> <div class=\"shk_main\"> <div class=\"shk_text\"> <div> <span class=\"shk_subtitle\"></span> </div> <div> <span class=\"shk_title\"></span> </div> </div> <div class=\"shk_controls\"> <a class=\"shk_btn shk_btn_download\" aria-label=\"download audio\" title=\"download audio\" target=\"_blank\" download> <svg aria-label=\"download audio\"> <use xlink:href=\"#shk_icon_download\"/> </svg> </a> <button class=\"shk_btn shk_btn_backward\" aria-label=\"rewind 10 seconds\" title=\"rewind 10 seconds\"> <svg aria-hidden=\"true\"> <use xlink:href=\"#shk_icon_backward\"/> </svg> </button> <button class=\"shk_btn shk_btn_forward\" aria-label=\"forward 10 seconds\" title=\"forward 10 seconds\"> <svg aria-hidden=\"true\"> <use xlink:href=\"#shk_icon_forward\"/> </svg> </button> <button class=\"shk_btn shk_btn_speed\" aria-label=\"toggle playback rate\" title=\"change playback rate\" aria-live=\"polite\">1.0x</button> <button class=\"shk_btn shk_btn_volume\" aria-label=\"toggle volume\" title=\"toggle volume\"> <svg class=\"shk_btn_unmute\" aria-hidden=\"true\"> <use xlink:href=\"#shk_icon_unmute\"/> </svg> <svg class=\"shk_btn_mute\" aria-hidden=\"true\"> <use xlink:href=\"#shk_icon_mute\"/> </svg> </button> </div> <div class=\"shk_bar-wrap\"> <div class=\"shk_bar\" aria-label=\"progress bar\"> <div class=\"shk_bar_played\" aria-label=\"played progress\"> <span class=\"bar-handle\" aria-label=\"progress bar handle\"></span> </div> <div class=\"shk_bar_loaded\" aria-label=\"loaded progress\"></div> </div> </div> <div class=\"shk_bottom\"> <span class=\"shk_loader\" aria-live=\"polite\"> <span class=\"shk_visuallyhidden\" tabindex=\"-1\">loading</span> <svg aria-hidden=\"true\" aria-label=\"loading\" aria-live=\"polite\" viewbox=\"0 0 66 66\"> <circle cx=\"33\" cy=\"33\" r=\"30\" fill=\"transparent\" stroke=\"url(#shk_gradient)\" stroke-dasharray=\"170\" stroke-dashoffset=\"20\" stroke-width=\"6\"/> <lineargradient id=\"shk_gradient\"> <stop offset=\"50%\" stop-color=\"currentColor\"/> <stop offset=\"65%\" stop-color=\"currentColor\" stop-opacity=\".5\"/> <stop offset=\"100%\" stop-color=\"currentColor\" stop-opacity=\"0\"/> </lineargradient> </svg> </span> <span class=\"shk_time\"> <span class=\"shk_time_now\">--:--</span><span class=\"shk_time_duration\">--:--</span> </span> </div> </div> ";

var iconTemplate = "<svg class=\"shk_icons\" xmlns=\"http://www.w3.org/2000/svg\"> <symbol id=\"shk_icon_play\" viewbox=\"0 0 82 82\"> <g fill=\"none\" fill-rule=\"evenodd\"> <circle stroke=\"#FFF\" stroke-width=\"2\" fill-opacity=\".3\" fill=\"#FFF\" cx=\"41\" cy=\"41\" r=\"40\"/> <path d=\"M27.8 57c-1 0-1.8-.8-1.8-1.6V27.6c0-.9.8-1.6 1.8-1.6l28.6 14.3s1.3 1.2 0 2.4-28.6 14.2-28.6 14.2z\" fill=\"#FBF9F9\"/> </g> </symbol> <symbol id=\"shk_icon_pause\" viewbox=\"0 0 82 82\"> <g fill=\"#FFFFFF\" stroke-width=\"1\" fill-rule=\"evenodd\" transform=\"translate(1.000000, 1.000000)\"> <rect id=\"shk_path_rectangle\" x=\"28\" y=\"20\" width=\"6\" height=\"40\"></rect> <use xlink:href=\"#shk_path_rectangle\" x=\"18\"></use> <circle stroke=\"#FFFFFF\" stroke-width=\"2\" fill-opacity=\"0.3\" fill-rule=\"nonzero\" cx=\"40\" cy=\"40\" r=\"40\"> </circle> </g> </symbol> <symbol id=\"shk_icon_download\" viewbox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"> <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3\"/> </symbol> <symbol id=\"shk_icon_backward\" viewbox=\"0 0 22 24\"> <path d=\"M0 12.95h2.4a8.61 8.61 0 0 0 8.6 8.63c4.75 0 8.6-3.86 8.6-8.63A8.61 8.61 0 0 0 11 4.32V1.9c6.08 0 11 4.95 11 11.05C22 19.05 17.08 24 11 24S0 19.05 0 12.95z\"/> <path d=\"M7.14 8.1h1.21v9.86h-1.6v-7.92c-.6.54-1.34.94-2.25 1.2v-1.6A5.82 5.82 0 0 0 7.14 8.1zM13.92 7.9c1.14 0 2.04.47 2.68 1.44.6.9.91 2.14.91 3.69 0 1.54-.3 2.77-.9 3.68a3.07 3.07 0 0 1-2.69 1.44 3.04 3.04 0 0 1-2.68-1.44c-.6-.9-.9-2.14-.9-3.68 0-1.55.3-2.78.9-3.7a3.01 3.01 0 0 1 2.68-1.43zm0 1.37c-.78 0-1.33.43-1.65 1.31-.22.6-.33 1.41-.33 2.45 0 1.02.11 1.83.33 2.44.32.87.87 1.31 1.65 1.31.77 0 1.32-.44 1.65-1.3.22-.62.33-1.43.33-2.45 0-1.04-.1-1.86-.33-2.45-.33-.88-.88-1.31-1.65-1.31zM2.75 3.28L11 6.56V0z\"/> </symbol> <symbol id=\"shk_icon_forward\" viewbox=\"0 0 22 24\"> <path d=\"M11 1.9v2.42a8.61 8.61 0 0 0-8.6 8.63 8.61 8.61 0 0 0 8.6 8.63c4.75 0 8.6-3.86 8.6-8.63H22C22 19.05 17.08 24 11 24S0 19.05 0 12.95C0 6.85 4.92 1.9 11 1.9z\"/> <path d=\"M7.1 8.12h1.22v9.86H6.7v-7.92c-.6.54-1.33.94-2.24 1.2v-1.6A5.82 5.82 0 0 0 7.1 8.12zM13.9 7.94c1.14 0 2.04.47 2.68 1.44.6.91.91 2.14.91 3.69 0 1.54-.3 2.77-.9 3.69a3.07 3.07 0 0 1-2.69 1.43 3.04 3.04 0 0 1-2.68-1.43c-.6-.92-.9-2.15-.9-3.7 0-1.54.3-2.77.9-3.68a3.01 3.01 0 0 1 2.68-1.44zm0 1.37c-.78 0-1.33.43-1.65 1.31-.22.6-.33 1.41-.33 2.45 0 1.02.11 1.83.33 2.44.32.87.87 1.31 1.65 1.31.77 0 1.32-.44 1.65-1.3.22-.62.33-1.43.33-2.45 0-1.04-.1-1.85-.33-2.45-.33-.88-.88-1.31-1.65-1.31zM19.25 3.28L11 6.56V0z\"/> </symbol> <symbol id=\"shk_icon_unmute\" viewbox=\"0 0 508.514 508.514\" style=\"enable-background:new 0 0 508.514 508.514;\"> <path d=\"M271.483,0.109c-5.784-0.54-12.554,0.858-20.531,5.689c0,0-132.533,115.625-138.286,121.314\n      H39.725c-17.544,0.032-31.782,14.27-31.782,31.814v194.731c0,17.607,14.239,31.782,31.782,31.782h72.941\n      c5.753,5.753,138.286,117.277,138.286,117.277c7.977,4.799,14.747,6.229,20.531,5.689c11.76-1.112,20.023-10.965,22.534-21.358\n      c0.127-1.017,0.127-464.533-0.032-465.55C291.506,11.074,283.211,1.222,271.483,0.109z\"/> <path d=\"M342.962,309.798c-7.85,3.973-10.997,13.508-7.087,21.358c2.829,5.53,8.422,8.74,14.207,8.74\n      c2.384,0,4.799-0.572,7.151-1.684c32.132-16.209,52.091-48.341,52.091-83.938s-19.959-67.728-52.091-83.938\n      c-7.85-3.973-17.385-0.795-21.358,7.056c-3.909,7.85-0.763,17.385,7.087,21.358c21.326,10.743,34.579,32.005,34.579,55.524\n      S364.288,299.055,342.962,309.798z\"/> <path d=\"M339.72,59.32c-8.486-1.716-17.004,3.941-18.593,12.522c-1.716,8.645,3.909,17.004,12.522,18.688\n      c78.312,15.256,135.139,84.128,135.139,163.743S411.962,402.761,333.65,418.017c-8.613,1.684-14.239,10.011-12.554,18.656\n      c1.494,7.596,8.136,12.84,15.542,12.84l3.083-0.318c93.218-18.148,160.851-100.147,160.851-194.922S432.938,77.5,339.72,59.32z\"/> </symbol> <symbol id=\"shk_icon_mute\" viewbox=\"0 0 508.528 508.528\" style=\"enable-background:new 0 0 508.528 508.528;\"> <path d=\"M263.54,0.116c-5.784-0.54-12.554,0.858-20.531,5.689c0,0-132.533,115.625-138.317,121.314H31.782\n      C14.239,127.15,0,141.389,0,158.933v194.731c0,17.607,14.239,31.782,31.782,31.782h72.941\n      c5.784,5.753,138.317,117.277,138.317,117.277c7.977,4.799,14.747,6.229,20.531,5.689c11.76-1.112,20.023-10.965,22.534-21.358\n      c0.095-1.017,0.095-464.533-0.064-465.55C283.563,11.081,275.268,1.228,263.54,0.116z\"/> <path d=\"M447.974,254.28l54.857-54.857c7.596-7.564,7.596-19.864,0-27.428\n      c-7.564-7.564-19.864-7.564-27.428,0l-54.857,54.888l-54.888-54.888c-7.532-7.564-19.864-7.564-27.397,0\n      c-7.564,7.564-7.564,19.864,0,27.428l54.857,54.857l-54.857,54.888c-7.564,7.532-7.564,19.864,0,27.396\n      c7.532,7.564,19.864,7.564,27.396,0l54.888-54.857l54.857,54.857c7.564,7.564,19.864,7.564,27.428,0\n      c7.564-7.532,7.564-19.864,0-27.396L447.974,254.28z\"/> </symbol> <symbol id=\"shk_icon_indicator\" viewbox=\"0 0 66 66\"> <circle cx=\"33\" cy=\"33\" r=\"30\" fill=\"transparent\" stroke=\"url(#shk_gradient)\" stroke-dasharray=\"170\" stroke-dashoffset=\"20\" stroke-width=\"6\"/> <lineargradient id=\"shk_gradient\"> <stop offset=\"50%\" stop-color=\"currentColor\"/> <stop offset=\"65%\" stop-color=\"currentColor\" stop-opacity=\".5\"/> <stop offset=\"100%\" stop-color=\"currentColor\" stop-opacity=\"0\"/> </lineargradient> </symbol> </svg> ";

var CONFIG = {
  container: 'body',
  fixed: {
    type: 'auto',
    position: 'bottom'
  },
  download: false,
  themeColor: '#00869B',
  autoPlay: false,
  muted: false,
  preload: 'metadata',
  speedOptions: [0.5, 0.75, 1.25, 1.5],
  audio: null
};

function secondToTime(time) {
  time = Math.round(time);
  var hour = Math.floor(time / 3600);
  var min = Math.floor((time - hour * 3600) / 60);
  var sec = Math.floor(time - hour * 3600 - min * 60);
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  if (hour === 0) {
    hour = hour < 10 ? '0' + hour : hour;
    return "".concat(min, ":").concat(sec);
  }

  return "".concat(hour, ":").concat(min, ":").concat(sec);
}
function numToString(num) {
  var float = parseFloat(num).toFixed(2);
  return float.slice(-1) === '0' ? float.slice(0, -1) : float;
}
function carousel(el) {
  var distance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var pause = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;
  var carouselTimeout, carouselInterval;
  var duration = distance * 50;
  var interval = duration + pause;

  function transform() {
    el.style.transitionDuration = "".concat(duration / 1000, "s");
    el.style.transform = "translateX(-".concat(distance, "px)");
    carouselTimeout = setTimeout(function () {
      el.style.transform = 'translateX(0px)';
    }, interval);
  }

  transform();
  carouselInterval = setInterval(function () {
    return transform();
  }, interval * 2);
  return [carouselTimeout, carouselInterval];
}
function handleOptions(options) {
  options.container = document.querySelector(options.container ? options.container : CONFIG.container);
  options.fixed = options.fixed || CONFIG.fixed;
  options.download = typeof options.download === 'boolean' ? options.download : CONFIG.download;
  var fixedOptions = ['auto', 'static', 'fixed'];
  var result = fixedOptions.filter(function (item) {
    return item === options.fixed.type;
  })[0];

  if (!result) {
    options.fixed.type = CONFIG.fixed.type;
  }

  options.themeColor = options.themeColor || CONFIG.themeColor;
  options.autoPlay = options.autoPlay || CONFIG.autoPlay;
  options.muted = options.muted || CONFIG.muted;
  options.preload = options.preload || CONFIG.preload;
  options.speedOptions = options.speedOptions || CONFIG.speedOptions;

  if (!Array.isArray(options.speedOptions)) {
    options.speedOptions = [options.speedOptions];
  }

  if (!options.speedOptions.includes(1)) {
    options.speedOptions.push(1);
  }

  options.speedOptions = options.speedOptions.map(function (sp) {
    return parseFloat(sp);
  }).filter(function (sp) {
    return !isNaN(sp);
  });

  if (options.speedOptions.length > 1) {
    options.speedOptions.sort(function (a, b) {
      return a - b;
    });
  }

  if (!options.audio) {
    console.error('audio is not specified');
  } else {
    options.audio.title = options.audio.title || 'Unknown Title';
    options.audio.artist = options.audio.artist || 'Unknown Artist';
    options.audio.cover = options.audio.cover || null;
    options.audio.duration = options.audio.duration || 0;
  }

  return options;
}
function setMediaSession(audio) {
  var fns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var self = arguments.length > 2 ? arguments[2] : undefined;

  if ('mediaSession' in navigator) {
    /* global MediaMetadata */
    navigator.mediaSession.metadata = new MediaMetadata({
      title: audio.title,
      artist: audio.artist,
      artwork: [{
        src: audio.cover
      }]
    });

    if (Object.entries(fns).length && fns.constructor === Object) {
      Object.keys(fns).forEach(function (key) {
        navigator.mediaSession.setActionHandler(key, fns[key].bind(self));
      });
    }
  }
}

var carouselTimeout, carouselInterval;

var Template = /*#__PURE__*/function () {
  function Template(options) {
    _classCallCheck(this, Template);

    this.mounted = false;
    var iconExists = document.querySelector('.shk_icons');

    if (!iconExists) {
      this.icons = document.createElement('div');
      this.icons.classList.add('shk_icons');
      this.icons.innerHTML = iconTemplate;
    }

    this.initVariable();
    this.initOptions(options);
  }

  _createClass(Template, [{
    key: "initVariable",
    value: function initVariable() {
      this.el = document.createElement('div');
      this.el.tabIndex = 0;
      this.el.classList.add('shk');
      this.el.innerHTML = playerTemplate;
      this.playBtn = this.el.querySelector('.shk_btn_toggle');
      this.downloadBtn = this.el.querySelector('.shk_btn_download');
      this.fwdBtn = this.el.querySelector('.shk_btn_forward');
      this.bwdBtn = this.el.querySelector('.shk_btn_backward');
      this.speedBtn = this.el.querySelector('.shk_btn_speed');
      this.muteBtn = this.el.querySelector('.shk_btn_volume');
      this.artist = this.el.querySelector('.shk_subtitle');
      this.texts = this.el.querySelector('.shk_text');
      this.title = this.el.querySelector('.shk_title');
      this.subtitle = this.el.querySelector('.shk_subtitle');
      this.currentTime = this.el.querySelector('.shk_time_now');
      this.duration = this.el.querySelector('.shk_time_duration');
      this.bar = this.el.querySelector('.shk_bar');
      this.barWrap = this.el.querySelector('.shk_bar-wrap');
      this.audioPlayed = this.el.querySelector('.shk_bar_played');
      this.audioLoaded = this.el.querySelector('.shk_bar_loaded');
      this.handle = this.el.querySelector('.bar-handle');
      this.cover = this.el.querySelector('.shk_img');
    }
  }, {
    key: "initOptions",
    value: function initOptions(options) {
      this.el.style = "--theme-color: ".concat(options.themeColor);
      this.el.style.boxShadow = "0px 0px 14px 6px ".concat(options.themeColor, "20");
      this.audioPlayed.style.color = options.themeColor + '70';
      options.autoPlay ? this.el.classList.add('Play') : this.el.classList.add('Pause');

      if (options.download && options.audio && options.audio.src) {
        this.downloadBtn.href = options.audio.src;
      } else {
        this.downloadBtn.remove();
      }

      if (options.fixed.type !== 'static') {
        options.fixed.type === 'fixed' ? this.el.classList.add('Fixed') : this.el.classList.add('Auto');

        if (options.fixed.position === 'top') {
          this.el.classList.add('Top');
        }
      }

      if (options.muted) {
        this.el.classList.add('Mute');
      }

      if (options.audio) {
        this.update(options.audio);
      }
    }
  }, {
    key: "update",
    value: function update(audio) {
      this.cover.style.backgroundImage = "url(".concat(audio.cover, ")");
      this.title.innerHTML = audio.title;

      if (this.mounted) {
        this.textScroll();
      }

      this.artist.innerHTML = audio.artist;
      this.currentTime.innerHTML = '00:00';
      this.duration.innerHTML = audio.duration ? secondToTime(audio.duration) : '00:00';
      this.downloadBtn.href = audio.src;
    }
  }, {
    key: "textScroll",
    value: function textScroll() {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        clearTimeout(carouselTimeout);
      }

      var titleOverflow = this.title.offsetWidth - this.texts.offsetWidth;

      if (titleOverflow > 0) {
        var _carousel = carousel(this.title, titleOverflow);

        var _carousel2 = _slicedToArray(_carousel, 2);

        carouselTimeout = _carousel2[0];
        carouselInterval = _carousel2[1];
      } else {
        this.title.style.transform = 'none';
        this.title.style.transitionDuration = '0s';
      }
    }
  }, {
    key: "mount",
    value: function mount(container) {
      container.innerHTML = '';
      container.append(this.el);

      if (this.icons) {
        container.append(this.icons);
      }

      this.mounted = true;
      this.textScroll();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (clearInterval) {
        clearInterval(carouselInterval);
        clearTimeout(carouselTimeout);
      }
    }
  }]);

  return Template;
}();

var Bar = /*#__PURE__*/function () {
  function Bar(template) {
    _classCallCheck(this, Bar);

    this.audioPlayed = template.audioPlayed;
    this.audioLoaded = template.audioLoaded;
  }

  _createClass(Bar, [{
    key: "set",
    value: function set(type, percentage) {
      percentage = Math.min(percentage, 1);
      percentage = Math.max(percentage, 0);
      this[type].style.width = percentage * 100 + '%';
    }
  }]);

  return Bar;
}();

var Events = /*#__PURE__*/function () {
  function Events() {
    _classCallCheck(this, Events);

    this.audioEvents = ['abort', 'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
    this.events = {};
  }

  _createClass(Events, [{
    key: "on",
    value: function on(name, callback) {
      if (!this.audioEvents.includes(name) || typeof callback !== 'function') {
        console.error('invalid event name or callback function');
      } else {
        if (!this.events[name]) {
          this.events[name] = [];
        }

        this.events[name].push(callback);
      }
    }
  }, {
    key: "trigger",
    value: function trigger(name) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.events[name] && this.events[name].length) {
        this.events[name].forEach(function (fn) {
          return fn(data);
        });
      }
    }
  }]);

  return Events;
}();

var playerArr = [];
var initSeek;
var isMobile = typeof window !== 'undefined' ? /mobile/i.test(window.navigator.userAgent) : false;
var dragStart = isMobile ? 'touchstart' : 'mousedown';
var dragMove = isMobile ? 'touchmove' : 'mousemove';
var dragEnd = isMobile ? 'touchend' : 'mouseup';

var Player = /*#__PURE__*/function () {
  function Player(options) {
    _classCallCheck(this, Player);

    this.id = playerArr.length;
    playerArr.push(this);
    this.inited = false;
    this.canplay = false;
    this.dragging = false;
    this.options = handleOptions(options);
    this.muted = this.options.muted;
    this.initUI();
    this.initKeyEvents();
    this.currentSpeed = 1;
    this.events = new Events();
    this.initAudio();
    this.template.mount(this.options.container);
  }

  _createClass(Player, [{
    key: "initUI",
    value: function initUI() {
      this.template = new Template(this.options);
      this.el = this.template.el;
      this.bar = new Bar(this.template);
      this.initButtonEvents();
      this.initBarEvents();
    }
  }, {
    key: "initButtonEvents",
    value: function initButtonEvents() {
      var _this = this;

      this.template.playBtn.addEventListener('click', function () {
        _this.toggle();
      });
      this.template.muteBtn.addEventListener('click', function () {
        _this.muted = !_this.muted;

        _this.el.classList.toggle('Mute');

        if (_this.audio) {
          _this.audio.muted = _this.muted;
        }
      });
      this.template.fwdBtn.addEventListener('click', function () {
        _this.seekForward();
      });
      this.template.bwdBtn.addEventListener('click', function () {
        _this.seekBackward();
      });
      this.template.speedBtn.addEventListener('click', function () {
        var index = _this.options.speedOptions.indexOf(_this.currentSpeed);

        var speedRange = _this.options.speedOptions;
        _this.currentSpeed = index + 1 >= speedRange.length ? speedRange[0] : speedRange[index + 1];
        _this.template.speedBtn.innerHTML = numToString(_this.currentSpeed) + 'x';

        if (_this.audio) {
          _this.audio.playbackRate = _this.currentSpeed;
        }
      });
    }
  }, {
    key: "initBarEvents",
    value: function initBarEvents() {
      var _this2 = this;

      var seekingTime;

      var dragStartHandler = function dragStartHandler() {
        _this2.el.classList.add('Seeking');

        _this2.dragging = true;
        document.addEventListener(dragMove, dragMoveHandler);
        document.addEventListener(dragEnd, dragEndHandler);
      };

      var dragMoveHandler = function dragMoveHandler(e) {
        var offset = e.clientX || e.changedTouches && e.changedTouches[0].clientX || 0;

        var percentage = (offset - _this2.template.barWrap.getBoundingClientRect().left) / _this2.template.barWrap.clientWidth;

        percentage = Math.min(percentage, 1);
        percentage = Math.max(0, percentage);
        seekingTime = percentage * _this2.duration;

        _this2.setDisplayAndBarByTime(seekingTime);
      };

      var dragEndHandler = function dragEndHandler() {
        _this2.dragging = false;

        _this2.el.classList.remove('Seeking');

        _this2.seek(seekingTime);

        document.removeEventListener(dragMove, dragMoveHandler);
        document.removeEventListener(dragEnd, dragEndHandler);
      };

      var instantSeek = function instantSeek(e) {
        if (_this2.dragging) return;
        dragMoveHandler(e);

        _this2.seek(seekingTime);
      };

      this.template.barWrap.addEventListener(dragEnd, instantSeek);
      this.template.handle.addEventListener(dragStart, dragStartHandler);
    }
  }, {
    key: "initKeyEvents",
    value: function initKeyEvents() {
      var _this3 = this;

      var pressSpace = function pressSpace(e) {
        if (e.keyCode === 32) {
          var activeEl = document.activeElement;

          if (!activeEl.classList.contains('shk_btn_toggle')) {
            _this3.toggle();
          }
        }
      };

      this.el.addEventListener('keyup', pressSpace);
    }
  }, {
    key: "initAudio",
    value: function initAudio() {
      var _this4 = this;

      if (this.options.audio.src) {
        this.audio = new Audio();
        this.audio.title = this.options.audio.title;
        this.initLoadingEvents();
        this.initAudioEvents();
        this.events.audioEvents.forEach(function (name) {
          _this4.audio.addEventListener(name, function (e) {
            _this4.events.trigger(name, e);
          });
        });

        if (this.options.preload !== 'none') {
          this.updateAudio(this.options.audio.src);
          this.inited = true;
        }
      }
    }
  }, {
    key: "initAudioEvents",
    value: function initAudioEvents() {
      var _this5 = this;

      this.on('play', function () {
        if (_this5.el.classList.contains('Pause')) {
          _this5.setUIPlaying();
        }

        playerArr.forEach(function (player) {
          if (player.id !== _this5.id && player.audio && !player.audio.paused) {
            player.pause();
          }
        });
      });
      this.on('pause', function () {
        if (_this5.el.classList.contains('Play')) {
          _this5.setUIPaused();
        }
      });
      this.on('ended', function () {
        _this5.setUIPaused();

        _this5.seek(0);
      });
      this.on('durationchange', function () {
        if (_this5.duration !== 1) {
          _this5.template.duration.innerHTML = secondToTime(_this5.duration);
        }
      });
      this.on('progress', function () {
        if (_this5.audio.buffered.length) {
          var percentage = _this5.audio.buffered.length ? _this5.audio.buffered.end(_this5.audio.buffered.length - 1) / _this5.duration : 0;

          _this5.bar.set('audioLoaded', percentage);
        }
      });
      this.on('timeupdate', function () {
        if (!_this5.dragging) {
          _this5.setDisplayAndBarByTime(_this5.audio.currentTime);
        }
      });
    }
  }, {
    key: "initLoadingEvents",
    value: function initLoadingEvents() {
      var _this6 = this;

      this.on('canplaythrough', function () {
        if (_this6.el.classList.contains('Loading')) {
          _this6.el.classList.remove('Loading');
        }
      });
      this.on('waiting', function () {
        if (!_this6.el.classList.contains('Loading')) {
          _this6.el.classList.add('Loading');
        }
      });
      this.on('canplay', function () {
        if (!_this6.canplay) {
          _this6.canplay = true;

          if (initSeek) {
            _this6.seek(initSeek);
          }
        }
      });
    }
  }, {
    key: "on",
    value: function on(name, callback) {
      this.events.on(name, callback);
    }
  }, {
    key: "setDisplayAndBarByTime",
    value: function setDisplayAndBarByTime(time) {
      time = time || 0;
      var percentage = time / this.duration || 0;
      this.template.currentTime.innerHTML = secondToTime(time);
      this.bar.set('audioPlayed', percentage);
    }
  }, {
    key: "setUIPlaying",
    value: function setUIPlaying() {
      this.el.classList.add('Play');
      this.el.classList.remove('Pause');
    }
  }, {
    key: "setUIPaused",
    value: function setUIPaused() {
      this.el.classList.add('Pause');
      this.el.classList.remove('Play');
      this.el.classList.remove('Loading');
    }
  }, {
    key: "play",
    value: function play(audio) {
      var _this7 = this;

      if (!this.inited) {
        this.audio.src = this.options.audio.src;
        this.inited = true;
      }

      if (audio && audio.src) {
        this.template.update(audio);
        this.updateAudio(audio.src);
      }

      if (!this.audio.paused) return;
      var promise = this.audio.play();
      var self = this;
      var targetAudio = audio || this.options.audio;
      var controls = {
        play: this.play,
        pause: this.pause,
        seekforward: this.seekForward,
        seekbackward: this.seekBackward
      };

      if (promise instanceof Promise) {
        promise.then(function () {
          setMediaSession(targetAudio, controls, self);
        });
        promise.catch(function (e) {
          if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
            _this7.pause();
          }
        });
      } else {
        setMediaSession(targetAudio, controls, self);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.audio.paused) return;
      this.audio.pause();
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (!this.inited) {
        this.audio.src = this.options.audio.src;
        this.inited = true;
      }

      this.audio.paused ? this.play() : this.pause();
    }
  }, {
    key: "seek",
    value: function seek(time) {
      var _time = parseInt(time);

      if (isNaN(_time)) {
        console.error('seeking time is NaN');
        return;
      }

      _time = Math.min(_time, this.duration);
      _time = Math.max(_time, 0);
      this.setDisplayAndBarByTime(_time);

      if (!this.canplay) {
        initSeek = time;
      } else if (this.audio) {
        this.audio.currentTime = _time;
      }
    }
  }, {
    key: "seekForward",
    value: function seekForward() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      var seekingTime = Math.min(this.duration, this.audio.currentTime + time);
      this.seek(seekingTime);
    }
  }, {
    key: "seekBackward",
    value: function seekBackward() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      var seekingTime = Math.max(0, this.audio.currentTime - time);
      this.seek(seekingTime);
    }
  }, {
    key: "updateAudio",
    value: function updateAudio(src) {
      this.audio.src = src;
      this.audio.preload = this.options.preload;
      this.audio.muted = this.muted;

      if (this.options.autoplay && this.muted) {
        this.audio.autoplay = this.options.autoPlay;
      }

      this.audio.playbackRate = this.currentSpeed;
    }
  }, {
    key: "destroyAudio",
    value: function destroyAudio() {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.destroyAudio();
      this.template.destroy();
      this.options.container.innerHTML = '';
    }
  }, {
    key: "duration",
    get: function get() {
      if (!this.audio || !this.audio.src) {
        return this.options.audio.duration;
      } else {
        return isNaN(this.audio.duration) ? this.options.audio.duration : this.audio.duration;
      }
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this.audio ? this.audio.currentTime : undefined;
    }
  }]);

  return Player;
}();

console.log("%c\uD83C\uDF4A%c Shikwasa Podcast Player v1.0.7 %c https://jessuni.github.io/shikwasa/", 'background-color:#00869B40;padding:4px;', 'background:#00869B80;color:#fff;padding:4px 0', 'padding: 2px 0;');

module.exports = Player;
