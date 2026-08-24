const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('a valid user can be created', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, 'testuser')
  assert.strictEqual(response.body.name, 'Test User')
})

test('user password is stored as a hash', async () => {
  const newUser = {
    username: 'hashtestuser',
    name: 'Hash Test User',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const user = await User.findOne({ username: 'hashtestuser' })

  assert.strictEqual(user.passwordHash !== 'password123', true)
  assert.strictEqual(user.passwordHash.length > 0, true)
})

test('user with too short username is not created', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('user with too short password is not created', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Short Password',
    password: 'ab'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('user without username is not created', async () => {
  const newUser = {
    name: 'No Username',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('user without password is not created', async () => {
  const newUser = {
    username: 'nopassword',
    name: 'No Password'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('username must be unique', async () => {
  const firstUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(firstUser)
    .expect(201)

  const duplicateUser = {
    username: 'testuser',
    name: 'Another User',
    password: 'anotherpassword'
  }

  await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})