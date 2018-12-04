import request from 'supertest'
import app from './app'

// afterEach(() => {

// })

describe('GET /', () => {
  test('should response status 200 and type text/html', async () => {
    const res = await request(app).get('/')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('text/html')
    // expect(res.text).toMatch(/index.html/)
  })
})
