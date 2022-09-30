const vscode = acquireVsCodeApi()
const svgCheck =
  '<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m.5 5.5 3 3 8.028-8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(5 6)"/></svg>'

// Selectors
const btnLogin = document.querySelector('.btn-auth')
const btnLogout = document.querySelector('.btn-logout')
const panelLogged = document.querySelector('#panelLogged')
const panelSignIn = document.querySelector('#panelSignIn')
const inputSearch = document.querySelector('.input-search')
const containerListUsers = document.querySelector('.list-users-wrapper')
const containerListFollowers = document.querySelector('.list-followers-wrapper')
const loadingContainerUsers = document.querySelector('.loading-users')
const containerSearchUsers = document.querySelector('#containerSearchUsers')
const containerFollowers = document.querySelector('#containerFollowers')

// Getting the state stored
const previousStateSidebar = vscode.getState()

// Cursor variable which store the last user of array
let USER_CURSOR = null

const getItemUser = (user, action) => {
  let iconButton = ''
  const { id, photoUrl, username, name, gist, gitHubId } = user
  const { identify } = gist ?? { identify: 'eeee' }
  const { followers } = vscode.getState()
  const isFollower = followers?.find((follower) => follower.id === id)

  if (action === 'unfollow') {
    iconButton = `<svg data-followerid="${gitHubId}" data-action="${action}" height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 2)"><path d="m7.5.5c1.65685425 0 3 1.34314575 3 3v2c0 1.65685425-1.34314575 3-3 3s-3-1.34314575-3-3v-2c0-1.65685425 1.34314575-3 3-3z"/><path d="m16.5 4.5h-4"/><path d="m14.5 14.5v-.7281753c0-3.1864098-3.6862915-5.2718247-7-5.2718247s-7 2.0854149-7 5.2718247v.7281753c0 .5522847.44771525 1 1 1h12c.5522847 0 1-.4477153 1-1z"/></g></svg>`
  } else {
    if (!isFollower) {
      iconButton = `<svg id="icon${id}" data-followerid="${gitHubId}" data-action="${action}" height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 2)"><path d="m7.5.5c1.65685425 0 3 1.34314575 3 3v2c0 1.65685425-1.34314575 3-3 3s-3-1.34314575-3-3v-2c0-1.65685425 1.34314575-3 3-3z"/><path d="m14.5 2.5v4"/><path d="m16.5 4.5h-4"/><path d="m14.5 14.5v-.7281753c0-3.1864098-3.6862915-5.2718247-7-5.2718247s-7 2.0854149-7 5.2718247v.7281753c0 .5522847.44771525 1 1 1h12c.5522847 0 1-.4477153 1-1z"/></g></svg>`
    }
  }

  return `
  <div class="user-item" aria-label="${username}" data-gist="${identify}" id="${id}">
    <div class="user-icon" data-gist="${identify}">
      <img src="${photoUrl}" class="user-avatar" alt="${username}" data-gist="${identify}">
    </div>
    <div class="user-details" data-gist="${identify}">
      <span class="user-info ellipsis" data-gist="${identify}">${username}</span>
      <span class="user-last-update ellipsis" data-gist="${identify}">${name}</span>
    </div>
    <div class="user-follow" data-followerid="${gitHubId}" data-action="${action}">${iconButton}</div>
  </div>`
}

const listUsers = (data) => {
  let listItems = ''

  data.forEach((user) => {
    listItems += getItemUser(user, 'follow')
  })
  containerListUsers.innerHTML = listItems
}

const listFollowers = (data) => {
  let listItems = ''

  data.forEach((user) => {
    listItems += getItemUser(user, 'unfollow')
  })
  containerListFollowers.innerHTML = listItems
}

if (previousStateSidebar) {
  const { termSearch, users, followers } = previousStateSidebar
  // The "Search panel" will be showed as long as user was not looking for an extension.
  // Otherwise the panel followers is gonna be showed
  if (termSearch) {
    inputSearch.value = termSearch
    inputSearch.focus()
    containerSearchUsers.classList.remove('hidden')
    containerFollowers.classList.add('hidden')
    if (users) {
      listUsers(users)
      // Track the cursor of current array
      USER_CURSOR = users.at(-1)
    }
  } else {
    // Fetch data from state
    if (followers) {
      listFollowers(followers)
      containerFollowers.classList.remove('hidden')
      containerSearchUsers.classList.add('hidden')
    } else {
      // Fetch data from database
      vscode.postMessage({ command: 'list-followers' })
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
        const followers = vscode.getState().followers ?? []
        vscode.setState({ users: newData, termSearch: termValue, followers })
        listUsers(newData)
        USER_CURSOR = data.at(-1)
      } else if (prevUsers.length === 0) {
        containerListUsers.innerHTML = 'No users found.'
      }
      loadingContainerUsers.classList.remove('loading')
      break
    }
    case 'follow': {
      const data = message.value
      const htmlUser = getItemUser(data, 'unfollow')
      containerListFollowers.insertAdjacentHTML('beforeend', htmlUser)
      // Update svg with check svg
      document.querySelector(`#icon${data.id}`).innerHTML = svgCheck
      const state = vscode.getState()
      if (state) {
        const { followers } = state
        if (followers) {
          followers.push(data)
          vscode.setState({
            ...state,
            followers
          })
        } else {
          vscode.setState({
            ...state,
            followers: [data]
          })
        }
      }

      break
    }
    case 'unfollow': {
      const follower = message.value
      const { id, gitHubId } = follower
      const state = vscode.getState()
      if (state) {
        const { followers } = state
        const currentFollowers = followers.filter((f) => f.gitHubId !== gitHubId)
        vscode.setState({
          ...state,
          followers: currentFollowers
        })
        // Deleting DOM Element
        document.getElementById(id).remove()
      }
      break
    }
    case 'list-followers': {
      const data = message.value
      const { followers } = data[0]
      if (followers.length > 0) {
        const state = vscode.getState()
        if (state) {
          vscode.setState({
            ...state,
            followers
          })
        } else {
          vscode.setState({
            followers
          })
        }
        listFollowers(followers)

        containerFollowers.classList.remove('hidden')
        containerSearchUsers.classList.add('hidden')
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

const filterResults = (termSearch) => {
  const state = vscode.getState()
  const value = {
    textToSearch: termSearch,
    cursor: ''
  }
  let newState = null
  if (state?.followers.length > 0) {
    newState = {
      followers: state.followers,
      termSearch
    }
  } else {
    newState = {
      termSearch
    }
  }
  vscode.setState(newState)
  vscode.postMessage({ command: 'filter', value })
}

/* Filter functionality */
inputSearch.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase()

  if (!searchTerm) {
    containerListUsers.innerHTML = ''
    const { followers } = vscode.getState()
    vscode.setState({
      followers
    })
    containerSearchUsers.classList.add('hidden')
    containerFollowers.classList.remove('hidden')
    return
  }
  containerFollowers.classList.add('hidden')
  containerSearchUsers.classList.remove('hidden')
  updateDebounce(() => filterResults(searchTerm))
})

const searchUser = (gistId) => {
  // const gistId = e.target.dataset.gist
  if (!gistId) return

  vscode.postMessage({
    command: 'show-details',
    value: gistId
  })
}

const followUser = (followerId) => {
  // const gistId = e.target.dataset.gist
  if (!followerId) return

  vscode.postMessage({
    command: 'follow',
    value: followerId
  })
}

containerListUsers.addEventListener('click', (e) => {
  const target = e.target.tagName

  if (target === 'svg') {
    const followerId = e.target.dataset.followerid
    followUser(followerId)
  } else {
    const gistId = e.target.dataset.gist
    searchUser(gistId)
  }
})

containerListFollowers.addEventListener('click', (e) => {
  const data = e.target.dataset
  if (data.action === 'unfollow') {
    const followerId = data.followerid
    vscode.postMessage({
      command: 'unfollow',
      value: followerId
    })
  }
})
