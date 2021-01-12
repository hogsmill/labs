
function newGame(game) {
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

  loadGames: function(err, client, db, io, debugOn) {

    if (debugOn) { console.log('loadGames') }

    db.collection('labs').find().toArray(function(err, res) {
      if (err) throw err
      if (res) {
        io.emit('loadGames', res)
      }
    })
  },

  addGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addGame', data) }

    const game = {
      name: data.name,
      status: data.status,
      votes: 0
    }
    db.collection('labs').insertOne(game, function(err, res) {
      if (err) throw err
      io.emit('loadGame', game)
    })
  },

  updateGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateGame', data) }

    db.collection('labs').findOne({name: data.name}, function(err, res) {
      if (err) throw err
      if (res) {
        res.votes = res.votes - 1
        const id = res._id
        delete data._id
        db.collection('labs').updateOne({'_id': id}, {$set: data}, function(err, rec) {
          if (err) throw err
          io.emit('loadGame', data)
        })
      }
    })
  },

  deleteGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGame', data) }

    db.collection('labs').deleteOne({name: data.name}, function(err, res) {
      if (err) throw err
      io.emit('deleteGame', data)
    })
  },

  downVoteGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('downVoteGame', data) }

    db.collection('labs').findOne({name: data.name}, function(err, res) {
      if (err) throw err
      if (res) {
        res.votes = res.votes - 1
        const id = res._id
        delete res._id
        db.collection('labs').updateOne({'_id': id}, {$set: res}, function(err, rec) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  voteFor: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('voteFor', data) }

    db.collection('labs').findOne({name: data.name}, function(err, res) {
      if (err) throw err
      if (res) {
        res.votes = res.votes + 1
        const id = res._id
        delete res._id
        db.collection('labs').updateOne({'_id': id}, {$set: res}, function(err, rec) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  }

}
