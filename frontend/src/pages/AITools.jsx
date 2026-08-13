import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { AI_URL } from '../utils/config'
import './AITools.css'

const AITools = () => {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(
    role === 'recruiter' ? 'jd-writer' : 'resume-review'
  )

  // Job Seeker States
  const [resumeText, setResumeText] = useState('')
  const [jobTitleForResume, setJobTitleForResume] = useState('')
  const [resumeResult, setResumeResult] = useState(null)

  const [coverLetterForm, setCoverLetterForm] = useState({
    jobTitle: '', company: '', jobDescription: '', userSkills: '', userName: user?.username || ''
  })
  const [coverLetterResult, setCoverLetterResult] = useState(null)

  const [matchForm, setMatchForm] = useState({
    userSkills: '', userExperience: '', jobTitle: '', jobSkills: '', jobDescription: ''
  })
  const [matchResult, setMatchResult] = useState(null)

  const [interviewForm, setInterviewForm] = useState({
    jobTitle: '', skills: '', experience: ''
  })
  const [interviewResult, setInterviewResult] = useState(null)

  // Recruiter States
  const [jdForm, setJdForm] = useState({
    jobTitle: '', company: '', skills: '', experience: '', jobType: 'Full Time'
  })
  const [jdResult, setJdResult] = useState(null)

  const [evaluateForm, setEvaluateForm] = useState({
    candidateName: '', candidateResume: '', jobTitle: '', jobRequirements: '', jobSkills: ''
  })
  const [evaluateResult, setEvaluateResult] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // API call helper
  const callAI = async (endpoint, body) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${AI_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleResumeReview = async () => {
    const result = await callAI('review-resume', { resumeText, jobTitle: jobTitleForResume })
    if (result) setResumeResult(result)
  }

  const handleCoverLetter = async () => {
    const result = await callAI('cover-letter', coverLetterForm)
    if (result) setCoverLetterResult(result)
  }

  const handleMatchScore = async () => {
    const result = await callAI('match-score', matchForm)
    if (result) setMatchResult(result)
  }

  const handleInterviewQuestions = async () => {
    const result = await callAI('interview-questions', interviewForm)
    if (result) setInterviewResult(result)
  }

  const handleJDWriter = async () => {
    const result = await callAI('write-job-description', jdForm)
    if (result) setJdResult(result)
  }

  const handleEvaluate = async () => {
    const result = await callAI('evaluate-candidate', evaluateForm)
    if (result) setEvaluateResult(result)
  }

  useEffect(() => {
  if (!user) {
    navigate('/login')
  }
}, [user, navigate])

if (!user) return null

  return (
    <div className='aitools__page'>

      {/* ─── Header ─── */}
      <div className='aitools__header'>
        <h1>🤖 AI Tools</h1>
        <p>Powered by Groq Llama AI</p>
      </div>

      <div className='aitools__container'>

        {/* ─── Tabs ─── */}
        <div className='aitools__tabs'>
          {role !== 'recruiter' && (
            <>
              <button className={`tab__btn ${activeTab === 'resume-review' ? 'active' : ''}`} onClick={() => setActiveTab('resume-review')}>📄 Resume Reviewer</button>
              <button className={`tab__btn ${activeTab === 'cover-letter' ? 'active' : ''}`} onClick={() => setActiveTab('cover-letter')}>✍️ Cover Letter</button>
              <button className={`tab__btn ${activeTab === 'match-score' ? 'active' : ''}`} onClick={() => setActiveTab('match-score')}>🎯 Job Match</button>
              <button className={`tab__btn ${activeTab === 'interview-prep' ? 'active' : ''}`} onClick={() => setActiveTab('interview-prep')}>❓ Interview Prep</button>
            </>
          )}
          {role === 'recruiter' && (
            <>
              <button className={`tab__btn ${activeTab === 'jd-writer' ? 'active' : ''}`} onClick={() => setActiveTab('jd-writer')}>✍️ JD Writer</button>
              <button className={`tab__btn ${activeTab === 'evaluate' ? 'active' : ''}`} onClick={() => setActiveTab('evaluate')}>📊 Evaluate Candidate</button>
              <button className={`tab__btn ${activeTab === 'interview-questions' ? 'active' : ''}`} onClick={() => setActiveTab('interview-questions')}>❓ Interview Questions</button>
            </>
          )}
        </div>

        {/* ─── Error ─── */}
        {error && <div className='ai__error'>⚠️ {error}</div>}

        {/* ─── Resume Reviewer ─── */}
        {activeTab === 'resume-review' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>📄 AI Resume Reviewer</h2>
              <p>Get your resume scored and receive improvement suggestions</p>
              <div className='form__group'>
                <label>Job Title you're applying for</label>
                <input type='text' placeholder='e.g. Junior React Developer' value={jobTitleForResume} onChange={e => setJobTitleForResume(e.target.value)} />
              </div>
              <div className='form__group'>
                <label>Paste your Resume Text</label>
                <textarea placeholder='Paste your entire resume content here...' value={resumeText} onChange={e => setResumeText(e.target.value)} rows={8} />
              </div>
              <button className='ai__btn' onClick={handleResumeReview} disabled={loading || !resumeText}>
                {loading ? '🤖 Analyzing...' : '🚀 Analyze Resume'}
              </button>
            </div>

            {resumeResult && (
              <div className='ai__result__panel'>
                <h3>📊 Resume Analysis</h3>
                <div className='scores__row'>
                  <div className='score__circle'>
                    <span className='score__number'>{resumeResult.overallScore}</span>
                    <span className='score__label'>Overall</span>
                  </div>
                  <div className='score__circle ats'>
                    <span className='score__number'>{resumeResult.atsScore}</span>
                    <span className='score__label'>ATS Score</span>
                  </div>
                </div>
                <p className='ai__summary'>{resumeResult.summary}</p>
                <div className='result__grid'>
                  <div className='result__card strengths'>
                    <h4>✅ Strengths</h4>
                    <ul>{resumeResult.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                  <div className='result__card weaknesses'>
                    <h4>⚠️ Weaknesses</h4>
                    <ul>{resumeResult.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                  </div>
                  <div className='result__card improvements'>
                    <h4>💡 Improvements</h4>
                    <ul>{resumeResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Cover Letter ─── */}
        {activeTab === 'cover-letter' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>✍️ AI Cover Letter Generator</h2>
              <p>Generate a professional cover letter in seconds</p>
              {['jobTitle', 'company', 'userSkills'].map(field => (
                <div className='form__group' key={field}>
                  <label>{field === 'jobTitle' ? 'Job Title' : field === 'company' ? 'Company Name' : 'Your Skills'}</label>
                  <input type='text' placeholder={field === 'jobTitle' ? 'e.g. Junior React Developer' : field === 'company' ? 'e.g. Razorpay' : 'e.g. React.js, Node.js, MongoDB'} value={coverLetterForm[field]} onChange={e => setCoverLetterForm({ ...coverLetterForm, [field]: e.target.value })} />
                </div>
              ))}
              <div className='form__group'>
                <label>Job Description (optional)</label>
                <textarea placeholder='Paste job description here...' value={coverLetterForm.jobDescription} onChange={e => setCoverLetterForm({ ...coverLetterForm, jobDescription: e.target.value })} rows={4} />
              </div>
              <button className='ai__btn' onClick={handleCoverLetter} disabled={loading || !coverLetterForm.jobTitle || !coverLetterForm.company}>
                {loading ? '🤖 Generating...' : '🚀 Generate Cover Letter'}
              </button>
            </div>
            {coverLetterResult && (
              <div className='ai__result__panel'>
                <h3>✍️ Generated Cover Letter</h3>
                <div className='cover__letter__text'>
                  {coverLetterResult.coverLetter}
                </div>
                <button className='copy__btn' onClick={() => navigator.clipboard.writeText(coverLetterResult.coverLetter)}>
                  📋 Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Job Match Score ─── */}
        {activeTab === 'match-score' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>🎯 AI Job Match Score</h2>
              <p>See how well you match a job before applying</p>
              {['userSkills', 'userExperience', 'jobTitle', 'jobSkills'].map(field => (
                <div className='form__group' key={field}>
                  <label>{field === 'userSkills' ? 'Your Skills' : field === 'userExperience' ? 'Your Experience' : field === 'jobTitle' ? 'Job Title' : 'Job Required Skills'}</label>
                  <input type='text' placeholder={field === 'userSkills' ? 'React.js, Node.js, MongoDB' : field === 'userExperience' ? 'Fresher / 1 year' : field === 'jobTitle' ? 'Junior React Developer' : 'React.js, JavaScript, CSS'} value={matchForm[field]} onChange={e => setMatchForm({ ...matchForm, [field]: e.target.value })} />
                </div>
              ))}
              <button className='ai__btn' onClick={handleMatchScore} disabled={loading || !matchForm.userSkills || !matchForm.jobTitle}>
                {loading ? '🤖 Calculating...' : '🚀 Calculate Match'}
              </button>
            </div>
            {matchResult && (
              <div className='ai__result__panel'>
                <h3>🎯 Match Analysis</h3>
                <div className={`match__score__circle ${matchResult.matchScore >= 70 ? 'high' : matchResult.matchScore >= 50 ? 'medium' : 'low'}`}>
                  <span>{matchResult.matchScore}%</span>
                  <p>Match Score</p>
                </div>
                <div className={`recommendation__badge ${matchResult.recommendation === 'Yes' ? 'yes' : matchResult.recommendation === 'Maybe' ? 'maybe' : 'no'}`}>
                  {matchResult.recommendation === 'Yes' ? '✅ Recommended to Apply' : matchResult.recommendation === 'Maybe' ? '⚠️ Maybe Apply' : '❌ Not Recommended'}
                </div>
                <div className='result__grid'>
                  <div className='result__card strengths'>
                    <h4>✅ Matching Skills</h4>
                    <ul>{matchResult.matchingSkills.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                  <div className='result__card weaknesses'>
                    <h4>❌ Missing Skills</h4>
                    <ul>{matchResult.missingSkills.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                </div>
                <div className='ai__tip'>💡 {matchResult.tip}</div>
              </div>
            )}
          </div>
        )}

        {/* ─── Interview Prep ─── */}
        {activeTab === 'interview-prep' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>❓ AI Interview Prep</h2>
              <p>Practice with AI-generated interview questions</p>
              {['jobTitle', 'skills', 'experience'].map(field => (
                <div className='form__group' key={field}>
                  <label>{field === 'jobTitle' ? 'Job Title' : field === 'skills' ? 'Required Skills' : 'Experience Level'}</label>
                  <input type='text' placeholder={field === 'jobTitle' ? 'Junior React Developer' : field === 'skills' ? 'React.js, JavaScript, Node.js' : 'Fresher / Junior'} value={interviewForm[field]} onChange={e => setInterviewForm({ ...interviewForm, [field]: e.target.value })} />
                </div>
              ))}
              <button className='ai__btn' onClick={handleInterviewQuestions} disabled={loading || !interviewForm.jobTitle}>
                {loading ? '🤖 Generating...' : '🚀 Generate Questions'}
              </button>
            </div>
            {interviewResult && (
              <div className='ai__result__panel'>
                <h3>❓ Interview Questions</h3>
                {Object.entries(interviewResult).map(([category, questions]) => (
                  <div key={category} className='question__category'>
                    <h4>{category === 'technical' ? '💻 Technical' : category === 'problemSolving' ? '🧩 Problem Solving' : category === 'behavioral' ? '🤝 Behavioral' : '🏗️ System Design'}</h4>
                    {questions.map((q, i) => (
                      <div key={i} className='question__card'>
                        <p className='question__text'>Q{i + 1}: {q.question}</p>
                        <p className='question__hint'>💡 Hint: {q.hint || q.expectedAnswer || q.lookFor}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── JD Writer (Recruiter) ─── */}
        {activeTab === 'jd-writer' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>✍️ AI Job Description Writer</h2>
              <p>Generate professional job descriptions instantly</p>
              {['jobTitle', 'company', 'skills', 'experience'].map(field => (
                <div className='form__group' key={field}>
                  <label>{field === 'jobTitle' ? 'Job Title' : field === 'company' ? 'Company Name' : field === 'skills' ? 'Required Skills' : 'Experience Level'}</label>
                  <input type='text' placeholder={field === 'jobTitle' ? 'Junior React Developer' : field === 'company' ? 'TechCorp India' : field === 'skills' ? 'React.js, JavaScript, CSS' : '0-1 years'} value={jdForm[field]} onChange={e => setJdForm({ ...jdForm, [field]: e.target.value })} />
                </div>
              ))}
              <div className='form__group'>
                <label>Job Type</label>
                <select value={jdForm.jobType} onChange={e => setJdForm({ ...jdForm, jobType: e.target.value })}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </div>
              <button className='ai__btn' onClick={handleJDWriter} disabled={loading || !jdForm.jobTitle}>
                {loading ? '🤖 Writing...' : '🚀 Generate JD'}
              </button>
            </div>
            {jdResult && (
              <div className='ai__result__panel'>
                <h3>📋 {jdResult.title}</h3>
                <div className='jd__section'><h4>About the Role</h4><p>{jdResult.aboutRole}</p></div>
                <div className='jd__section'><h4>Responsibilities</h4><ul>{jdResult.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                <div className='jd__section'><h4>Required Skills</h4><ul>{jdResult.requiredSkills.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                <div className='jd__section'><h4>Nice to Have</h4><ul>{jdResult.niceToHave.map((n, i) => <li key={i}>{n}</li>)}</ul></div>
                <div className='jd__section'><h4>What We Offer</h4><ul>{jdResult.whatWeOffer.map((w, i) => <li key={i}>{w}</li>)}</ul></div>
                <button className='copy__btn' onClick={() => navigator.clipboard.writeText(JSON.stringify(jdResult, null, 2))}>📋 Copy JD</button>
              </div>
            )}
          </div>
        )}

        {/* ─── Evaluate Candidate (Recruiter) ─── */}
        {activeTab === 'evaluate' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>📊 AI Candidate Evaluator</h2>
              <p>Evaluate candidates against job requirements</p>
              {['candidateName', 'jobTitle', 'jobSkills', 'jobRequirements'].map(field => (
                <div className='form__group' key={field}>
                  <label>{field === 'candidateName' ? 'Candidate Name' : field === 'jobTitle' ? 'Job Title' : field === 'jobSkills' ? 'Required Skills' : 'Job Requirements'}</label>
                  <input type='text' placeholder={field === 'candidateName' ? 'John Doe' : field === 'jobTitle' ? 'Junior React Developer' : field === 'jobSkills' ? 'React.js, JavaScript' : '0-1 years experience'} value={evaluateForm[field]} onChange={e => setEvaluateForm({ ...evaluateForm, [field]: e.target.value })} />
                </div>
              ))}
              <div className='form__group'>
                <label>Candidate Resume / Profile</label>
                <textarea placeholder='Paste candidate resume or profile here...' value={evaluateForm.candidateResume} onChange={e => setEvaluateForm({ ...evaluateForm, candidateResume: e.target.value })} rows={6} />
              </div>
              <button className='ai__btn' onClick={handleEvaluate} disabled={loading || !evaluateForm.candidateResume || !evaluateForm.jobTitle}>
                {loading ? '🤖 Evaluating...' : '🚀 Evaluate Candidate'}
              </button>
            </div>
            {evaluateResult && (
              <div className='ai__result__panel'>
                <h3>📊 Evaluation: {evaluateResult.candidateName}</h3>
                <div className='scores__row'>
                  <div className='score__circle'><span className='score__number'>{evaluateResult.overallScore}</span><span className='score__label'>Overall</span></div>
                  <div className='score__circle ats'><span className='score__number'>{evaluateResult.technicalScore}</span><span className='score__label'>Technical</span></div>
                  <div className='score__circle'><span className='score__number'>{evaluateResult.experienceScore}</span><span className='score__label'>Experience</span></div>
                </div>
                <div className={`recommendation__badge ${evaluateResult.hiringSuggestion === 'Should hire' ? 'yes' : evaluateResult.hiringSuggestion === 'Maybe' ? 'maybe' : 'no'}`}>
                  {evaluateResult.hiringSuggestion}
                </div>
                <p className='ai__summary'>{evaluateResult.summary}</p>
                <div className='result__grid'>
                  <div className='result__card strengths'><h4>✅ Strengths</h4><ul>{evaluateResult.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                  <div className='result__card weaknesses'><h4>⚠️ Concerns</h4><ul>{evaluateResult.concerns.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
                </div>
                <div className='question__category'><h4>💡 Recommended Interview Questions</h4>{evaluateResult.recommendedQuestions.map((q, i) => <div key={i} className='question__card'><p className='question__text'>Q{i + 1}: {q}</p></div>)}</div>
              </div>
            )}
          </div>
        )}

        {/* ─── Interview Questions (Recruiter) ─── */}
        {activeTab === 'interview-questions' && (
          <div className='ai__section'>
            <div className='ai__input__panel'>
              <h2>❓ AI Interview Questions</h2>
              <p>Generate comprehensive interview questions for candidates</p>
              {['jobTitle', 'skills', 'experience'].map(field => (
                <div className='form__group' key={field}>
                  <label>{field === 'jobTitle' ? 'Job Title' : field === 'skills' ? 'Required Skills' : 'Experience Level'}</label>
                  <input type='text' placeholder={field === 'jobTitle' ? 'Junior React Developer' : field === 'skills' ? 'React.js, JavaScript' : '0-1 years'} value={interviewForm[field]} onChange={e => setInterviewForm({ ...interviewForm, [field]: e.target.value })} />
                </div>
              ))}
              <button className='ai__btn' onClick={handleInterviewQuestions} disabled={loading || !interviewForm.jobTitle}>
                {loading ? '🤖 Generating...' : '🚀 Generate Questions'}
              </button>
            </div>
            {interviewResult && (
              <div className='ai__result__panel'>
                <h3>❓ Interview Questions</h3>
                {Object.entries(interviewResult).map(([category, questions]) => (
                  <div key={category} className='question__category'>
                    <h4>{category === 'technical' ? '💻 Technical' : category === 'problemSolving' ? '🧩 Problem Solving' : category === 'behavioral' ? '🤝 Behavioral' : '🏗️ System Design'}</h4>
                    {questions.map((q, i) => (
                      <div key={i} className='question__card'>
                        <p className='question__text'>Q{i + 1}: {q.question}</p>
                        <p className='question__hint'>💡 {q.hint || q.expectedAnswer || q.lookFor}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AITools