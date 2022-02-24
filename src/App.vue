<template>
  <div id="app" class="mb-4">
    <Header />
    <div class="main">
      <div class="container">
        <div v-if="admin" class="new-game">
          <span>Name: </span>
          <input type="text" id="new-game-name">
          <span>Status: </span>
          <select id="new-game-status">
            <option v-for="(status, index) in statuses" :key="index">
              {{ status }}
            </option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="addGame()">
            Add Game
          </button>
        </div>
        <div class="row">
          <div v-for="(game, index) in games" :key="index" class="game-holder" :class="game.status.replace(/ /g, '-').toLowerCase()">
            <div class="game rounded">
              <h4 class="rounded">
                {{ game.name }}
                <i class="fas fa-info-circle info" title="What is this?" @click="setSelectedGame(game)" />
              </h4>
              <h5>
                Status:
                <span v-if="!admin">{{ game.status }}</span>
                <div v-if="admin">
                  <select :id="'game-status-' + game._id" :value="game.status">
                    <option v-for="(status, sindex) in statuses" :key="sindex">
                      {{ status }}
                    </option>
                  </select>
                  <button class="btn btn-sm btn-secondary smaller-font" @click="changeGameStatus(game)">
                    Update
                  </button>
                </div>
              </h5>
              <p>
                Votes: <i class="far fa-thumbs-up votes" @click="voteFor(game)" /> {{ game.votes }}
              </p>
              <p v-if="admin">
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
    <Modals />
  </div>
</template>

<script>
import bus from './socket.js'

import params from './lib/params.js'

import Header from './components/Header.vue'
import Modals from './components/Modals.vue'

export default {
  name: 'App',
  components: {
    Header,
    Modals
  },
  data() {
    return {
      selectedGame: {}
    }
  },
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    },
    games() {
      return this.$store.getters.getGames
    },
    statuses() {
      return this.$store.getters.getStatuses
    }
  },
  created() {
    bus.emit('sendLoadGames')

    bus.on('loadGames', (data) => {
      this.$store.dispatch('loadGames', data)
    })

    bus.on('loadGame', (data) => {
      this.$store.dispatch('loadGame', data)
    })

    bus.on('deleteGame', (data) => {
      this.$store.dispatch('deleteGame', data)
    })

    if (location.hostname == 'localhost' && params.isParam('host')) {
      this.$store.dispatch('updateAdmin', true)
    }
  },
  methods: {
    image(game) {
      return '\'url("./assets/img/games/' + game.name + '.jpg")\''
    },
    addGame() {
      const name = document.getElementById('new-game-name').value
      const status = document.getElementById('new-game-status').value
      bus.emit('sendAddGame', {name: name, status: status})
    },
    changeGameStatus(game) {
      game.status = document.getElementById('game-status-' + game._id).value
      bus.emit('sendUpdateGame', game)
    },
    deleteGame(game) {
      bus.emit('sendDeleteGame', game)
    },
    downVoteGame(game) {
      bus.emit('sendDownVoteGame', game)
    },
    voteFor(game) {
      bus.emit('sendVoteFor', game)
    },
    setSelectedGame(game) {
      this.$store.dispatch('setSelectedGame', game)
      this.$store.dispatch('showModal', 'selectedGame')
    }
  }
}
</script>

<style lang="scss">

  $orange: #f4511e;
  $pie-in-the-sky: lightblue;
  $on-hold: #bbb;

  body {
    background-image: url("./assets/img/lab.jpg");
    background-size: cover;
  }

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

      &.started .game {
        background-color: dodgerblue;
      }
      .game {
        box-shadow: 5px 5px 5px #444;
        background-color: lightgrey;
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
      &.pie-in-the-sky {
        div {
          background-color: $pie-in-the-sky;
        }
      }
      &.on-hold {
        div {
          background-color: $on-hold;
          opacity: 0.7;
        }
      }
    }

    .votes {
      &:hover {
        cursor: pointer;
        font-weight: bold;
      }
    }

    .info {
      color: #aaa;
      &:hover {
        cursor: pointer;
        color: $orange;
      }
    }
  }

  .game-details {
    background-color: #fff;
    color: #2c3e50;
    height: 100%;

    .link-table {
      margin: 0 6px 0 auto;
    }

    &.pie-in-the-sky {
      border-color: $pie-in-the-sky;
    }
    &.on-hold {
      border-color: $on-hold;
    }
    p {
      text-align: left;
      padding: 6px;
    }

    .details-status {
      color: #fff;
      background-color: #2c3e50;
      padding: 6px;
    }

    .details-image {
      margin: 0 12px 12px 6px;
      float: left;
      width: 50%;
      height: 150px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
      background-position-y: center;

      &.niko-niko {
        background-image: url("./assets/img/games/Niko Niko.jpg");
      }
      &.dependencies {
        background-image: url("./assets/img/games/Dependencies.jpg");
      }
      &.lego-flow {
        background-image: url("./assets/img/games/Lego Flow.jpg");
      }
      &.communication {
        background-image: url("./assets/img/games/Communication.jpg");
      }
      &.risk-retro {
        background-image: url("./assets/img/games/Risk Retro.jpg");
      }
      &.health-check {
        background-image: url("./assets/img/games/Health Check.jpg");
      }
      &.alhambra {
        background-image: url("./assets/img/games/Alhambra.jpg");
      }
      &.the-pipeline-game {
        background-image: url("./assets/img/games/The Pipeline Game.jpg");
      }
      &.the-bug-game {
        background-image: url("./assets/img/games/zero bugs.png");
      }
      &.subtraction {
        background-image: url("./assets/img/games/subtraction.png");
      }
      &.minesweeper {
        background-image: url("./assets/img/games/minesweeper.png");
      }
      &.values-map {
        background-image: url("./assets/img/games/values radar.jpg");
      }
      &.the-appraisals-game {
        background-image: url("./assets/img/games/appraisals.jpg");
      }
    }
  }

</style>
