<template>
  <div id="app" class="mb-4">
    <Header />
    <div class="main">
      <h1>Agile Simulation Labs</h1>
      <div class="container">
        <div v-if="isHost" class="new-game">
          <span>Name: </span>
          <input type="text" id="new-game-name">
          <span>Status: </span>
          <select id="new-game-status">
            <option>Suggested</option>
            <option>On Hold</option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="addGame()">
            Add Game
          </button>
        </div>
        <div class="row">
          <div v-for="(game, index) in games" :key="index" class="game-holder">
            <div class="game rounded">
              <h4 class="rounded">
                {{ game.name }}
              </h4>
              <h5>Status: {{ game.status }}</h5>
              <p>
                Votes: <i class="far fa-thumbs-up votes" @click="voteFor(game)" /> {{ game.votes }}
              </p>
              <p v-if="isHost">
                <button class="btn btn-sm btn-secondary smaller-font" @click="downVoteGame(game)">
                  Vote Down
                </button>
                <button class="btn btn-sm btn-secondary smaller-font" @click="deleteGame(game)">
                  Delete
                </button>
              </p>
            </div>
          </div>
          <div class="game-holder">
            <div class="game suggest rounded">
              <h4 class="rounded">
                Your Game
              </h4>
              <p>
                Suggest a game at <a href="/suggest.html">Suggest A Game</a> and see it voted for here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    games() {
      return this.$store.getters.getGames
    }
  },
  created() {
    const self = this
    let host = '77.68.122.69'
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    const connStr = 'http://' + host + ':3013'
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    this.socket.emit('loadGames')

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    this.socket.on('loadGames', (data) => {
      this.$store.dispatch('loadGames', data)
    })

    this.socket.on('loadGame', (data) => {
      this.$store.dispatch('loadGame', data)
    })

    this.socket.on('deleteGame', (data) => {
      this.$store.dispatch('deleteGame', data)
    })
  },
  methods: {
    addGame() {
      const name = document.getElementById('new-game-name').value
      const status = document.getElementById('new-game-status').value
      this.socket.emit('addGame', {name: name, status: status})
    },
    deleteGame(game) {
      this.socket.emit('deleteGame', game)
    },
    downVoteGame(game) {
      this.socket.emit('downVoteGame', game)
    },
    voteFor(game) {
      this.socket.emit('voteFor', game)
    }
  }
}
</script>

<style lang="scss">
  .new-game {
    margin: 12px;
    padding: 12px;
    border: 1px solid;

    span, button {
      margin-left: 16px;
    }
  }

  .row {
    display: flex;

    .game-holder {
      color: #fff;
      width: 25%;
      padding: 12px;
      display: flex;

      .game {
        box-shadow: 5px 5px 5px #ccc;
        background-color: #f4511e;
        padding: 12px;
        width: 100%;

        h4 {
          background-color: #fff;
          color: #2c3e50;
        }

        &.suggest {
          background-color: #fff;
          color: #2c3e50;
          border: 8px solid #f4511e;
        }
      }
    }

    .votes {
      &:hover {
        cursor: pointer;
        font-weight: bold;
      }
    }

  }
</style>
