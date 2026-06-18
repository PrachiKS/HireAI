import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import User from '../models/User.js'
import Job from '../models/Job.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env') })

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected ✅')

    // Find a recruiter user
    let recruiter = await User.findOne({ role: 'recruiter' })

    // If no recruiter exists create one
    if (!recruiter) {
      recruiter = new User({
        username: 'techcorp_recruiter',
        email: 'recruiter@techcorp.com',
        password: 'Recruiter@1234',
        role: 'recruiter',
        company: 'TechCorp India'
      })
      await recruiter.save()
      console.log('Recruiter created ✅')
    }

    // Clear existing jobs
    await Job.deleteMany({})
    console.log('Existing jobs cleared 🗑️')

    const jobs = [
      {
        title: 'Junior React Developer',
        company: 'Razorpay',
        location: 'Bangalore',
        type: 'Full Time',
        salary: '8-12 LPA',
        experience: '0-1 years',
        description: 'Looking for a passionate React developer to join our frontend team. You will work on building and maintaining our payment UI components.',
        requirements: ['Strong JavaScript knowledge', 'React.js experience', 'Understanding of REST APIs', 'Git version control'],
        skills: ['React.js', 'JavaScript', 'CSS3', 'Git'],
        benefits: ['Health insurance', 'Remote work options', 'Learning budget'],
        featured: true,
        postedBy: recruiter._id,
        deadline: new Date('2026-08-01')
      },
      {
        title: 'MERN Stack Developer',
        company: 'Swiggy',
        location: 'Remote',
        type: 'Full Time',
        salary: '10-15 LPA',
        experience: '0-2 years',
        description: 'Join our engineering team to build scalable food delivery products using the MERN stack.',
        requirements: ['MongoDB experience', 'Express.js knowledge', 'React.js proficiency', 'Node.js basics'],
        skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
        benefits: ['Free meals', 'Stock options', 'Flexible hours'],
        featured: true,
        postedBy: recruiter._id,
        deadline: new Date('2026-08-15')
      },
      {
        title: 'Frontend Developer',
        company: 'Zepto',
        location: 'Mumbai',
        type: 'Full Time',
        salary: '6-10 LPA',
        experience: '0-1 years',
        description: 'Build beautiful user interfaces for our quick commerce platform.',
        requirements: ['HTML5 and CSS3', 'React.js', 'Responsive design', 'Bootstrap or Tailwind'],
        skills: ['React.js', 'HTML5', 'CSS3', 'Bootstrap'],
        benefits: ['Health coverage', 'Gym membership', 'Team outings'],
        featured: false,
        postedBy: recruiter._id,
        deadline: new Date('2026-07-30')
      },
      {
        title: 'Node.js Backend Developer',
        company: 'CRED',
        location: 'Bangalore',
        type: 'Full Time',
        salary: '12-18 LPA',
        experience: '1-2 years',
        description: 'Build robust backend services for our fintech platform.',
        requirements: ['Node.js proficiency', 'MongoDB', 'REST API design', 'JWT authentication'],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
        benefits: ['High salary', 'ESOP', 'Premium office'],
        featured: false,
        postedBy: recruiter._id,
        deadline: new Date('2026-09-01')
      },
      {
        title: 'Full Stack Developer Intern',
        company: 'Groww',
        location: 'Remote',
        type: 'Internship',
        salary: '25-40K/month',
        experience: 'Fresher',
        description: 'Exciting internship opportunity to work on fintech products with real impact.',
        requirements: ['Basic React knowledge', 'Node.js basics', 'Eagerness to learn', 'Good communication'],
        skills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript'],
        benefits: ['Stipend', 'Mentorship', 'PPO opportunity'],
        featured: true,
        postedBy: recruiter._id,
        deadline: new Date('2026-07-15')
      },
      {
        title: 'React Native Developer',
        company: 'PhonePe',
        location: 'Pune',
        type: 'Full Time',
        salary: '8-14 LPA',
        experience: '0-2 years',
        description: 'Build cross-platform mobile apps for our payments platform.',
        requirements: ['React Native', 'JavaScript', 'Redux', 'Mobile UI design'],
        skills: ['React Native', 'JavaScript', 'Redux', 'Mobile Development'],
        benefits: ['Relocation support', 'Health insurance', 'Annual bonus'],
        featured: false,
        postedBy: recruiter._id,
        deadline: new Date('2026-08-20')
      },
      {
        title: 'Junior Software Engineer',
        company: 'Flipkart',
        location: 'Bangalore',
        type: 'Full Time',
        salary: '10-16 LPA',
        experience: '0-1 years',
        description: 'Work on India\'s largest e-commerce platform and solve interesting engineering challenges.',
        requirements: ['Data structures', 'JavaScript', 'React or Angular', 'Problem solving'],
        skills: ['JavaScript', 'React.js', 'Data Structures', 'Algorithms'],
        benefits: ['Competitive salary', 'ESOPs', 'Learning opportunities'],
        featured: true,
        postedBy: recruiter._id,
        deadline: new Date('2026-09-15')
      },
      {
        title: 'DevOps Engineer Intern',
        company: 'Zomato',
        location: 'Remote',
        type: 'Internship',
        salary: '20-35K/month',
        experience: 'Fresher',
        description: 'Learn DevOps practices while working on real infrastructure challenges.',
        requirements: ['Basic Linux', 'Git knowledge', 'Interest in DevOps', 'Quick learner'],
        skills: ['Linux', 'Git', 'Docker basics', 'CI/CD'],
        benefits: ['Remote work', 'Mentorship', 'Certificate'],
        featured: false,
        postedBy: recruiter._id,
        deadline: new Date('2026-07-20')
      }
    ]

    await Job.insertMany(jobs)
    console.log(`${jobs.length} Sample jobs inserted successfully 🎉`)

    mongoose.connection.close()
    console.log('Database connection closed ✅')

  } catch (err) {
    console.error('Error seeding jobs:', err.message)
    process.exit(1)
  }
}

seedJobs()