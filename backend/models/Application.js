import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      default: ''
    },
    resume: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

export default mongoose.model('Application', applicationSchema)