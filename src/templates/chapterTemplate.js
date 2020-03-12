const chapterTemplate = /* template */`
  <div class="shk-chapter_main">
    <ol class="shk-chapter_list">
      <li class="shk-chapter_item">
        <button class="shk-btn shk-btn_chapter">
          <span class="shk-icon_chapter" aria-hidden="true">
            <span class="shk-icon_playing"></span>
            <span class="shk-icon_triangle">
              <svg>
                <use xlink:href="#shk-icon_triangle" />
              </svg>
            </span>
          </span>
          <span class="shk-chapter_duration">10:08</span>
          <span class="shk-chapter_title">What are psychedelics and why do we need it?</span>
        </button>
      </li>
      <li class="shk-chapter_item">
        <button class="shk-btn shk-btn_chapter">
          <span class="shk-icon_triangle" aria-hidden="true">
            <svg>
              <use xlink:href="#shk-icon_triangle" />
            </svg>
          </span>
          <div class="shk-chapter_duration" title="chapter duration" aria-label="chapter duration">1:30</div>
          <div class="shk-chapter_title" title="chapter title" aria-label="chapter title">Sponsor: Squarespace</div>
        </button>
      </li>
    </ol>
  </div>
  <button class="shk-btn shk-btn_close" aria-label="close chapter panel" title="close chapter panel">
    <svg class="shk-icon_close" aria-hidden="true">
      <use xlink:href="#shk-icon_close" />
    </svg>
  </button>
`

export default chapterTemplate
