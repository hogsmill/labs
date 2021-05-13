
let newGame = (game) => {
  const name = game.name
  const status = game.status ? game.status : 'Suggested'
  const votes = game.votes ? game.votes : 0

  return {
    name: name,
    status: status,
    votes: votes
  }
}

module.exports = {

  loadGames: (db, io, debugOn) => {

    if (debugOn) { console.log('loadGames') }

    db.collection('labs').find().toArray((err, res) => {
      if (err) throw err
      if (res) {
        io.emit('loadGames', res)
      }
    })
  },

  addGame: (db, io, data, debugOn) => {

    if (debugOn) { console.log('addGame', data) }

    const game = {
      name: data.name,
      status: data.status,
      votes: 0
    }
    db.collection('labs').insertOne(game, (err, res) => {
      if (err) throw err
      io.emit('loadGame', game)
    })
  },

  updateGame: (db, io, data, debugOn) => {

    if (debugOn) { console.log('updateGame', data) }

    db.collection('labs').findOne({name: data.name}, (err, res) => {
      if (err) throw err
      if (res) {
        res.votes = res.votes - 1
        const id = res._id
        delete data._id
        db.collection('labs').updateOne({'_id': id}, {$set: data}, (err, rec) => {
          if (err) throw err
          io.emit('loadGame', data)
        })
      }
    })
  },

  deleteGame: (db, io, data, debugOn) => {

    if (debugOn) { console.log('deleteGame', data) }

    db.collection('labs').deleteOne({name: data.name}, (err, res) => {
      if (err) throw err
      io.emit('deleteGame', data)
    })
  },

  downVoteGame: (db, io, data, debugOn) => {

    if (debugOn) { console.log('downVoteGame', data) }

    db.collection('labs').findOne({name: data.name}, (err, res) => {
      if (err) throw err
      if (res) {
        res.votes = res.votes - 1
        const id = res._id
        delete res._id
        db.collection('labs').updateOne({'_id': id}, {$set: res}, (err, rec) => {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  voteFor: (db, io, data, debugOn) => {

    if (debugOn) { console.log('voteFor', data) }

    db.collection('labs').findOne({name: data.name}, (err, res) => {
      if (err) throw err
      if (res) {
        res.votes = res.votes + 1
        const id = res._id
        delete res._id
        db.collection('labs').updateOne({'_id': id}, {$set: res}, (err, rec) => {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  }

}
