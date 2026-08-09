const getHomeData = async (req, res) => {
  try {
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
            value: 500,
            label: 'Jobs Posted'
          },
          companies: {
            value: 200,
            label: 'Companies'
          },
          candidates: {
            value: 1000,
            label: 'Candidates'
          },
          successRate: {
            value: 95,
            label: 'Success Rate'
          }
        },

        featuredJobs: [
          {
            title: 'Senior React Developer',
            company: 'Google',
            location: 'Bangalore',
            salary: '₹25-40 LPA',
            matchScore: 95,
            skills: ['React.js', 'Node.js', 'MongoDB'],
            matchLabel: 'AI Job Match'
          },
          {
            title: 'Full Stack Developer',
            company: 'Swiggy',
            location: 'Remote',
            salary: '₹15-25 LPA',
            matchScore: 91,
            skills: ['MERN', 'AWS', 'Docker'],
            matchLabel: 'AI Job Match'
          },
          {
            title: 'Frontend Engineer',
            company: 'Razorpay',
            location: 'Pune',
            salary: '₹12-20 LPA',
            matchScore: 88,
            skills: ['React', 'TypeScript', 'CSS'],
            matchLabel: 'AI Job Match'
          }
        ],

        features: [
          {
            icon: '📄',
            title: 'AI Resume Reviewer',
            description: 'Upload your resume and get instant AI feedback, score, and improvement suggestions.'
          },
          {
            icon: '✍️',
            title: 'AI Cover Letter',
            description: 'Generate a personalized cover letter for any job in seconds using AI.'
          },
          {
            icon: '🎯',
            title: 'AI Job Matching',
            description: 'See your match percentage for each job based on your skills and experience.'
          },
          {
            icon: '🏢',
            title: 'Top Companies',
            description: "Apply to jobs from India's top startups and product companies directly."
          },
          {
            icon: '⚡',
            title: 'One Click Apply',
            description: 'Apply to multiple jobs with one click. Track all your applications in one place.'
          },
          {
            icon: '📊',
            title: 'Smart Dashboard',
            description: 'Track your applications, interviews, and offers in a beautiful dashboard.'
          }
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
            {
              label: 'Jobs',
              path: '/jobs'
            },
            {
              label: 'About',
              path: '/about'
            },
            {
              label: 'Login',
              path: '/login'
            },
            {
              label: 'Register',
              path: '/register'
            }
          ],
          copyright: 'HireAI',
          creator: 'Built by Prachi Sonawane'
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home page data'
    })
  }
}

export { getHomeData }