import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Remote', 'Contract'],
      required: true
    },
    salary: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    requirements: [String],
    skills: [String],
    benefits: [String],
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active'
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applications: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Application'
      }
    ],
    deadline: {
      type: Date
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model('Job', jobSchema)