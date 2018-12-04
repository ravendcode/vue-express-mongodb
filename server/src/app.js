import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import config from './config'
import db from './databases/connections/mongoose'

const app = express()

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100,
  message: {
    statusCode: 429,
    error: {
      type: 'TooManyRequestsError',
      message: 'Rate limiting',
    },
  },
})

app.use(limiter)

app.use(require('./middleware/throw').default)

app.use(morgan(config.env === 'production' ? 'short' : 'dev'))
app.locals.pretty = config.env === 'development'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.db = db
  next()
})

app.use(express.static(config.publicDir))

app.use(require('./config/routes').default)

app.all('*', require('./middleware/spa').default)

app.use(require('./middleware/error').default)

export default app
