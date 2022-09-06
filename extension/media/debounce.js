const debounce = (cb, delay = 1000) => {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

const updateDebounce = debounce((cb) => {
  cb()
}, 250)
