import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3013'
} else {
  connStr = 'https://agilesimulations.co.uk:3013'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Send

bus.$on('sendLoadGames', () => { socket.emit('sendLoadGames') })

bus.$on('sendUpdateGame', (data) => { socket.emit('sendUpdateGame', data) })

bus.$on('sendAddGame', (data) => { socket.emit('sendAddGame', data) })

bus.$on('sendDeleteGame', (data) => { socket.emit('sendDeleteGame', data) })

bus.$on('sendDownVoteGame', (data) => { socket.emit('sendDownVoteGame', data) })

bus.$on('sendVoteFor', (data) => { socket.emit('sendVoteFor', data) })

// Receive

socket.on('loadGames', (data) => { bus.$emit('loadGames', data) })

socket.on('loadGame', (data) => { bus.$emit('loadGame', data) })

socket.on('deleteGame', (data) => { bus.$emit('deleteGame', data) })

export default bus
