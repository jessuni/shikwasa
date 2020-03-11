const chapterTemplate = /* template */`
  <div class="shk_chapter_main">
    <ol class="shk_chapter_list">
      <li class="shk_chapter_item">
        <button class="shk_btn shk_btn_chapter">
          <span class="shk_icon_chapter" aria-hidden="true">
            <span class="shk_icon_playing"></span>
            <span class="shk_icon_triangle">
              <svg>
                <use xlink:href="#shk_icon_triangle" />
              </svg>
            </span>
          </span>
          <span class="shk_chapter_duration">10:08</span>
          <span class="shk_chapter_title">What are psychedelics and why do we need it?</span>
        </button>
      </li>
      <li class="shk_chapter_item">
        <button class="shk_btn shk_btn_chapter">
          <span class="shk_icon_triangle" aria-hidden="true">
            <svg>
              <use xlink:href="#shk_icon_triangle" />
            </svg>
          </span>
          <div class="shk_chapter_duration" title="chapter duration" aria-label="chapter duration">1:30</div>
          <div class="shk_chapter_title" title="chapter title" aria-label="chapter title">Sponsor: Squarespace</div>
        </button>
      </li>
    </ol>
  </div>
  <button class="shk_btn shk_btn_close" aria-label="close chapter panel" title="close chapter panel">
    <svg class="shk_icon_close" aria-hidden="true">
      <use xlink:href="#shk_icon_close" />
    </svg>
  </button>
`

export default chapterTemplate
