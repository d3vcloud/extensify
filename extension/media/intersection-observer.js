const TARGET_INTERCEPTOR = document.querySelector('#interceptor')

const OPTIONS = {
  threshold: 1
}

const observer = new IntersectionObserver((entries) => {
  if (!TARGET_INTERCEPTOR) return

  const entry = entries[0]
  if (!entry.isIntersecting) return
  // console.log('Intercepting')
  // Getting the value of text search
  const textToSearch = inputSearch.value.toLowerCase()

  if (USER_CURSOR && textToSearch) {
    // When the element is being intersected, send a message to the extension to fetch results
    vscode.postMessage({
      command: 'filter',
      value: {
        textToSearch,
        cursor: USER_CURSOR.id
      }
    })
  }
}, OPTIONS)

observer.observe(TARGET_INTERCEPTOR)
