const vscode = acquireVsCodeApi()

// Selectors
const btnLogin = document.querySelector('.btn-auth')
const btnLogout = document.querySelector('.btn-logout')
const panelLogged = document.querySelector('#panelLogged')
const panelSignIn = document.querySelector('#panelSignIn')
const inputSearch = document.querySelector('.input-search')
const containerUsers = document.querySelector('.list-users-wrapper')

// Getting the state stored
const previousStateSidebar = vscode.getState()

// Cursor variable which store the last user of array
let USER_CURSOR = null

const getItemUser = (user) => {
  const { id, photoUrl, username, name, gist } = user
  const { identify } = gist
  return `
  <div class="user-item" aria-label="${username}" data-gist="${identify}">
    <div class="user-icon" data-gist="${identify}">
      <img src="${photoUrl}" class="user-avatar" alt="${username}" data-gist="${identify}">
    </div>
    <div class="user-details" data-gist="${identify}">
      <span class="user-info ellipsis" data-gist="${identify}">${username}</span>
      <span class="user-last-update ellipsis" data-gist="${identify}">${name}</span>
    </div>   
  </div>`
}

const listUsers = (data) => {
  // console.log(data)
  // console.log(`Getting ${data.length}`)
  let listItems = ''

  data.forEach((user) => {
    listItems += getItemUser(user)
  })
  containerUsers.innerHTML = listItems
}

if (previousStateSidebar) {
  const { termSearch, users } = previousStateSidebar
  if (termSearch) {
    inputSearch.value = termSearch
    inputSearch.focus()
    if (users) {
      listUsers(users)
      // Track the cursor of current array
      USER_CURSOR = users.at(-1)
    }
  }
}

// Handle messages sent from the extension to the webview
window.addEventListener('message', (event) => {
  const message = event.data
  switch (message.type) {
    case 'token': {
      const token = message.value

      if (token) {
        panelLogged.classList.add('show')
        panelSignIn.classList.remove('show')
        panelSignIn.classList.add('hidden')
      } else {
        panelSignIn.classList.add('show')
        panelLogged.classList.remove('show')
        panelLogged.classList.add('hidden')
      }
      break
    }
    case 'list-results': {
      const data = message.value
      const termValue = inputSearch.value

      const { users: prevUsers = [] } = vscode.getState()

      if (data.length > 0) {
        const newData = prevUsers.concat(data)
        vscode.setState({ users: newData, termSearch: termValue })
        listUsers(newData)
        USER_CURSOR = data.at(-1)
      } else {
        containerUsers.innerHTML = 'No users found.'
      }
      break
    }
  }
})

// First time will be undefined
vscode.postMessage({ command: 'get-token' })

// Login and logout
const authenticateWithGithub = () => vscode.postMessage({ command: 'authenticated' })
const logout = () => vscode.postMessage({ command: 'logout' })
// Events for buttons
btnLogin.addEventListener('click', authenticateWithGithub)
btnLogout.addEventListener('click', logout)

const filterResults = (searchTerm) => {
  const value = {
    textToSearch: searchTerm,
    cursor: ''
  }
  const newState = {
    termSearch: searchTerm
  }
  vscode.setState(newState)

  vscode.postMessage({ command: 'filter', value })
}

/* Filter functionality */
inputSearch.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase()

  if (!searchTerm) {
    containerUsers.innerHTML = ''
    vscode.setState(undefined)
    return
  }

  updateDebounce(() => filterResults(searchTerm))
})

containerUsers.addEventListener('click', (e) => {
  const gistId = e.target.dataset.gist
  if (!gistId) return

  vscode.postMessage({
    command: 'show-details',
    value: gistId
  })
})
