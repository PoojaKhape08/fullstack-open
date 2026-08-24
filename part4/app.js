const express = require('express')

const mongoose = require('mongoose')

const config = require('./utils/config')

const logger = require('./utils/logger')

const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')

const usersRouter = require('./controllers/users')

const loginRouter = require('./controllers/login')

const app = express()

// Connect to MongoDB

logger.info('connecting to MongoDB')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Middleware

app.use(express.json())

app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

// Routes

app.use('/api/blogs', blogsRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

// Other middleware

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app