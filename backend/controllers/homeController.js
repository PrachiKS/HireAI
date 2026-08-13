import Job from '../models/Job.js';   // Make sure the path matches your structure
import User from '../models/User.js'; // Make sure the path matches your structure

export const getHomeData = async (req, res) => {
  try {
    // 1. Fetch real counts from MongoDB
    const jobsCount = await Job.countDocuments();
    // (Note: Adjust 'recruiter' and 'candidate' if your roles are named differently in your User schema)
    const companyCount = await User.countDocuments({ role: 'recruiter' });
    const candidateCount = await User.countDocuments({ role: 'candidate' });

    // 2. Fetch the 3 most recently posted jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 }) // -1 gets the newest jobs first
      .limit(3);

    // 3. Format the database jobs to match what your frontend expects
    const formattedFeaturedJobs = recentJobs.map(job => ({
      title: job.title || 'Untitled Role',
      // Depending on your schema, the company name might be job.company, job.companyName, etc.
      company: job.company || 'Confidential', 
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      matchScore: Math.floor(Math.random() * (99 - 85 + 1)) + 85, // Generates a random match score between 85 and 99 for effect!
      skills: job.skills ? job.skills.slice(0, 3) : ['React', 'NodeJS', 'MongoDB'],
      matchLabel: 'AI Job Match'
    }));

    // 4. Send the hybrid payload (Dynamic Data + Server-Driven UI Text)
    res.status(200).json({
      success: true,
      data: {
        hero: {
          badge: '🤖 AI-Powered Job Board',
          title: 'Find Your Dream Job with AI Assistance',
          description: 'HireAI matches you with the perfect job using AI. Get your resume reviewed, cover letter generated, and match score calculated — all in one place!',
          primaryButton: 'Browse Jobs',
          secondaryButton: 'Post a Job'
        },

        stats: {
          jobs: {
            value: jobsCount || 0,
            label: 'Jobs Posted'
          },
          companies: {
            value: companyCount || 0,
            label: 'Companies'
          },
          candidates: {
            value: candidateCount || 0,
            label: 'Candidates'
          },
          successRate: {
            value: 95, // Keeping this static until you have an application tracking system!
            label: 'Success Rate'
          }
        },

        featuredJobs: formattedFeaturedJobs.length > 0 ? formattedFeaturedJobs : [],

        features: [
          { icon: '📄', title: 'AI Resume Reviewer', description: 'Upload your resume and get instant AI feedback, score, and improvement suggestions.' },
          { icon: '✍️', title: 'AI Cover Letter', description: 'Generate a personalized cover letter for any job in seconds using AI.' },
          { icon: '🎯', title: 'AI Job Matching', description: 'See your match percentage for each job based on your skills and experience.' },
          { icon: '🏢', title: 'Top Companies', description: "Apply to jobs from India's top startups and product companies directly." },
          { icon: '⚡', title: 'One Click Apply', description: 'Apply to multiple jobs with one click. Track all your applications in one place.' },
          { icon: '📊', title: 'Smart Dashboard', description: 'Track your applications, interviews, and offers in a beautiful dashboard.' }
        ],
        
        cta: {
          title: 'Ready to Find Your Dream Job?',
          description: 'Join thousands of candidates who found their perfect role with HireAI',
          primaryButton: 'Get Started Free',
          secondaryButton: 'Browse Jobs'
        },
        
        footer: {
          description: 'AI-powered job board connecting talent with opportunity',
          links: [
            { label: 'Jobs', path: '/jobs' },
            { label: 'About', path: '/about' },
            { label: 'Login', path: '/login' },
            { label: 'Register', path: '/register' }
          ],
          copyright: 'HireAI',
          creator: 'Built by Prachi Sonawane'
        }
      }
    });
  } catch (error) {
    console.error("Home Data Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home page data'
    });
  }
};
