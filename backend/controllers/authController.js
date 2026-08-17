import User from '../models/User.js'
import cloudinary from '../utils/cloudinary.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

//Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '15m' }  
  )

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

// Set Cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 15 * 60 * 1000 // 15 mins
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

// Register
export const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    })
  }

  try {
    // 1. Destructure all new and existing fields from req.body
    const { 
      username, 
      email, 
      password, 
      role, 
      skills, 
      portfolioUrl, 
      education, 
      company, 
      companyWebsite, 
      designation 
    } = req.body

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken'
      })
    }

    const salt = bcrypt.genSaltSync(12)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // 2. Create user with professional fields populated based on role
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'jobseeker',
      skills: skills || [],
      portfolioUrl: portfolioUrl || '',
      education: education || { university: '', degree: '', graduationYear: '' },
      company: company || '',
      companyWebsite: companyWebsite || '',
      designation: designation || ''
    })

    await newUser.save()

   // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser)

    // Save refresh token
    newUser.refreshToken = refreshToken
    await newUser.save()

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken)

    // Send response
    const { password: _, refreshToken: __, ...userData } = newUser._doc

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token: accessToken,
      data: userData,
      role: newUser.role
    })

  } catch (err) {
    console.error('Registration Error:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.'
    })
  }
}

// Login
export const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    })
  }

  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken)

    const { password: _, refreshToken: __, ...userData } = user._doc

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: accessToken,
      data: userData,
      role: user.role
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to login. Please try again.'
    })
  }
}

// Logout
export const logout = async (req, res) => {
  try {
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user?.id, { refreshToken: '' })

    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .status(200)
      .json({
        success: true,
        message: 'Logged out successfully'
      })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to logout'
    })
  }
}

//Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken')
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
}

const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    uploadStream.end(fileBuffer)
  })
}

// Update Profile (Handles Text & Files)
export const updateProfile = async (req, res) => {
  try {
    // 1. Extract text data from req.body
    let updateData = { ...req.body }

    // Parse the stringified skills array back into a real array
    if (updateData.skills && typeof updateData.skills === 'string') {
      updateData.skills = JSON.parse(updateData.skills)
    }
    if (updateData.education && typeof updateData.education === 'string') {
      try {
        updateData.education = JSON.parse(updateData.education)
      } catch (e) {
        delete updateData.education // Ignore if parsing fails
      }
    }

    // 2. Handle File Uploads (if they exist in req.files)
    if (req.files) {
      if (req.files.photo) {
        updateData.photo = await uploadToCloudinary(req.files.photo[0].buffer, 'hireai/photos', 'image')
      }
      if (req.files.resume) {
        // resourceType 'auto' handles PDFs perfectly
        updateData.resumeUrl = await uploadToCloudinary(req.files.resume[0].buffer, 'hireai/resumes', 'auto')
      }
      if (req.files.certificate) {
        updateData.certificateUrl = await uploadToCloudinary(req.files.certificate[0].buffer, 'hireai/certificates', 'auto')
      }
    }

    // 3. Update User in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: updatedUser
    })

  } catch (error) {
    console.error("Profile Update Error:", error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again.'
    })
  }
}