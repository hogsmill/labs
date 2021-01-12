import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    host: false,
    games: [
      /*
      { name: 'Niko Niko', status: 'Suggested', votes: 1 },
      { name: 'Dependencies', status: 'Suggested', votes: 1 },
      { name: 'Lego Flow', status: 'On Hold', votes: 0 },
      { name: 'Game A', status: 'On Hold', votes: 4 },
      { name: 'Game B', status: 'On Hold', votes: 7 },
      { name: 'Game C', status: 'On Hold', votes: 2 },
      { name: 'Game D', status: 'On Hold', votes: 10 },
      { name: 'Game E', status: 'On Hold', votes: 9 },
      { name: 'Game F', status: 'On Hold', votes: 8 },
      { name: 'Game G', status: 'On Hold', votes: 5 },
      { name: 'Game H', status: 'On Hold', votes: 7 }
      */
    ]
  },
  getters: {
    getHost: (state) => {
      return state.host
    },
    getGames: (state) => {
      return state.games.sort(function(a, b) {
        return b.votes - a.votes
      })
    }
  },
  mutations: {
    updateHost: (state, payload) => {
      state.host = payload
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
    }
  }
})
