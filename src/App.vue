<template>
  <div id="app" class="mb-4">
    <Header />
    <div class="main">
      <h1>Agile Simulation Labs</h1>
      <div class="container">
        <div class="row">
          <div v-for="(game, index) in games" :key="index" class="game-holder">
            <div class="game rounded">
              <h4 class="rounded">
                {{ game.name }}
              </h4>
              <h5>Status: {{ game.status }}</h5>
              <p>
                Votes: <i class="far fa-thumbs-up" /> {{ game.votes }}
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

import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
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
  },
  methods: {
  }
}
</script>

<style lang="scss">
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

  }
</style>
