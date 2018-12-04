import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

/*
  Define clearDB function that will loop through all
  the collections in our mongoose connection and drop them.
*/
function clearDB(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function () {})
  }
  return done()
}

beforeEach(function (done) {
  /*
    If the mongoose connection is closed,
    start it up using the test url and database name
    provided by the node runtime ENV
  */
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(
      `${process.env.MONGODB_URI}-test`,
      function (err) {
        if (err) {
          throw err
        }
        return clearDB(done)
      }
    )
  } else {
    return clearDB(done)
  }
})

afterEach(function (done) {
  mongoose.disconnect()
  return done()
})

afterAll(done => {
  return done()
})
