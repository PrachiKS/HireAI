import express from 'express'
import {
  reviewResume,
  generateCoverLetter,
  getJobMatchScore,
  generateInterviewQuestions,
  writeJobDescription,
  evaluateCandidate,
  shortlistCandidates,
  generateRecruiterQuestions
} from '../controllers/aiController.js'
import { verifyJobSeeker, verifyRecruiter } from '../middleware/verifyToken.js'

const router = express.Router()

// ✅ Job Seeker AI Routes
router.post('/review-resume', verifyJobSeeker, reviewResume)
router.post('/cover-letter', verifyJobSeeker, generateCoverLetter)
router.post('/match-score', verifyJobSeeker, getJobMatchScore)
router.post('/interview-questions', verifyJobSeeker, generateInterviewQuestions)

// ✅ Recruiter AI Routes
router.post('/write-job-description', verifyRecruiter, writeJobDescription)
router.post('/evaluate-candidate', verifyRecruiter, evaluateCandidate)
router.post('/shortlist-candidates', verifyRecruiter, shortlistCandidates)
router.post('/recruiter-questions', verifyRecruiter, generateRecruiterQuestions)

export default router