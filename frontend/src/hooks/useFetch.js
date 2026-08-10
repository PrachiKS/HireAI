import { useState, useEffect, useCallback } from 'react'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(url)
      const result = await res.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data')
      }

      setData(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ✅ refetch function to manually trigger again
  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}

export default useFetch