import io from 'socket.io-client'
import bus from './EventBus'

const prod = location.hostname != 'localhost'

let asConnStr, connStr
if (!prod) {
  asConnStr = 'http://localhost:3099'
  connStr = 'http://localhost:3013'
} else {
  asConnStr = 'https://agilesimulations.co.uk:3099'
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

const connectToAgileSimulations = location.hostname != 'localhost'
let asSocket
if (connectToAgileSimulations) {
  console.log('Connecting to: ' + asConnStr)
  asSocket = io(asConnStr)
}

// Agile Simulations (login)

if (connectToAgileSimulations) {

  bus.$on('sendCheckLogin', (data) => { asSocket.emit('sendCheckLogin', data) })

  bus.$on('sendRating', (data) => { asSocket.emit('sendRating', data) })

  asSocket.on('loginSuccess', (data) => { bus.$emit('loginSuccess', data) })

  asSocket.on('logout', (data) => { bus.$emit('logout', data) })
}

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
