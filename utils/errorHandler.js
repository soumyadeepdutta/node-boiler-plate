const errorhandler = require('./customError')

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            // stack: err.stack,
        })
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        error.message = err.message

        // Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new errorhandler(message, 404) //error=err
        }

        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(
                (value) => value.message
            ) //depends upon structure
            error = new errorhandler(message, 400)
        }

        // Handle mongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered.` //fetching the key of error.keyValue which is seen in dev mode
            error = new errorhandler(message, 400)
        }

        // Handling Wrong JWT token error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web token is invalid. Try Again!'
            error = new errorhandler(message, 500)
        }

        // Handling Expired JWT token error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web token is expired. Try Again!'
            error = new errorhandler(message, 500)
        }

        return res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
}

module.exports = errorMiddleware
