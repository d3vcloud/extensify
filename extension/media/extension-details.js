const vscode = acquireVsCodeApi()

// Selectors
const tableExtensions = document.querySelector('.table-extensions').getElementsByTagName('tbody')[0]
const inputFilter = document.querySelector('input')

// Check if we have an old state to restore from
const previousStateExtensions = vscode.getState()
let LIST_EXTENSIONS = previousStateExtensions ? previousStateExtensions.extensions : []

const listExtensionsByUser = (userExtensions) => {
  let rows = ''
  for (const ext of userExtensions) {
    const { displayName, author, version, installationId, isInstalled } = ext
    const status = isInstalled
      ? 'Installed'
      : `<button data-extension='${installationId}'>Install</button>`
    rows += `
      <tr>
        <td>${displayName}</td>
        <td>${author}</td>
        <td>${version}</td>
        <td>
          ${status}
        </td>
      </tr>
    `
  }
  tableExtensions.innerHTML = rows
}

const filterExtensions = (termSearch) => {
  const extensions = LIST_EXTENSIONS.filter((ext) => {
    return ext.displayName.toLowerCase().includes(termSearch)
  })
  listExtensionsByUser(extensions)

  const newState = vscode.getState()

  if (newState) {
    const extensions = newState.extensions
    const data = {
      extensions,
      termSearch
    }
    vscode.setState(data)
  }
}

// It means we have an array created with extensions
if (LIST_EXTENSIONS.length > 0) {
  const termSearch = previousStateExtensions.termSearch
  // It means we were searching for an extension
  if (termSearch) {
    filterExtensions(termSearch)
    inputFilter.value = termSearch
  } else {
    listExtensionsByUser(LIST_EXTENSIONS)
  }
}

window.addEventListener('message', (event) => {
  const message = event.data
  switch (message.type) {
    case 'list-extensions': {
      const userExtensions = message.value
      LIST_EXTENSIONS = userExtensions
      // Set state to persist the data
      vscode.setState({ extensions: userExtensions })
      listExtensionsByUser(userExtensions)
      break
    }
  }
})

const installExtension = (installationId) => {
  vscode.postMessage({
    type: 'install-extension',
    value: installationId
  })
}

// Event delegation for table extensions
tableExtensions.addEventListener('click', (event) => {
  const target = event.target
  if (target.tagName !== 'BUTTON') return

  const installationId = target.dataset.extension
  installExtension(installationId)
})

// ========== FILTER EXTENSIONS FUNCTIONALITY ==============

inputFilter.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase()

  if (!searchTerm) {
    listExtensionsByUser(LIST_EXTENSIONS)
    if (previousStateExtensions) {
      const extensions = previousStateExtensions.extensions
      const newState = {
        extensions,
        termSearch: ''
      }
      vscode.setState(newState)
    }
    return
  }

  updateDebounce(() => filterExtensions(searchTerm))
})
