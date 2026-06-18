import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker'
    },
    photo: {
      type: String,
      default: ''
    },
    // For job seekers
    skills: [String],
    resume: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    // For recruiters
    company: {
      type: String,
      default: ''
    },
    companyWebsite: {
      type: String,
      default: ''
    },
    // Google OAuth
    googleId: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)