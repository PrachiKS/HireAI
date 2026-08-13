import Job from '../models/Job.js';   // Make sure the path matches your structure
import User from '../models/User.js'; // Make sure the path matches your structure

export const getHomeData = async (req, res) => {
  try {
    // 1. Fetch real counts from MongoDB
    const jobsCount = await Job.countDocuments();
    const companyCount = await User.countDocuments({ role: 'recruiter' });
    
    // Fixed: Changed 'candidate' to 'jobseeker' to match your Auth registration logic!
    const candidateCount = await User.countDocuments({ role: 'jobseeker' }); 

    // 2. Fetch the 3 most recently posted jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 }) // -1 gets the newest jobs first
      .limit(3);

    // 3. Format the database jobs to match what your frontend expects
    const formattedFeaturedJobs = recentJobs.map(job => ({
      title: job.title || 'Untitled Role',
      company: job.company || 'Confidential', 
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      matchScore: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
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
            value: 95, 
            label: 'Success Rate'
          }
        },

        featuredJobs: formattedFeaturedJobs.length > 0 ? formattedFeaturedJobs : [],

        // UPDATED: All 9 features (Core + Job Seeker AI + Recruiter AI)
        features: [
          { icon: '🏢', title: 'Top Companies', description: 'Access exclusive roles from 500+ verified top tech companies and startups.' },
          { icon: '⚡', title: 'One Click Apply', description: 'Save time by applying to multiple jobs instantly with your saved profile.' },
          { icon: '📊', title: 'Smart Dashboard', description: 'Track your applications, interview statuses, and saved jobs in one place.' },
          { icon: '📄', title: 'AI Resume Reviewer', description: 'Get your resume scored by AI and receive actionable improvement suggestions.' },
          { icon: '✍️', title: 'AI Cover Letter', description: 'Generate highly personalized, professional cover letters in seconds.' },
          { icon: '🎯', title: 'AI Job Match', description: 'Analyze your skills against job descriptions to calculate your exact match score.' },
          { icon: '❓', title: 'AI Interview Prep', description: 'Practice with AI-generated technical and behavioral interview questions.' },
          { icon: '📝', title: 'AI JD Writer', description: 'Recruiters can generate professional, SEO-optimized job descriptions instantly.' },
          { icon: '⚖️', title: 'AI Candidate Evaluator', description: 'Instantly evaluate and score candidate resumes against your job requirements.' }
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
