import { createStore } from 'vuex'

const getAndSort = (games, status) => {
  const arr = []
  for (let i = 0; i < games.length; i++) {
    if (games[i].status == status) {
      arr.push(games[i])
    }
  }
  return arr.sort((a, b) => {
    return b.votes - a.votes
  })
}

export const store = createStore({
  state: {
    session: null,
    userName: '',
    admin: false,
    modals: {
      'feedback': false,
      'selectedGame': false
    },
    games: [],
    statuses: [
      'Started',
      'Suggested',
      'Pie In The Sky',
      'On Hold'
    ]
  },
  getters: {
    getSession: (state) => {
      return state.session
    },
    getUserName: (state) => {
      return state.userName
    },
    getAdmin: (state) => {
      return state.admin
    },
    getModals: (state) => {
      return state.modals
    },
    getSelectedGame: (state) => {
      return state.selectedGame
    },
    getStatuses: (state) => {
      return state.statuses
    },
    getGames: (state) => {
      const arr = []
      for (let i = 0; i < state.statuses.length; i++) {
        const statusArr = getAndSort(state.games, state.statuses[i])
        for (let j = 0; j < statusArr.length; j++) {
          arr.push(statusArr[j])
        }
      }
      return arr
    }
  },
  mutations: {
    updateLogin: (state, payload) => {
      state.session = payload.session
      state.userName = payload.userName
      state.admin = payload.loggedInAsAdmin
    },
    updateAdmin: (state, payload) => {
      state.admin = payload
    },
    showModal: (state, payload) => {
      const modals = Object.keys(state.modals)
      for (let i = 0; i < modals.length; i++) {
        state.modals[modals[i]] = false
      }
      state.modals[payload] = true
    },
    hideModal: (state, payload) => {
      state.modals[payload] = false
    },
    setSelectedGame: (state, payload) => {
      state.selectedGame = payload
    },
    loadGames: (state, payload) => {
      state.games = payload
    },
    loadGame: (state, payload) => {
      const games = []
      for (let i = 0; i < state.games.length; i++) {
        if (payload.name != state.games[i].name) {
          games.push(state.games[i])
        }
      }
      games.push(payload)
      state.games = games
    },
    deleteGame: (state, payload) => {
      const games = []
      for (let i = 0; i < state.games.length; i++) {
        if (payload.name != state.games[i].name) {
          games.push(state.games[i])
        }
      }
      state.games = games
    }
  },
  actions: {
    updateLogin: ({ commit }, payload) => {
      commit('updateLogin', payload)
    },
    updateUserName: ({ commit }, payload) => {
      commit('updateUserName', payload)
    },
    updateAdmin: ({ commit }, payload) => {
      commit('updateAdmin', payload)
    },
    showModal: ({ commit }, payload) => {
      commit('showModal', payload)
    },
    hideModal: ({ commit }, payload) => {
      commit('hideModal', payload)
    },
    loadGames: ({ commit }, payload) => {
      commit('loadGames', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    deleteGame: ({ commit }, payload) => {
      commit('deleteGame', payload)
    },
    setSelectedGame: ({ commit }, payload) => {
      commit('setSelectedGame', payload)
    }
  }
})
