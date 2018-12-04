import mongoose from 'mongoose'
import _ from 'lodash'
import User from './user.model'

export default {
  async findByParam(req, res, next, id) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await User.findById(id)
        if (user) {
          req.user = user
          return next()
        }
      }
      res.throw(404)
    } catch (err) {
      next(err)
    }
  },
  async getAll(req, res, next) {
    try {
      const users = await User.find()
      res.send(users)
    } catch (err) {
      next(err)
    }
  },
  async createOne(req, res, next) {
    try {
      let body = _.pick(req.body, ['name', 'email', 'password'])
      const newUser = new User(body)
      const nameUnique = await User.findOne({ name: newUser.name })
      if (nameUnique) {
        res.throw(422, { name: `${newUser.name} already taken` })
      }
      const emailUnique = await User.findOne({ name: newUser.email })
      if (emailUnique) {
        res.throw(422, { email: `${newUser.email} already taken` })
      }
      newUser.roles = ['ROLE_USER']
      await newUser.hashedPassword(body.password)
      await newUser.generateAccessToken()
      await newUser.save()
      res.status(201)
      res.send({ ...newUser.toJSON(), accessToken: newUser.accessToken })
    } catch (err) {
      next(err)
    }
  },
  getOne(req, res) {
    res.send(req.user)
  },
  async updateOne(req, res, next) {
    try {
      let body = _.pick(req.body, ['name', 'email'])
      if (req.user.email !== body.email) {
        // req.user.$ignore('email')
        if ('email' in body) {
          let email = body.email.toLowerCase()
          const emailUnique = await User.findOne({ email })
          if (emailUnique) {
            res.throw(422, { email: `${body.email} already taken` })
          }
        }
      }
      _.extend(req.user, body)
      await req.user.save()
      res.status(201)
      res.send(req.user)
    } catch (err) {
      next(err)
    }
  },
  async deleteOne(req, res, next) {
    try {
      await req.user.remove()
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  },
}
