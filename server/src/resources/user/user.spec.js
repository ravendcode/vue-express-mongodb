import request from 'supertest'
import app from '../../app'
import User from './user.model'

const data = {
  name: 'test',
  email: 'test@email.com',
  password: 'qwerty',
}

const url = '/api/user'

function createUser(data) {
  return request(app)
    .post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
}

describe('API', () => {
  describe(`GET ${url}`, () => {
    test('should respond status and data', async () => {
      const res = await request(app).get(url)
      expect(res.status).toEqual(200)
      expect(res.body).toEqual([])
      // expect(res.body).toHaveProperty('users')
    })
  })
  describe(`POST ${url}`, () => {
    test('should respond status and data', async () => {
      const res = await createUser(data)
      expect(res.status).toEqual(201)
      expect(res.body.name).toEqual(data.name)
      expect(res.body.email).toEqual(data.email)
    })
    test('should respond validation error', async () => {
      const res = await createUser({
        password: 'qwerty'
      })
      expect(res.status).toEqual(422)
      expect(res.body.error.type).toEqual('ValidationError')
      expect(res.body.error.message).toHaveProperty('name')
      expect(res.body.error.message).toHaveProperty('email')
    })
  })
  describe(`GET ${url} by id`, () => {
    test('should respond status and data', async () => {
      await createUser(data)
      const user = await User.findOne({
        email: data.email
      })
      const res = await request(app).get(url + '/' + user.id)
      expect(res.status).toEqual(200)
      expect(res.body._id).toEqual(user.id)
    })
  })
  describe(`PATCH ${url} by id`, () => {
    test('should respond status and data', async () => {
      await createUser(data)
      const user = await User.findOne({
        email: data.email
      })
      const updateData = {
        email: 'test2@email.com'
      }
      const res = await request(app)
        .patch(url + '/' + user.id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(updateData)
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('email')
      expect(res.body.email).toEqual(updateData.email)
    })
  })
  describe(`DELETE ${url} by id`, () => {
    test('should respond status and data', async () => {
      await createUser(data)
      const user = await User.findOne({
        email: data.email
      })
      const res = await request(app).del(url + '/' + user.id)
      expect(res.status).toEqual(204)
    })
  })
})
