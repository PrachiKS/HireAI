import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    // --- SHARED FIELDS ---
    username: {
      type: String,
      required: true,
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
      minlength: 6,
      required: true
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker'
    },
    photo: { type: String, default: '' },
    
    // --- JOB SEEKER FIELDS ---
    education: {
      university: { type: String, default: '' },
      degree: { type: String, default: '' },
      graduationYear: { type: String, default: '' }
    },
    skills: [String],
    portfolioUrl: { type: String, default: '' }, // GitHub or LinkedIn
    resume: { type: String, default: '' },
    bio: { type: String, default: '' },

    // --- RECRUITER FIELDS ---
    company: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    designation: { type: String, default: '' }, // e.g., "HR Manager", "Tech Lead"

    // --- SYSTEM FIELDS ---
    googleId: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)