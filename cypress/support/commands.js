const compareColor = (color, property) => (targetElement) => {
  const tempElement = document.createElement('div')
  tempElement.style.color = color
  tempElement.style.display = 'none' // make sure it doesn't actually render
  document.body.appendChild(tempElement) // append so that `getComputedStyle` actually works

  const tempColor = getComputedStyle(tempElement).color
  const targetColor = getComputedStyle(targetElement[0])[property]

  document.body.removeChild(tempElement) // remove it because we're done with it

  expect(tempColor).to.equal(targetColor)
};

Cypress.Commands.overwrite('should', (originalFn, subject, expectation, ...args) => {
  const customMatchers = {
    'have.backgroundColor': compareColor(args[0], 'backgroundColor'),
    'have.color': compareColor(args[0], 'color'),
  }

  // See if the expectation is a string and if it is a member of Jest's expect
  if (typeof expectation === 'string' && customMatchers[expectation]) {
    return originalFn(subject, customMatchers[expectation])
  }
  return originalFn(subject, expectation, ...args)
})

