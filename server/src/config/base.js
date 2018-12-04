import path from 'path'
import dotenv from 'dotenv'

const debug = require('debug')('app:config')

dotenv.config()

const env = process.env.NODE_ENV || 'development'
const port = env === 'production' ? 80 : process.env.PORT
const serverDir = path.join(__dirname, '../../')
const publicDir = path.join(__dirname, '../../public')

debug(`NODE_ENV is ${env}`)
debug(`APP_NAME is ${process.env.APP_NAME}`)

export {
  env,
  port,
  serverDir,
  publicDir,
}
