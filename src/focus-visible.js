/**
 * focus-visible polyfill for button and progress handle from
 * https://github.com/WICG/focus-visible/blob/master/src/focus-visible.js
 * stripped only relevent section and replace manipulating the whole document to only a certain element, i.e. shikwasa player to prevent changing document behavior
 */
function applyFocusVisiblePolyfill(parent, supportsPassive) {
  var hadKeyboardEvent = true
  var hadFocusVisibleRecently = false
  var hadFocusVisibleRecentlyTimeout = null

  /**
   * Helper function for legacy browsers and iframes which sometimes focus
   * elements like document, body, and non-interactive SVG.
   * @param {Element} el
   */
  function isValidFocusTarget(el) {
    if (
      el &&
      el !== document &&
      el.nodeName !== 'HTML' &&
      el.nodeName !== 'BODY' &&
      'classList' in el &&
      'contains' in el.classList
    ) {
      return true
    }
    return false
  }

  /**
   * Add the `focus-visible` class to the given element if it was not added by
   * the author.
   * @param {Element} el
   */
  function addFocusVisibleClass(el) {
    if (el.classList.contains('focus-visible')) {
      return
    }
    el.classList.add('focus-visible')
    el.setAttribute('data-focus-visible-added', '')
  }

  /**
   * Remove the `focus-visible` class from the given element if it was not
   * originally added by the author.
   * @param {Element} el
   */
  function removeFocusVisibleClass(el) {
    if (!el.hasAttribute('data-focus-visible-added')) {
      return
    }
    el.classList.remove('focus-visible')
    el.removeAttribute('data-focus-visible-added')
  }

  /**
   * If the most recent user interaction was via the keyboard;
   * and the key press did not include a meta, alt/option, or control key;
   * then the modality is keyboard. Otherwise, the modality is not keyboard.
   * Apply `focus-visible` to any current active element and keep track
   * of our keyboard modality state with `hadKeyboardEvent`.
   * @param {KeyboardEvent} e
   */
  function onKeyDown(e) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return
    }

    if (isValidFocusTarget(document.activeElement) && parent.contains(document.activeElement)) {
      addFocusVisibleClass(document.activeElement)
    }

    hadKeyboardEvent = true
  }

  /**
   * If at any point a user clicks with a pointing device, ensure that we change
   * the modality away from keyboard.
   * This avoids the situation where a user presses a key on an already focused
   * element, and then clicks on a different element, focusing it with a
   * pointing device, while we still think we're in keyboard modality.
   * @param {Event} e
   */
  function onPointerDown() {
    hadKeyboardEvent = false
  }

  /**
   * On `focus`, add the `focus-visible` class to the target if:
   * - the target received focus as a result of keyboard navigation, or
   * - the event target is an element that will likely require interaction
   *   via the keyboard (e.g. a text box)
   * @param {Event} e
   */
  function onFocus(e) {
    // Prevent IE from focusing the document or HTML element.
    if (!isValidFocusTarget(e.target)) {
      return
    }

    if (hadKeyboardEvent) {
      addFocusVisibleClass(e.target)
    }
  }

  /**
   * On `blur`, remove the `focus-visible` class from the target.
   * @param {Event} e
   */
  function onBlur(e) {
    if (!isValidFocusTarget(e.target)) {
      return
    }

    if (
      e.target.classList.contains('focus-visible') ||
      e.target.hasAttribute('data-focus-visible-added')
    ) {
      // To detect a tab/window switch, we look for a blur event followed
      // rapidly by a visibility change.
      // If we don't see a visibility change within 100ms, it's probably a
      // regular focus change.
      hadFocusVisibleRecently = true
      window.clearTimeout(hadFocusVisibleRecentlyTimeout)
      hadFocusVisibleRecentlyTimeout = window.setTimeout(function () {
        hadFocusVisibleRecently = false
      }, 100)
      removeFocusVisibleClass(e.target)
    }
  }
  /**
   * If the user changes tabs, keep track of whether or not the previously
   * focused element had .focus-visible.
   * @param {Event} e
   */

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      // If the tab becomes active again, the browser will handle calling focus
      // on the element (Safari actually calls it twice).
      // If this tab change caused a blur on an element with focus-visible,
      // re-apply the class when the user switches back to the tab.
      if (hadFocusVisibleRecently) {
        hadKeyboardEvent = true
      }
      addInitialPointerMoveListeners()
    }
  }
  function addInitialPointerMoveListeners() {
    parent.addEventListener('mousemove', onInitialPointerMove)
    parent.addEventListener('mousedown', onInitialPointerMove)
    parent.addEventListener('mouseup', onInitialPointerMove)
    parent.addEventListener('pointermove', onInitialPointerMove)
    parent.addEventListener('pointerdown', onInitialPointerMove)
    parent.addEventListener('pointerup', onInitialPointerMove)
    parent.addEventListener('touchmove', onInitialPointerMove, supportsPassive ? { passive: true } : false)
    parent.addEventListener('touchstart', onInitialPointerMove, supportsPassive ? { passive: true } : false)
    parent.addEventListener('touchend', onInitialPointerMove, supportsPassive ? { passive: true } : false)
  }

  function removeInitialPointerMoveListeners(el) {
    parent.removeEventListener('mousemove', onInitialPointerMove)
    parent.removeEventListener('mousedown', onInitialPointerMove)
    parent.removeEventListener('mouseup', onInitialPointerMove)
    parent.removeEventListener('pointermove', el)
    parent.removeEventListener('pointerdown', onInitialPointerMove)
    parent.removeEventListener('pointerup', onInitialPointerMove)
    parent.removeEventListener('touchmove', onInitialPointerMove, supportsPassive ? { passive: true } : false)
    parent.removeEventListener('touchstart', onInitialPointerMove, supportsPassive ? { passive: true } : false)
    parent.removeEventListener('touchend', onInitialPointerMove, supportsPassive ? { passive: true } : false)
  }
  /**
   * When the polfyill first loads, assume the user is in keyboard modality.
   * If any event is received from a pointing device (e.g. mouse, pointer,
   * touch), turn off keyboard modality.
   * This accounts for situations where focus enters the page from the URL bar.
   * @param {Event} e
   */
  function onInitialPointerMove() {
    hadKeyboardEvent = false
    removeInitialPointerMoveListeners()
  }

  // For some kinds of state, we are interested in changes at the global scope
  // only. For example, global pointer input, global key presses and global
  // visibility change should affect the state at every scope:
  parent.addEventListener('keydown', onKeyDown, true)
  parent.addEventListener('mousedown', onPointerDown, true)
  parent.addEventListener('pointerdown', onPointerDown, true)
  parent.addEventListener('touchstart', onPointerDown, supportsPassive ? { passive: true, capture: true } : true)
  parent.addEventListener('visibilitychange', onVisibilityChange, true)

  addInitialPointerMoveListeners()

  // For focus and blur, we specifically care about state changes in the local
  // scope. This is because focus / blur events that originate from within a
  // shadow root are not re-dispatched from the host element if it was already
  // the active element in its own scope:
  parent.addEventListener('focus', onFocus, true)
  parent.addEventListener('blur', onBlur, true)

  parent.classList.add('js-focus-visible')
}

export default applyFocusVisiblePolyfill
