const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

// GET all blogs

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(blogs)
})

// POST a new blog

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const body = request.body
      const user = request.user

      const blog = new Blog({
        ...body,
        user: user._id
      })

      const savedBlog = await blog.save()

      await user.updateOne({
        $push: {
          blogs: savedBlog._id
        }
      })

      response.status(201).json(savedBlog)
    } catch (error) {
      next(error)
    }
  }
)

// DELETE a blog

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user

      const blog = await Blog.findById(request.params.id)

      if (!blog) {
        return response.status(404).end()
      }

      if (!blog.user) {
        return response.status(400).json({
          error: 'blog has no user'
        })
      }

      if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({
          error: 'only the creator can delete the blog'
        })
      }

      await Blog.findByIdAndDelete(request.params.id)

      response.status(204).end()
    } catch (error) {
      next(error)
    }
  }
)

// UPDATE a blog

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogsRouter