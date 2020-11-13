<template>
  <div id="app" class="mb-4">
    <Header />
    <div class="main">
      <h1>Agile Simulation Labs</h1>
      <div class="container">
        <div class="row">
          <table class="games">
            <thead>
              <tr>
                <th>Game/Sim</th>
                <th>Status</th>
                <th>Popularity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(game, index) in games" :key="index">
                <td class="left">
                  {{ game.name }}
                </td>
                <td>{{ game.status }}</td>
                <td><i class="far fa-thumbs-up" /> {{ game.votes }}</td>
              </tr>
            </tbody>
          </table>
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
  .games {
    margin: 0 auto;

    td {
      padding: 12px;

      &.left {
        text-align: left;
      }
    }
  }

</style>
