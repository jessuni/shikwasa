const PlayerTemplate = /* template */ `
  <div class="shk-player">
    <div class="shk-bar_wrap">
      <div class="shk-bar" aria-label="progress bar">
        <div class="shk-bar_loaded"
          role="progressbar"
          aria-label="loaded progress"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="1"></div>
        <div class="shk-bar_played"
          role="progressbar"
          aria-label="played progress"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="1">
          <button class="shk-bar-handle"
            role="slider"
            aria-label="seek progress"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-orientation="horizontal"
            aria-valuemax="1"></button>
        </div>
      </div>
    </div>
    <div class="shk-body">
      <div class="shk-cover">
        <div class="shk-img"></div>
      </div>
      <div class="shk-main">
        <div class="shk-text">
          <div class="shk-artist_wrap">
            <span class="shk-artist"></span>
          </div>
          <div class="shk-title_wrap">
            <div class="shk-title_inner">
              <span class="shk-title"></span>
            </div>
          </div>
        </div>
        <div class="shk-controls">
          <div class="shk-controls_basic">
            <button class="shk-btn shk-btn_speed"
              aria-label="toggle playback rate"
              title="change playback rate"
              aria-live="polite">1.0x</button>
            <button class="shk-btn shk-btn_backward"
              aria-label="rewind 10 seconds"
              title="rewind 10 seconds">
              <svg aria-hidden="true">
                <use xlink:href="#shk-icon_backward" />
              </svg>
            </button>
            <button class="shk-btn shk-btn_toggle" aria-label="toggle play and pause">
              <svg class="shk-btn_play" aria-hidden="true">
                <use xlink:href="#shk-icon_play" />
              </svg>
              <svg class="shk-btn_pause" aria-hidden="true">
                <use xlink:href="#shk-icon_pause" />
              </svg>
            </button>
            <button class="shk-btn shk-btn_forward" aria-label="forward 10 seconds" title="forward 10 seconds">
              <svg aria-hidden="true">
                <use xlink:href="#shk-icon_forward" />
              </svg>
            </button>
            <button class="shk-btn shk-btn_more" aria-label="more controls" title="more controls">
              <svg aria-hidden="true">
                <use xlink:href="#shk-icon_more" />
              </svg>
            </button>
          </div>
          <div class="shk-controls_extra">
            <button class="shk-btn shk-btn_volume" aria-label="toggle volume" title="volume">
              <svg class="shk-btn_unmute" aria-hidden="true">
                <use xlink:href="#shk-icon_unmute" />
              </svg>
              <svg class="shk-btn_mute" aria-hidden="true">
                <use xlink:href="#shk-icon_mute" />
              </svg>
            </button>
          </div>
        </div>
        <div class="shk-display">
          <span class="shk-loader" aria-live="polite">
            <span class="shk-visuallyhidden" tabindex="-1">loading</span>
            <svg aria-hidden="true" aria-label="loading" aria-live="polite" viewbox="0 0 66 66">
              <circle cx="33" cy="33" r="30" fill="transparent" stroke="url(#shk-gradient)" stroke-dasharray="170"
                stroke-dashoffset="20" stroke-width="6" />
              <lineargradient id="shk-gradient">
                <stop offset="50%" stop-color="currentColor" />
                <stop offset="65%" stop-color="currentColor" stop-opacity=".5" />
                <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
              </lineargradient>
            </svg>
          </span>
          <span class="shk-time">
            <span class="shk-time_now">00:00</span><span class="shk-time_duration">00:00</span>
          </span>
          <div class="shk-live">live</div>
        </div>
      </div>
    </div>
  </div>
`
export default PlayerTemplate
