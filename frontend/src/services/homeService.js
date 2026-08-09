import axios from 'axios'
import { HOME_URL } from '../utils/config'

export const getHomeData = async () => {
  const response = await axios.get(HOME_URL)

  return response.data
}