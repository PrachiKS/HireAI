import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// import routs
import authRoute from './routes/auth.js'
import jobRoute from './routes/jobs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })

const app = express()
const port = process.env.PORT || 5000

// Security
app.use(helmet())

// Rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests' }
})
app.use(globalLimiter)

// CORS
const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

// Middleware
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs', jobRoute)

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to HireAI API 🤖',
        version: '1.0.0',
        status: 'Building in progress...',
        endpoints: {
            auth: '/api/v1/auth',
            jobs: '/api/v1/jobs',
            applications: '/api/v1/applications',
            ai: '/api/v1/ai',
            dashboard: '/api/v1/dashboard'
        }
    })
})

// Database connection
mongoose.set('strictQuery', false)

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected ✅')
    } catch (err) {
        console.error('MongoDB connection failed', err.message)
        process.exit(1)
    }
}

// Handle port in use
process.on('uncaughtException', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy. Try changing PORT in .env`)
        process.exit(1)
    }
})

//Start server
const startServer = async () => {
    try {
        await connect()
        app.listen(port, () => {
            console.log(`HireAI server running on port ${port} 🚀`)
        })
    } catch (err) {
        console.error('Failed to start server', err.message)
        process.exit(1)
    }
}

startServer()