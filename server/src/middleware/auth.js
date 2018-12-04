import User from '../resources/user/user.model'

export const login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.send({ ...user.toJSON(), accessToken: user.accessToken })
  } catch (err) {
    next(err)
  }
}

export const me = (req, res) => {
  res.send(req.user)
}

export const jwtMdw = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.replace('Bearer ', '')
    } else if (req.query && req.query.token) {
      token = req.query.token
    }
    if (token) {
      const user = await User.findByToken(token)
      if (user) {
        req.user = user
        return next()
      }
    }
    res.throw(401, 'Invalid access token')
  } catch (err) {
    next(err)
  }
}
