<template>
  <vue-final-modal name="selected-game" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['selectedGame']">
    <div v-if="selectedGame().status" class="game-details" :class="selectedGame().status.replace(/ /g, '-').toLowerCase()">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>{{ selectedGame().name }}</h4>
        <h5 class="details-status">
          Status: {{ selectedGame().status }}
        </h5>
        <div v-if="selectedGame().name" class="details-image" :class="selectedGame().name.replace(/ /g, '-').replace(/!/g, '').toLowerCase()" />
        <p v-if="!admin">
          {{ selectedGame().details }}
        </p>
        <p v-if="!admin && selectedGame().link">
          Link: <a :href="selectedGame().link.url">{{ selectedGame().link.text }}</a>
        </p>
        <div v-if="admin">
          <table>
            <tr>
              <td colspan="2">
                <textarea :value="selectedGame().details" id="game-details-edit" @click="updateGameDetails()" />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="btn btn-sm btn-secondary smaller-font" @click="updateGameDetails()">
                  Update
                </button>
              </td>
            </tr>
            <tr>
              <td>
                URL:
              </td>
              <td>
                <input type="text" id="game-link-url-edit" :value="selectedGame().link && selectedGame().link.url">
              </td>
            </tr>
            <tr>
              <td>
                Text:
              </td>
              <td>
                <input type="text" id="game-link-text-edit" :value="selectedGame().link && selectedGame().link.text">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="btn btn-sm btn-secondary smaller-font" @click="updateGameLink()">
                  Update Link
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { $vfm, VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      thisGame: null
    }
  },
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    },
    modals() {
      return this.$store.getters.getModals
    },
    games() {
      return this.$store.getters.getGames
    },
    game() {
      return this.$store.getters.getSelectedGame
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'selectedGame')
    },
    selectedGame() {
      if (!this.thisGame) {
        this.thisGame = this.games.find((g) => {
          return g.name == this.game.name
        })
      }
      return this.thisGame
    },
    updateGameDetails() {
      const game = this.thisGame
      game.details = document.getElementById('game-details-edit').value
      bus.emit('sendUpdateGame', game)
    },
    updateGameLink() {
      const game = this.thisGame
      if (!game.link) {
        game.link = {}
      }
      game.link.url = document.getElementById('game-link-url-edit').value
      game.link.text = document.getElementById('game-link-text-edit').value
      bus.emit('sendUpdateGame', this.selectedGame)
    }
  }
}
</script>
