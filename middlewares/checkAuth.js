const jwt = require('jsonwebtoken')
const User = require('../user/model')
const handleAsyncError = require('./catchAsyncError')
const errorHandler = require('../utils/customError')

// Check if the user is authenticated or not
exports.isAuthenticatedUser = handleAsyncError(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token || token == 'null' || token == undefined) {
        return next(
            new errorHandler('Login first to access this resource.', 401)
        )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) //verifies token with the secret key in config.env file
    req.user = await User.findById(decoded.id).select('-__v')
    // console.log(req.user);
    next()
})

// handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new errorHandler(
                    `Role(${req.user.role}) is not allowed to access this resource.`,
                    403
                )
            )
        }
        // console.log(req.user)
        next()
    }
}
