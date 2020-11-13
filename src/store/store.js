import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    games: [
      { name: 'Niko Niko', status: 'Suggested', votes: 1 },
      { name: 'Team Dependency', status: 'Suggested', votes: 1 },
      { name: 'Lego Flow', status: 'On Hold', votes: 0 }
    ]
  },
  getters: {
    getGames: (state) => {
      return state.games
    }
  },
  mutations: {
    //updateGame: (state, payload) => {
    //  state.host = payload
    //}
    //}
  },
  actions: {
    //updateHost: ({ commit }, payload) => {
    //  commit('updateHost', payload)
    //}
  }
})
