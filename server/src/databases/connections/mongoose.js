/* eslint-disable no-console */
import mongoose from 'mongoose'
import config from '../../config'

const debug = require('debug')('app:mongodb')

const options = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  autoIndex: config.env !== 'production', // Don't build indexes
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 500, // Reconnect every 500ms
  // poolSize: 10, // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // family: 4 // Use IPv4, skip trying IPv6
}

if (process.env.MONGODB_URI === undefined) {
  throw new Error('MONGODB_URI is undefined')
}

mongoose.connect(process.env.MONGODB_URI, options)

if (config.env !== 'production') {
  mongoose.set('debug', true)
}

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Mongoodb connection error:'))
db.once('open', () => {
  debug('connection success')
})

export default db
