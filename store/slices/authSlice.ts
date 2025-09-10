import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  phone_number?: string
  avatar?: string
  date_of_birth?: string
  country?: string
  city?: string
  bio?: string
  provider?: string
  provider_id?: string
  is_profile_complete: boolean
  favorite_genres?: any[]
  subscription?: any
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isOAuthLoading: boolean
  oauthProvider?: 'google' | 'facebook'
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isOAuthLoading: false,
  oauthProvider: undefined,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setOAuthLoading: (state, action: PayloadAction<{ loading: boolean; provider?: 'google' | 'facebook' }>) => {
      state.isOAuthLoading = action.payload.loading
      state.oauthProvider = action.payload.provider
    },
  },
})

export const { setUser, updateUser, logout, setLoading, setOAuthLoading } = authSlice.actions
export default authSlice.reducer
