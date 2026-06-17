// backend/middleware/auth.js
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    const token = authHeader.split(' ')[1]

    const secret = process.env.JWT_SECRET || 'supersecretkey'
    const decoded = jwt.verify(token, secret)

    // decoded = { userId, email, iat, exp }
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    }

    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return res.status(401).json({ message: 'Token is not valid' })
  }
}