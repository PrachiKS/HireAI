import { useEffect, useState } from 'react'
import { getHomeData } from '../services/homeService'

const useHome = () => {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true)

        const response = await getHomeData()

        if (response.success) {
          setHomeData(response.data)
        } else {
          setError('Failed to load home page data')
        }
      } catch (error) {
        setError('Unable to load home page data')
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  return {
    homeData,
    loading,
    error
  }
}

export default useHome