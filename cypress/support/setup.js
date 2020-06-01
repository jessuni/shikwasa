import data from '../fixtures/data'

const Parser = {
  read(src, { onSuccess }) {
    return new Promise((resolve) => {
      if (src) {
        onSuccess(data.tags)
        resolve(data.tags)
      }
    })
  },
}

let Setup = (function () {
  return {
    Parser,
  }
})()

export default Setup
