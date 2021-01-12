const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'

let currentAction = ''
let currentData = ''
ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (currentAction) {
    logStr = logStr + '  Action: ' + currentAction + '\n'
  }
  if (currentData) {
    logStr = logStr + '  Data: ' + currentData + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 2500

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  currentAction = fun
  currentData = data
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'loadGames':
        dbStore.loadGames(err, client, db, io, debugOn)
        break
      case 'addGame':
        dbStore.addGame(err, client, db, io, data, debugOn)
        break
      case 'deleteGame':
        dbStore.deleteGame(err, client, db, io, data, debugOn)
        break
      case 'downVoteGame':
        dbStore.downVoteGame(err, client, db, io, data, debugOn)
        break
      case 'voteFor':
        dbStore.voteFor(err, client, db, io, data, debugOn)
        break
    }
  })
}
io.on('connection', (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  }

  socket.on('disconnect', () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  })

  socket.on('loadGames', () => { doDb('loadGames') })

  socket.on('addGame', (data) => { doDb('addGame', data) })

  socket.on('deleteGame', (data) => { doDb('deleteGame', data) })

  socket.on('downVoteGame', (data) => { doDb('downVoteGame', data) })

  socket.on('voteFor', (data) => { doDb('voteFor', data) })

})

const port = process.argv[2] || 3013

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
