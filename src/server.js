const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'

const currentAction = ''
const currentData = ''
ON_DEATH((signal, err) => {
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
  fs.appendFile(logFile, logStr, (err) => {
    if (err) console.log(logStr)
    process.exit()
  })
})

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/agilesimulations.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 2500

const emit = (event, data) => {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err
  const db = client.db('db')

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

    socket.on('sendLoadGames', () => { dbStore.loadGames(db, io, debugOn) })

    socket.on('sendAddGame', (data) => { dbStore.addGame(db, io, data, debugOn) })

    socket.on('sendUpdateGame', (data) => { dbStore.updateGame(db, io, data, debugOn) })

    socket.on('sendDeleteGame', (data) => { dbStore.deleteGame(db, io, data, debugOn) })

    socket.on('sendDownVoteGame', (data) => { dbStore.downVoteGame(db, io, data, debugOn) })

    socket.on('sendVoteFor', (data) => { dbStore.voteFor(db, io, data, debugOn) })
  })
})

const port = process.argv[2] || 3013

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
