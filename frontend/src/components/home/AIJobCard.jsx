import React from 'react'

const AIJobCard = ({ featuredJobs }) => {

  return (
    <>
      <div className='hero__image'>
        <div className='hero__card'>

          <div className='hero__card-header'>
            <span>🤖 {featuredJobs?.[0]?.matchLabel}</span>
            <span className='match__score'>
              {featuredJobs?.[0]?.matchScore}% Match
            </span>

          </div>
            {featuredJobs?.map((job) => (
              <div className='hero__card-job' key={job.title}>
                <h4>{job.title}</h4>

                <p>
                  {job.company} · {job.location} · {job.salary}
                </p>

                <div className='skills'>
                  {job.skills?.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
            </div>
          ))}

        </div>
      </div>
    </>
  )
}

export default AIJobCard