<template>
  <div id="app" class="mb-4">
    <Header />
    <div class="main">
      <div class="container">
        <div v-if="isHost" class="new-game">
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
        <div v-for="(game, index) in games" :key="index" class="row ">
          <div v-if="selectedGame == game.name" class="game-details rounded" :class="game.status.replace(/ /g, '-').toLowerCase()">
            <div class="float-right mr-2 mt-1">
              <button type="button" class="close" @click="setSelectedGame('')" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <h4>
              {{ game.name }}
            </h4>
            <h5 class="details-status">
              Status: {{ game.status }}
            </h5>
            <div class="details-image" :class="game.name.replace(/ /g, '-').toLowerCase()" />
            <p v-if="!isHost">
              {{ game.details }}
            </p>
            <p v-if="!isHost && game.link">
              Link: <a :href="game.link.url">{{ game.link.text }}</a>
            </p>
            <textarea v-if="isHost" :value="game.details" :id="'game-details-' + game._id" />
            <button v-if="isHost" class="btn btn-sm btn-secondary smaller-font" @click="updateGameDetails(game)">
              Update
            </button>
            <table v-if="isHost" class="link-table">
              <tr>
                <td>
                  Link:
                </td>
                <td>
                  <input type="text" :id="'game-link-url-' + game._id" :value="game.link && game.link.url">
                </td>
              </tr>
              <tr>
                <td>
                  Text:
                </td>
                <td>
                  <input type="text" :id="'game-link-text-' + game._id" :value="game.link && game.link.text">
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button class="btn btn-sm btn-secondary smaller-font" @click="updateGameLink(game)">
                    Update Link
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div v-if="!selectedGame" class="row">
          <div v-for="(game, index) in games" :key="index" class="game-holder" :class="game.status.replace(/ /g, '-').toLowerCase()">
            <div class="game rounded">
              <h4 class="rounded">
                {{ game.name }}
                <i class="fas fa-info-circle info" title="What is this?" @click="setSelectedGame(game.name)" />
              </h4>
              <h5>
                Status:
                <span v-if="!isHost">{{ game.status }}</span>
                <div v-if="isHost">
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
import bus from './socket.js'

import params from './lib/params.js'

import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  data() {
    return {
      selectedGame: ''
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    games() {
      return this.$store.getters.getGames
    },
    statuses() {
      return this.$store.getters.getStatuses
    }
  },
  created() {
    bus.$emit('sendLoadGames')

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    bus.$on('loadGames', (data) => {
      this.$store.dispatch('loadGames', data)
    })

    bus.$on('loadGame', (data) => {
      this.$store.dispatch('loadGame', data)
    })

    bus.$on('deleteGame', (data) => {
      this.$store.dispatch('deleteGame', data)
    })
  },
  methods: {
    image(game) {
      return '\'url("./assets/img/games/' + game.name + '.jpg")\''
    },
    addGame() {
      const name = document.getElementById('new-game-name').value
      const status = document.getElementById('new-game-status').value
      bus.$emit('sendAddGame', {name: name, status: status})
    },
    changeGameStatus(game) {
      game.status = document.getElementById('game-status-' + game._id).value
      bus.$emit('sendUpdateGame', game)
    },
    updateGameDetails(game) {
      game.details = document.getElementById('game-details-' + game._id).value
      bus.$emit('sendUpdateGame', game)
    },
    updateGameLink(game) {
      if (!game.link) {
        game.link = {}
      }
      game.link.url = document.getElementById('game-link-url-' + game._id).value
      game.link.text = document.getElementById('game-link-text-' + game._id).value
      bus.$emit('sendUpdateGame', game)
    },
    deleteGame(game) {
      bus.$emit('sendDeleteGame', game)
    },
    downVoteGame(game) {
      bus.$emit('sendDownVoteGame', game)
    },
    voteFor(game) {
      bus.$emit('sendVoteFor', game)
    },
    setSelectedGame(game) {
      this.selectedGame = game
    }
  }
}
</script>

<style lang="scss">

  $orange: #f4511e;
  $pie-in-the-sky: lightblue;
  $on-hold: #bbb;

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
        box-shadow: 5px 5px 5px #ccc;
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
          opacity: 0.4;
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
        color: #444;
      }
    }
  }

  .game-details {
    box-shadow: 5px 5px 5px #ccc;
    background-color: #fff;
    color: #2c3e50;
    border: 8px solid $orange;
    margin: 24px auto;
    width: 50%;

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
    }
  }

</style>
