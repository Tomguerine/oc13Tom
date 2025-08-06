const jwt = require('jsonwebtoken')

module.exports.validateToken = (req, res, next) => {
  let response = {}

  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('Token is missing')
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Token is missing')
    }

    const tokenParts = authHeader.split('Bearer ')
    if (!tokenParts[1]) {
      throw new Error('Token is missing')
    }

    const userToken = tokenParts[1].trim()
    if (!userToken) {
      throw new Error('Token is missing')
    }

    const decodedToken = jwt.verify(
      userToken,
      process.env.SECRET_KEY || 'default-secret-key'
    )
    req.user = decodedToken
    return next()
  } catch (error) {
    console.error('Error in tokenValidation.js', error)
    response.status = 401
    response.message = 'Token is missing'
  }

  return res.status(response.status).send(response)
}
