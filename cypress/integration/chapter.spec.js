import data from '../fixtures/data'
import Setup from '../support/setup'

let Shikwasa, Chapter, shk, container

beforeEach(() => {
  cy.visit('cypress.html')
  shk = null
  cy.window().then($window => {
    Shikwasa = $window.Shikwasa
    Chapter = $window.Chapter
    Shikwasa.use(Chapter)
    container = $window.document.querySelector('.shk-container')
  })
})

describe('Chapter injection',() => {
  it('does not show chapter panel if audio does not contain chapter data', () => {
    shk = new Shikwasa({ container, audio: { src: '#' } })
    cy.get('.shk')
      .should('not.have.attr', 'data-has-chapter')
    cy.get('.shk-btn_chapter')
      .should('not.be.visible')
    cy.get('.shk-chapter')
      .should('not.be.visible')
    cy.get('li.shk-chapter_item')
      .should('not.exist')
    cy.get('.shk-chapter_btn')
      .should('not.exist')
  })

  it('shows chapter panel if audio has chapter', () => {
    shk = new Shikwasa({ container, audio: data.customAudio })
    cy.get('.shk')
      .should('have.attr', 'data-has-chapter')
    cy.get('.shk-chapter')
      .should('not.be.visible')
    cy.get('li.shk-chapter_item')
      .should('exist')
    cy.get('.shk-btn_more').click()
    cy.wait(500)
    cy.get('.shk-btn_chapter')
      .should('be.visible')
  })

  describe('renders custom data', () => {
    const parser = {
      'with parser': Setup.Parser,
      'without parser': null,
    }

    Object.keys(parser).forEach(k => {
      it(`renders custom data ${k}'s presence`, () => {
        shk = new Shikwasa({
          container,
          audio: data.customAudio,
          parser: parser[k],
        })
        cy.get('.shk-chapter_item').then($li => {
          $li.toArray().forEach((li, i) => {
            cy.get('.shk-chapter_duration')
              .contains(data.customAudio.chapters[i].time_display)
            cy.get('.shk-chapter_title')
              .contains(data.customAudio.chapters[i].title)
          })
        })
      })
    })
  })

  it('renders parsed data when a parser is used', () => {
    shk = new Shikwasa({
      audio: { src: data.src },
      container,
      parser: Setup.Parser,
    })
    cy.get('.shk-chapter_item')
      .should('have.length', data.parsedAudio.chapters.length)
      .then($li => {
        $li.toArray().forEach((li, i) => {
          cy.get('.shk-chapter_title')
            .contains(data.parsedAudio.chapters[i].title)
        })
      })
  })
})

describe('Seek controls', () => {
  it('enables chapter seek controls when duration is available', () => {
    const audio = data.parsedAudio
    audio.duration = 0
    shk = new Shikwasa({ audio, preload: 'none' })

    cy.get('.shk-btn_chapter').should('be.disabled').then(() => {
      audio.duration = 1
      shk.update(audio)
      cy.get('.shk-btn_chapter').should('not.be.disabled')
    })
  })

  it('disables seek controls when duration is not available', () => {
    const audio = data.parsedAudio
    audio.duration = 2
    shk = new Shikwasa({ audio, preload: 'none' })

    cy.get('.shk-btn_chapter')
      .should('exist')
      .should('not.be.disabled').then(() => {
        audio.duration = 0
        shk.update(audio)
        cy.get('.shk-btn_chapter').should('be.disabled')
      })
  })
})

describe('Chapter actions', () => {
  describe('When performing actions related to chapters, audio current time mutates', () => {
    it('seeks to target time when chapter is clicked', () => {
      shk = new Shikwasa({
        audio: data.parsedAudio,
        container,
      })
      cy.get('.shk-btn_more').click()
      cy.get('.shk-btn_chapter').click()
      cy.get('.shk-chapter_btn').each(($btn, i) => {
        cy.wrap($btn).click({ force: true }).then(() => {
          expect(shk.audio.currentTime).to.be.closeTo(data.parsedAudio.chapters[i].startTime, 1)
        })
      })
    })

    it('shows chapter panel when clicking chapter button', () => {
      shk = new Shikwasa({
        audio: data.customAudio,
        container,
      })
      cy.get('.shk-btn_more').click()
      cy.get('.shk-btn_chapter').click().then(() => {
        cy.get('.shk')
          .should('have.attr', 'data-show-chapter')
      })
    })

    it('closes chapter panel when clicking close icon', () => {
      shk = new Shikwasa({
        audio: data.customAudio,
        container,
      })
      cy.get('.shk-btn_more').click()
      cy.get('.shk-btn_chapter').click()
      cy.get('.shk-btn_close').click({ force: true })
      cy.get('.shk')
        .should('not.have.attr', 'data-show-chapter')
    })
  })
  describe('When audio playback time changes, ui updates accordingly', () => {
    it('highlights current chapter when audio current time updates', () => {
      shk = new Shikwasa({
        audio: data.parsedAudio,
        container,
      })

      cy.get('.shk-btn_toggle').click().then(() => {
        shk.audio.currentTime = 480
        cy.get('.shk-btn_toggle').click()
        cy.get('.shk-chapter_item[data-id="ch4"]')
          .should('have.attr', 'data-active')
      })
    })
  })
})

describe('Chapter scrolls', () => {
  it('scrolls current chapter element into view', () => {
    shk = new Shikwasa({
      audio: data.parsedAudio,
      container,
    })
    cy.get('.shk-btn_more').click()
    cy.get('.shk-btn_chapter').click()
    cy.get('.shk-chapter_item[data-id="ch7"]')
      .should('not.be.visible')
    cy.get('.shk-btn_toggle').click().then(() => {
      shk.audio.currentTime = 637
      cy.get('.shk-btn_toggle').click()
      cy.get('.shk-chapter_item[data-id="ch7"]')
        .should('have.attr', 'data-active')
      cy.get('.shk-chapter_item[data-id="ch7"]')
        .should('be.visible')
    })
  })
})

