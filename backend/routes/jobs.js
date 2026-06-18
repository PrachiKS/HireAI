import express from 'express'
import {
  createJob,
  updateJob,
  deleteJob,
  getSingleJob,
  getAllJobs,
  getFeaturedJobs,
  getJobsByRecruiter,
  getJobStats
} from '../controllers/jobController.js'
import verifyToken, { verifyRecruiter, verifyAdmin } from '../middleware/verifyToken.js'

const router = express.Router()

// ✅ Public routes
router.get('/', getAllJobs)
router.get('/featured', getFeaturedJobs)
router.get('/stats', getJobStats)
router.get('/:id', getSingleJob)

// ✅ Recruiter routes
router.post('/', verifyRecruiter, createJob)
router.put('/:id', verifyRecruiter, updateJob)
router.delete('/:id', verifyRecruiter, deleteJob)
router.get('/recruiter/myjobs', verifyRecruiter, getJobsByRecruiter)

export default router