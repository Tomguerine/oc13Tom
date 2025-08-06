const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let app
let mongoServer
let token

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  process.env.DATABASE_URL = mongoServer.getUri()
  process.env.SECRET_KEY = 'testsecret'
  process.env.NODE_ENV = 'test'
  app = require('../server')
  await require('../database/connection')()

  await request(app).post('/api/v1/user/signup').send({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'pass123'
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('User routes', () => {
  test('login returns a token', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'test@example.com', password: 'pass123' })
      .expect(200)
    expect(res.body.body.token).toBeDefined()
    token = res.body.body.token
  })

  test('login with wrong password fails', async () => {
    await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'test@example.com', password: 'wrongpass' })
      .expect(401)
  })

  test('login with unknown email fails', async () => {
    await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'nouser@example.com', password: 'pass123' })
      .expect(401)
  })

  test('get profile with valid token', async () => {
    const res = await request(app)
      .post('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(res.body.body.email).toBe('test@example.com')
  })

  test('update profile with valid token', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'New', lastName: 'Name' })
      .expect(200)
    expect(res.body.body.firstName).toBe('New')
  })

  test('profile request missing token', async () => {
    const res = await request(app)
      .post('/api/v1/user/profile')
      .expect(401)
    expect(res.body.message).toMatch(/Token is missing/)
  })

  test('profile request invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/user/profile')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401)
    expect(res.body.message).toMatch(/Token is missing/)
  })

  test('update profile missing token', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .send({ firstName: 'A', lastName: 'B' })
      .expect(401)
    expect(res.body.message).toMatch(/Token is missing/)
  })

  test('update profile invalid token', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', 'Bearer badtoken')
      .send({ firstName: 'A', lastName: 'B' })
      .expect(401)
    expect(res.body.message).toMatch(/Token is missing/)
  })
})
