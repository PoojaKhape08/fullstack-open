const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Pooja',
    url: 'https://example.com/1',
    likes: 5
  },
  {
    title: 'JavaScript is fun',
    author: 'Robert C. Martin',
    url: 'https://example.com/2',
    likes: 10
  },
  {
    title: 'React is powerful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/3',
    likes: 7
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}