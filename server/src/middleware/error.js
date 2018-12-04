import _ from 'lodash'
import config from '../config'

export default (err, req, res, next) => {
  if (!err) {
    next()
    return
  }
  let statusCode = err.statusCode || 500
  let errorName
  let errorMessage
  let mongooseError = {}
  if (err.name === 'ValidationError') {
    statusCode = 422
    for (const field in err.errors) {
      mongooseError[field] = err.errors[field].message
    }
  }
  switch (statusCode) {
    case 400:
      errorName = 'BadRequestError'
      errorMessage = 'Bad Request'
      break
    case 401:
      errorName = 'UnauthorizedError'
      errorMessage = 'Unauthorized'
      break
    case 403:
      errorName = 'ForbiddenError'
      errorMessage = 'Forbidden'
      break
    case 404:
      errorName = 'NotFoundError'
      errorMessage = 'Not Found'
      break
    case 422:
      errorName = 'ValidationError'
      errorMessage = 'Validation Error'
      break
    case 500:
      errorName = 'InternalServerError'
      errorMessage = 'Internal Server Error'
      break
    default:
      errorName = 'InternalServerError'
      errorMessage = 'Internal Server Error'
      statusCode = 500
      break
  }
  const result = {
    statusCode,
    error: {
      type: errorName,
    },
  }
  if (err.message && typeof err.message === 'string') {
    result.error.message = err.message.charAt(0).toUpperCase() + err.message.slice(1)
  } else if (typeof err.message === 'object') {
    result.error.message = err.message
  } else {
    result.error.message = errorMessage
  }
  if (!_.isEmpty(mongooseError)) {
    result.error.message = mongooseError
  }
  if (result.statusCode === 500 && config.env === 'development') {
    result.error.stack = err.stack
  }

  res.status(result.statusCode)
  res.send({ ...result })
  // if (/^\/api/.test(req.path)) {
  //   res.send({ ...result })
  // } else {
  //   res.render('error', { ...result })
  // }
}
