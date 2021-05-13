import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let getAndSort = (games, status) => {
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

export const store = new Vuex.Store({
  state: {
    host: false,
    games: [],
    statuses: [
      'Started',
      'Suggested',
      'Pie In The Sky',
      'On Hold'
    ]
  },
  getters: {
    getHost: (state) => {
      return state.host
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
    updateHost: (state, payload) => {
      state.host = payload
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
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
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
