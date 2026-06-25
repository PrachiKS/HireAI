import express from 'express'
import {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  checkApplication
} from '../controllers/applicationController.js'
import verifyToken, { verifyRecruiter } from '../middleware/verifyToken.js'

const router = express.Router()

// ✅ Job Seeker routes
router.post('/apply/:jobId', verifyToken, applyJob)
router.get('/my', verifyToken, getMyApplications)
router.get('/check/:jobId', verifyToken, checkApplication)
router.delete('/withdraw/:id', verifyToken, withdrawApplication)

// ✅ Recruiter routes
router.get('/job/:jobId', verifyRecruiter, getJobApplications)
router.put('/status/:id', verifyRecruiter, updateApplicationStatus)

export default router