const hetmet = require('helmet')
const dotenv = require('dotenv')
const express = require('express')
const app = express()

const errorMiddleware = require('./utils/errorHandler')
const { connectDatabase } = require('./config/database')
const CustomError = require('./utils/customError')

// enabling .env support
dotenv.config()

// connect db
connectDatabase()

// middlewares
app.use(hetmet())
app.use(express.json())

// handle routes
app.get('/api', (req, res) => {
    return res.send('node api working!')
})

// handle errors
// app.use(errorMiddleware)
app.all('*', (req, res, next) => {
    return next(new CustomError('route not found', 404))
})

module.exports = app
