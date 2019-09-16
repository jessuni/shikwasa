const PlayerTemplate = /* template */`
  <div class="shk_bar-wrap">
    <div class="shk_bar" aria-label="progress bar">
      <div class="shk_bar_played" aria-label="played progress">
        <span class="shk_bar-handle" aria-label="progress bar handle"></span>
      </div>
      <div class="shk_bar_loaded" aria-label="loaded progress"></div>
    </div>
  </div>
  <div class="shk_extra">
    <span class="shk_extra_controls">
      <button class="shk_btn shk_btn_volume" aria-label="toggle volume" title="volume">
      <svg class="shk_btn_unmute" aria-hidden="true">
        <use xlink:href="#shk_icon_unmute" />
      </svg>
      <svg class="shk_btn_mute" aria-hidden="true">
        <use xlink:href="#shk_icon_mute" />
      </svg>
    </button>
      <button class="shk_btn shk_btn_download" title="download" aria-label="download">
        <svg aria-hidden="true">
          <use xlink:href="#shk_icon_download" />
        </svg>
      </button>
      <button class="shk_btn shk_btn_chapter" title="chapters" aria-label="view chapters">
        <svg aria-hidden="true">
          <use xlink:href="#shk_icon_chapter" />
        </svg>
      </button>
    </span>
  </div>
  <div class="shk_body">
    <div class="shk_cover">
      <div class="shk_img"></div>
    </div>
    <div class="shk_main">
      <div class="shk_text">
        <div>
          <span class="shk_artist"></span>
        </div>
        <div>
          <span class="shk_title"></span>
        </div>
      </div>
      <div class="shk_controls">
        <button class="shk_btn shk_btn_speed" aria-label="toggle playback rate" title="change playback rate"
          aria-live="polite">1.0x</button>
        <button class="shk_btn shk_btn_backward" aria-label="rewind 10 seconds" title="rewind 10 seconds">
          <svg aria-hidden="true">
            <use xlink:href="#shk_icon_backward" />
          </svg>
        </button>
        <button class="shk_btn shk_btn_toggle" aria-label="toggle play and pause">
          <svg class="shk_btn_play" aria-hidden="true">
            <use xlink:href="#shk_icon_play" />
          </svg>
          <svg class="shk_btn_pause" aria-hidden="true">
            <use xlink:href="#shk_icon_pause" />
          </svg>
        </button>
        <button class="shk_btn shk_btn_forward" aria-label="forward 10 seconds" title="forward 10 seconds">
          <svg aria-hidden="true">
            <use xlink:href="#shk_icon_forward" />
          </svg>
        </button>
        <button class="shk_btn shk_btn_more">
          <svg aria-hidden="true">
            <use xlink:href="#shk_icon_more" />
          </svg>
        </button>
      </div>
      <div class="shk_display">
        <span class="shk_loader" aria-live="polite">
          <span class="shk_visuallyhidden" tabindex="-1">loading</span>
          <svg aria-hidden="true" aria-label="loading" aria-live="polite" viewbox="0 0 66 66">
            <circle cx="33" cy="33" r="30" fill="transparent" stroke="url(#shk_gradient)" stroke-dasharray="170"
              stroke-dashoffset="20" stroke-width="6" />
            <lineargradient id="shk_gradient">
              <stop offset="50%" stop-color="currentColor" />
              <stop offset="65%" stop-color="currentColor" stop-opacity=".5" />
              <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
            </lineargradient>
          </svg>
        </span>
        <span class="shk_time">
          <span class="shk_time_now">--:--</span><span class="shk_time_duration">--:--</span>
        </span>
      </div>
    </div>
  </div>
`
export default PlayerTemplate
