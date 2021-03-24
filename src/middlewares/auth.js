const jwt = require('jsonwebtoken')
const { response, expFailde } = require('../helpers/response')

const authentification = (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    return response(res, null, {}, 401, { message: 'Server, Need Token!' })
  }

  let token = authorization.split(' ')
  token = token[1]

  jwt.verify(token, process.env.JWTCode, (err, decode) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return response(res, null, {}, 401, { message: 'Invalid signature' })
      } else if (err.name === 'TokenExpiredError') {
        return response(res, null, {}, 401, {
          message: 'Jwt expired'
        })
      } else {
        return response(res, null, {}, 401, {
          message: 'Jwt not active'
        })
      }
    }

    req.email = decode.email
    res.access = decode.access
    console.log(req.email)
    next()
  })
}

const authorizationAdmin = (req, res, next) => {
  const access = res.access
  if (access === 0) {
    next()
  } else {
    expFailde(res, 'Oops, access denied!, Only for admin!', [])
  }
}
const authorizationUser = (req, res, next) => {
  const access = res.useraccess
  if (access === 1) {
    next()
  } else {
    expFailde(res, 'Oops, access denied!, Only for user!', [])
  }
}

module.exports = {
  authentification,
  authorizationAdmin,
  authorizationUser
}
