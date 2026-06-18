import { createContext, useContext, useEffect, useReducer } from 'react'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  loading: false,
  error: null
}

const AuthContext = createContext(initialState)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
        error: null
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
        role: null
      }

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        error: null
      }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Save to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user))
      localStorage.setItem('token', state.token)
      localStorage.setItem('role', state.role)
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }, [state.user, state.token, state.role])

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      role: state.role,
      loading: state.loading,
      error: state.error,
      dispatch
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext