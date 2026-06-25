import Application from '../models/Application.js'
import Job from '../models/Job.js'

// Apply to a job
export const applyJob = async (req, res) => {
  const jobId = req.params.jobId

  try {
    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Check if job is still active
    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      })
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    })

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      })
    }

    // Create application
    const newApplication = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter || '',
      resume: req.body.resume || ''
    })

    await newApplication.save()

    // Add application to job
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: newApplication._id }
    })

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! 🎉',
      data: newApplication
    })

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    })
  }
}

// Get my applications (Job Seeker)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location type salary status')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Successful',
      data: applications,
      count: applications.length
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    })
  }
}

// Get applications for a job (Recruiter)
export const getJobApplications = async (req, res) => {
  const jobId = req.params.jobId

  try {
    // Check if recruiter owns this job
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      })
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'username email photo skills bio')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Successful',
      data: applications,
      count: applications.length
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    })
  }
}

// Update application status (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const application = await Application.findById(id)
      .populate('job')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Check if recruiter owns the job
    if (
      application.job.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      })
    }

    application.status = status
    await application.save()

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully!`,
      data: application
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    })
  }
}

// Delete/Withdraw application (Job Seeker)
export const withdrawApplication = async (req, res) => {
  const { id } = req.params

  try {
    const application = await Application.findById(id)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Check if applicant owns this application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      })
    }

    // Only allow withdrawal if pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application that has been reviewed'
      })
    }

    await Application.findByIdAndDelete(id)

    // Remove from job applications array
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: id }
    })

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw application'
    })
  }
}

// Check if already applied
export const checkApplication = async (req, res) => {
  const jobId = req.params.jobId

  try {
    const application = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    })

    res.status(200).json({
      success: true,
      hasApplied: !!application,
      data: application
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to check application'
    })
  }
}