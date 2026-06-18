import express from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import {
  register,
  login,
  logout,
  getMe
} from '../controllers/authController.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// ✅ Auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts, try again after 15 minutes'
  }
})

// ✅ Validation rules
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isLength({ max: 30 }).withMessage('Username must not exceed 30 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),
]

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
]

// ✅ Routes
router.post('/register', authLimiter, registerValidation, register)
router.post('/login', authLimiter, loginValidation, login)
router.post('/logout', verifyToken, logout)
router.get('/me', verifyToken, getMe)

export default router