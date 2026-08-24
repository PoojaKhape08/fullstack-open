const { test } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

test('total likes of one blog is correct', () => {
  const blogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com',
      likes: 5
    }
  ]

  const result = listHelper.totalLikes(blogs)

  assert.strictEqual(result, 5)
})

test('favorite blog has the most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 10
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/3',
      likes: 7
    }
  ]

  const result = listHelper.favoriteBlog(blogs)

  assert.deepStrictEqual(result, blogs[1])
})

test('author with most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Robert C. Martin',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Robert C. Martin',
      url: 'https://example.com/2',
      likes: 10
    },
    {
      title: 'Blog 3',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/3',
      likes: 7
    },
    {
      title: 'Blog 4',
      author: 'Robert C. Martin',
      url: 'https://example.com/4',
      likes: 12
    }
  ]

  const result = listHelper.mostBlogs(blogs)

  assert.deepStrictEqual(result, {
    author: 'Robert C. Martin',
    blogs: 3
  })
})

test('author with most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/1',
      likes: 10
    },
    {
      title: 'Blog 2',
      author: 'Robert C. Martin',
      url: 'https://example.com/2',
      likes: 5
    },
    {
      title: 'Blog 3',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/3',
      likes: 7
    }
  ]

  const result = listHelper.mostLikes(blogs)

  assert.deepStrictEqual(result, {
    author: 'Edsger W. Dijkstra',
    likes: 17
  })
})

