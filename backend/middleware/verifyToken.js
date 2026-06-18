import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken ||
    req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are not authenticated'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired, please login again'
        })
      }
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      })
    }
    req.user = user
    next()
  })
}

export const verifyJobSeeker = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'jobseeker' || req.user.role === 'admin') {
      next()
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied — Job Seekers only'
      })
    }
  })
}

export const verifyRecruiter = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'recruiter' || req.user.role === 'admin') {
      next()
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied — Recruiters only'
      })
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next()
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied — Admins only'
      })
    }
  })
}

export default verifyToken