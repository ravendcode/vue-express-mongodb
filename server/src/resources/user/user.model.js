import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import _ from 'lodash'

const UserSchema = new mongoose.Schema({
  accessToken: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
})

UserSchema.methods.toJSON = function () {
  let user = this.toObject()
  return _.pick(user, ['_id', 'email', 'name', 'roles', 'createdAt', 'updatedAt'])
}

UserSchema.methods.hashedPassword = async function (password) {
  if (process.env.SALT_ROUNDS === undefined) {
    throw new Error('SALT_ROUNDS is undefined')
  }
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
  this.password = await bcrypt.hash(password, saltRounds)
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this

  return User.findOne({
    email
  }).then((user) => {
    let error = new Error('Incorrect email or password')
    error.statusCode = 422
    if (!user) {
      return Promise.reject(error)
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          reject(err)
        }
        if (res) {
          resolve(user)
        } else {
          reject(error)
        }
      })
    })
  })
}

UserSchema.statics.findByToken = async function (token) {
  let User = this
  if (process.env.SECRET_KEY === undefined) {
    throw new Error('SECRET_KEY is undefined')
  }
  const decode = await jwt.verify(token, process.env.SECRET_KEY)
  return User.findOne({
    _id: decode.id,
    accessToken: token
  })
}

UserSchema.methods.generateAccessToken = async function () {
  let user = this
  if (process.env.SECRET_KEY === undefined) {
    throw new Error('SECRET_KEY is undefined')
  }
  user.accessToken = await jwt.sign({ id: user.id }, process.env.SECRET_KEY)
}

export default mongoose.model('User', UserSchema)
