import Job from '../models/Job.js'

// ✅ Create Job (Recruiter only)
export const createJob = async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      postedBy: req.user.id
    })

    const savedJob = await newJob.save()

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      data: savedJob
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create job. Please try again.'
    })
  }
}

// ✅ Update Job (Recruiter only)
export const updateJob = async (req, res) => {
  const id = req.params.id
  try {
    const job = await Job.findById(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Check if recruiter owns this job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this job'
      })
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Job updated successfully!',
      data: updatedJob
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update job'
    })
  }
}

// ✅ Delete Job (Recruiter only)
export const deleteJob = async (req, res) => {
  const id = req.params.id
  try {
    const job = await Job.findById(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Check if recruiter owns this job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job'
      })
    }

    await Job.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully!'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete job'
    })
  }
}

// ✅ Get Single Job
export const getSingleJob = async (req, res) => {
  const id = req.params.id
  try {
    const job = await Job.findById(id)
      .populate('postedBy', 'username email company companyWebsite photo')

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Increment views
    await Job.findByIdAndUpdate(id, { $inc: { views: 1 } })

    res.status(200).json({
      success: true,
      message: 'Successful',
      data: job
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Job not found'
    })
  }
}

// ✅ Get All Jobs with Advanced Search
export const getAllJobs = async (req, res) => {
  const {
    keyword,
    location,
    type,
    experience,
    minSalary,
    maxSalary,
    skills,
    featured,
    sortBy,
    page = 0,
    limit = 8
  } = req.query

  try {
    // ✅ Build dynamic query
    const query = { status: 'active' }

    // Keyword search — title, company, description
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { company: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { skills: { $in: [new RegExp(keyword, 'i')] } }
      ]
    }

    // Location filter
    if (location) {
      query.location = new RegExp(location, 'i')
    }

    // Job type filter
    if (type) {
      query.type = type
    }

    // Experience filter
    if (experience) {
      query.experience = new RegExp(experience, 'i')
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',')
      query.skills = { $in: skillsArray.map(s => new RegExp(s.trim(), 'i')) }
    }

    // Sort options
    let sortOption = { createdAt: -1 }
    switch (sortBy) {
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'views':
        sortOption = { views: -1 }
        break
      case 'featured':
        sortOption = { featured: -1, createdAt: -1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = pageNum * limitNum

    // Run query with pagination
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'username company photo')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query)
    ])

    res.status(200).json({
      success: true,
      message: 'Successful',
      data: jobs,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Failed to fetch jobs'
    })
  }
}

// ✅ Get Featured Jobs
export const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ featured: true, status: 'active' })
      .populate('postedBy', 'username company photo')
      .limit(6)

    res.status(200).json({
      success: true,
      message: 'Successful',
      data: jobs
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Failed to fetch featured jobs'
    })
  }
}

// ✅ Get Jobs by Recruiter
export const getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Successful',
      data: jobs,
      count: jobs.length
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs'
    })
  }
}

// ✅ Get Job Stats
export const getJobStats = async (req, res) => {
  try {
    const [
      totalJobs,
      activeJobs,
      featuredJobs,
      jobsByType
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Job.countDocuments({ featured: true }),
      Job.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ])

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        featuredJobs,
        jobsByType
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job stats'
    })
  }
}