import fetch from 'node-fetch'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

//  Helper function to call Groq API
const callGroq = async (prompt) => {
  try {
    console.log('Calling Groq API...')
    console.log('API Key exists:', !!process.env.GROQ_API_KEY)

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Always respond with valid JSON only when asked for JSON format. No markdown, no extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    })

    console.log('Groq API Status:', response.status)
    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.choices[0].message.content

  } catch (err) {
    console.error('Groq API Error:', err.message)
    throw err
  }
}

// Feature 1 — AI Resume Reviewer
export const reviewResume = async (req, res) => {
  try {
    const { resumeText, jobTitle } = req.body

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      })
    }

    const prompt = `You are an expert HR professional and resume reviewer with 10+ years of experience.

Review this resume for a ${jobTitle || 'Software Developer'} position.

Resume:
${resumeText}

Respond in this exact JSON format only, no extra text:
{
  "overallScore": 75,
  "atsScore": 70,
  "summary": "One line summary here",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}`

    const aiResponse = await callGroq(prompt)
    console.log('Groq Response:', aiResponse)

    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: 'Resume reviewed successfully!',
      data: result
    })

  } catch (err) {
    console.error('Resume Review Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to review resume. Please try again.'
    })
  }
}

// Feature 2 — AI Cover Letter Generator
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, company, jobDescription, userSkills, userName } = req.body

    if (!jobTitle || !company) {
      return res.status(400).json({
        success: false,
        message: 'Job title and company are required'
      })
    }

    const prompt = `You are an expert career coach who writes compelling cover letters.

Write a professional cover letter for:
- Candidate Name: ${userName || 'the candidate'}
- Job Title: ${jobTitle}
- Company: ${company}
- Job Description: ${jobDescription || 'Not provided'}
- Candidate Skills: ${userSkills || 'Not provided'}

Requirements:
- Professional and enthusiastic tone
- 3-4 paragraphs
- Highlight relevant skills
- Show genuine interest in the company
- End with a call to action
- Keep it under 300 words

Return ONLY the cover letter text, no extra formatting.`

    const coverLetter = await callGroq(prompt)

    res.status(200).json({
      success: true,
      message: 'Cover letter generated successfully!',
      data: { coverLetter }
    })

  } catch (err) {
    console.error('Cover Letter Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate cover letter.'
    })
  }
}

// Feature 3 — AI Job Match Score
export const getJobMatchScore = async (req, res) => {
  try {
    const { userSkills, userExperience, jobTitle, jobSkills, jobDescription } = req.body

    if (!userSkills || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'User skills and job title are required'
      })
    }

    const prompt = `You are an expert technical recruiter.

Analyze the match between this candidate and job:

CANDIDATE:
- Skills: ${userSkills}
- Experience: ${userExperience || 'Fresher'}

JOB:
- Title: ${jobTitle}
- Required Skills: ${jobSkills || 'Not specified'}
- Description: ${jobDescription || 'Not provided'}

Respond in this exact JSON format only, no extra text:
{
  "matchScore": 75,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendation": "Yes",
  "tip": "Add TypeScript to your skillset to increase match"
}`

    const aiResponse = await callGroq(prompt)
    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: 'Job match score calculated!',
      data: result
    })

  } catch (err) {
    console.error('Match Score Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to calculate match score'
    })
  }
}

// Feature 4 — AI Interview Questions Generator
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, skills, experience } = req.body

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required'
      })
    }

    const prompt = `You are an expert technical interviewer.

Generate interview questions for:
- Job Title: ${jobTitle}
- Required Skills: ${skills || 'General programming'}
- Experience Level: ${experience || 'Fresher/Junior'}

Respond in this exact JSON format only, no extra text:
{
  "technical": [
    {"question": "question here", "hint": "hint here"},
    {"question": "question here", "hint": "hint here"},
    {"question": "question here", "hint": "hint here"}
  ],
  "problemSolving": [
    {"question": "question here", "hint": "hint here"},
    {"question": "question here", "hint": "hint here"}
  ],
  "behavioral": [
    {"question": "question here", "hint": "hint here"},
    {"question": "question here", "hint": "hint here"}
  ],
  "systemDesign": [
    {"question": "question here", "hint": "hint here"}
  ]
}`

    const aiResponse = await callGroq(prompt)
    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: 'Interview questions generated!',
      data: result
    })

  } catch (err) {
    console.error('Interview Questions Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate interview questions'
    })
  }
}

// Recruiter Feature 1 — AI Job Description Writer
export const writeJobDescription = async (req, res) => {
  try {
    const { jobTitle, skills, experience, company, jobType } = req.body

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required'
      })
    }

    const prompt = `You are an expert HR professional who writes compelling job descriptions.

Write a professional job description for:
- Job Title: ${jobTitle}
- Company: ${company || 'Our Company'}
- Required Skills: ${skills || 'Not specified'}
- Experience Level: ${experience || 'Fresher/Junior'}
- Job Type: ${jobType || 'Full Time'}

Include these sections:
1. About the Role (2-3 lines)
2. Key Responsibilities (5-6 points)
3. Required Skills (4-5 points)
4. Nice to Have (2-3 points)
5. What We Offer (3-4 points)

Respond in this exact JSON format only, no extra text:
{
  "title": "Job title here",
  "aboutRole": "About the role description here",
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3", "responsibility 4", "responsibility 5"],
  "requiredSkills": ["skill 1", "skill 2", "skill 3", "skill 4"],
  "niceToHave": ["nice to have 1", "nice to have 2", "nice to have 3"],
  "whatWeOffer": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"]
}`

    const aiResponse = await callGroq(prompt)
    console.log('Groq Response:', aiResponse)

    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: 'Job description generated successfully!',
      data: result
    })

  } catch (err) {
    console.error('Job Description Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate job description'
    })
  }
}

// Recruiter Feature 2 — AI Candidate Evaluator
export const evaluateCandidate = async (req, res) => {
  try {
    const {
      candidateName,
      candidateResume,
      jobTitle,
      jobRequirements,
      jobSkills
    } = req.body

    if (!candidateResume || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Candidate resume and job title are required'
      })
    }

    const prompt = `You are an expert technical recruiter with 10+ years of hiring experience.

Evaluate this candidate for the job position:

JOB DETAILS:
- Title: ${jobTitle}
- Required Skills: ${jobSkills || 'Not specified'}
- Requirements: ${jobRequirements || 'Not specified'}

CANDIDATE:
- Name: ${candidateName || 'Candidate'}
- Resume/Profile: ${candidateResume}

Provide a detailed evaluation and respond in this exact JSON format only, no extra text:
{
  "candidateName": "name here",
  "overallScore": 75,
  "technicalScore": 70,
  "experienceScore": 65,
  "verdict": "Recommended",
  "summary": "One line evaluation summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "concerns": ["concern 1", "concern 2"],
  "recommendedQuestions": ["interview question 1", "interview question 2", "interview question 3"],
  "hiringSuggestion": "Should hire / Maybe / Do not hire"
}`

    const aiResponse = await callGroq(prompt)
    console.log('Groq Response:', aiResponse)

    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: 'Candidate evaluated successfully!',
      data: result
    })

  } catch (err) {
    console.error('Candidate Evaluator Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to evaluate candidate'
    })
  }
}

// Recruiter Feature 3 — AI Resume Shortlister
export const shortlistCandidates = async (req, res) => {
  try {
    const { candidates, jobTitle, jobSkills, jobRequirements } = req.body

    if (!candidates || candidates.length === 0 || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Candidates list and job title are required'
      })
    }

    const candidatesList = candidates.map((c, index) =>
      `Candidate ${index + 1}:
      Name: ${c.name}
      Resume: ${c.resume}`
    ).join('\n\n')

    const prompt = `You are an expert technical recruiter.

Shortlist and rank these candidates for the job:

JOB DETAILS:
- Title: ${jobTitle}
- Required Skills: ${jobSkills || 'Not specified'}
- Requirements: ${jobRequirements || 'Not specified'}

CANDIDATES:
${candidatesList}

Rank all candidates from best to worst fit.
Respond in this exact JSON format only, no extra text:
{
  "rankedCandidates": [
    {
      "rank": 1,
      "name": "candidate name",
      "matchScore": 90,
      "verdict": "Highly Recommended",
      "keyStrengths": ["strength 1", "strength 2"],
      "keyConcerns": ["concern 1"],
      "decision": "Shortlist"
    }
  ],
  "summary": "Overall shortlisting summary here"
}`

    const aiResponse = await callGroq(prompt)
    console.log('Groq Response:', aiResponse)

    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: `${result.rankedCandidates.length} candidates shortlisted successfully!`,
      data: result
    })

  } catch (err) {
    console.error('Shortlisting Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to shortlist candidates'
    })
  }
}

// Recruiter Feature 4 — AI Interview Questions Generator
export const generateRecruiterQuestions = async (req, res) => {
  try {
    const { jobTitle, skills, experience, difficulty } = req.body

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required'
      })
    }

    const prompt = `You are an expert technical interviewer with 10+ years of hiring experience.

Generate comprehensive interview questions for hiring:
- Job Title: ${jobTitle}
- Required Skills: ${skills || 'General programming'}
- Experience Level: ${experience || 'Junior/Fresher'}
- Difficulty: ${difficulty || 'Medium'}

Generate questions a recruiter would ask to properly evaluate a candidate.

Respond in this exact JSON format only, no extra text:
{
  "screening": [
    {"question": "screening question", "purpose": "what this reveals about candidate", "redFlag": "what bad answer looks like"},
    {"question": "screening question", "purpose": "what this reveals about candidate", "redFlag": "what bad answer looks like"}
  ],
  "technical": [
    {"question": "technical question", "expectedAnswer": "key points in good answer", "difficulty": "Easy/Medium/Hard"},
    {"question": "technical question", "expectedAnswer": "key points in good answer", "difficulty": "Easy/Medium/Hard"},
    {"question": "technical question", "expectedAnswer": "key points in good answer", "difficulty": "Easy/Medium/Hard"}
  ],
  "practical": [
    {"question": "practical/coding question", "expectedAnswer": "what to look for"},
    {"question": "practical/coding question", "expectedAnswer": "what to look for"}
  ],
  "behavioral": [
    {"question": "behavioral question", "lookFor": "what good answer includes"},
    {"question": "behavioral question", "lookFor": "what good answer includes"}
  ],
  "cultural": [
    {"question": "culture fit question", "lookFor": "what to assess"},
    {"question": "culture fit question", "lookFor": "what to assess"}
  ]
}`

    const aiResponse = await callGroq(prompt)
    console.log('Groq Response:', aiResponse)

    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleanResponse)

    res.status(200).json({
      success: true,
      message: 'Interview questions generated successfully!',
      data: result
    })

  } catch (err) {
    console.error('Recruiter Questions Error:', err.message)
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate interview questions'
    })
  }
}