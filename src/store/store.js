import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    games: [
      { name: 'Niko Niko', status: 'Suggested', votes: 1 },
      { name: 'Team Dependency', status: 'Suggested', votes: 1 },
      { name: 'Lego Flow', status: 'On Hold', votes: 0 },
      /* { name: 'Game A', status: 'On Hold', votes: 0 },
      { name: 'Game B', status: 'On Hold', votes: 0 },
      { name: 'Game C', status: 'On Hold', votes: 0 },
      { name: 'Game D', status: 'On Hold', votes: 0 },
      { name: 'Game E', status: 'On Hold', votes: 0 },
      { name: 'Game F', status: 'On Hold', votes: 0 },
      { name: 'Game G', status: 'On Hold', votes: 0 },
      { name: 'Game H', status: 'On Hold', votes: 0 }
      */
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
