const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})

  const user = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(user)
    .expect(201)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password123'
    })
    .expect(200)

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(Array.isArray(response.body), true)
})

test('blog posts have an id property', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length > 0, true)

  response.body.forEach(blog => {
    assert.strictEqual(blog.id !== undefined, true)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Pooja',
    url: 'https://example.com/new-blog',
    likes: 5
  }

  const responseBefore = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const responseAfter = await api.get('/api/blogs')

  assert.strictEqual(
    responseAfter.body.length,
    responseBefore.body.length + 1
  )
})

test('a blog without likes has likes set to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Pooja',
    url: 'https://example.com/blog'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without title is not added', async () => {
  const newBlog = {
    author: 'Pooja',
    url: 'https://example.com/blog',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog without url is not added', async () => {
  const newBlog = {
    title: 'Blog without url',
    author: 'Pooja',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog cannot be added without a token', async () => {
  const newBlog = {
    title: 'Blog without token',
    author: 'Pooja',
    url: 'https://example.com/blog',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'Blog to delete',
    author: 'Pooja',
    url: 'https://example.com/delete',
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogToDelete = response.body

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(blog => blog.id)

  assert(!ids.includes(blogToDelete.id))
})

test('a blog can be updated', async () => {
  const newBlog = {
    title: 'Blog to update',
    author: 'Pooja',
    url: 'https://example.com/update',
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogToUpdate = response.body

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 10
  }

  const updateResponse = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(
    updateResponse.body.likes,
    blogToUpdate.likes + 10
  )

  const blogsAtEnd = await helper.blogsInDb()

  const updatedBlogInDb = blogsAtEnd.find(
    blog => blog.id === blogToUpdate.id
  )

  assert.strictEqual(
    updatedBlogInDb.likes,
    blogToUpdate.likes + 10
  )
})

after(async () => {
  await mongoose.connection.close()
})