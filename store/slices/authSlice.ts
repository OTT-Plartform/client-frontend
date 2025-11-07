import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authApi, type LoginPayload, type RegisterPayload } from "../services/authApi"
import { getStoredTokens } from "@/lib/auth"
import { parseApiError } from "@/lib/errorUtils"

export interface User {
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
  error: string | null
  validationErrors: { [field: string]: string }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isOAuthLoading: false,
  oauthProvider: undefined,
  error: null,
  validationErrors: {},
}

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload)
      return response.data
    } catch (error: any) {
      const parsedError = parseApiError(error.message || error)
      return rejectWithValue(parsedError)
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload)
      return response.data
    } catch (error: any) {
      const parsedError = parseApiError(error.message || error)
      return rejectWithValue(parsedError)
    }
  }
)

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed")
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile")
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile")
    }
  }
)

export const initiateOAuth = createAsyncThunk(
  "auth/initiateOAuth",
  async (provider: 'google' | 'facebook', { rejectWithValue }) => {
    try {
      const redirectUrl = await authApi.getOAuthRedirectUrl(provider)
      return { provider, redirectUrl }
    } catch (error: any) {
      const parsedError = parseApiError(error.message || error)
      return rejectWithValue(parsedError)
    }
  }
)

export const exchangeOAuthToken = createAsyncThunk(
  "auth/exchangeOAuthToken",
  async ({ provider, accessToken }: { provider: 'google' | 'facebook'; accessToken: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.exchangeOAuthToken(provider, accessToken)
      return response.data
    } catch (error: any) {
      const parsedError = parseApiError(error.message || error)
      return rejectWithValue(parsedError)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    clearError: (state) => {
      state.error = null
      state.validationErrors = {}
    },
    clearFieldError: (state, action: PayloadAction<string>) => {
      if (state.validationErrors[action.payload]) {
        delete state.validationErrors[action.payload]
      }
    },
    checkAuthStatus: (state) => {
      const { accessToken } = getStoredTokens()
      state.isAuthenticated = !!accessToken
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.validationErrors = {}
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.validationErrors = {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        const parsedError = action.payload as any
        state.error = parsedError?.message || "Login failed"
        state.validationErrors = parsedError?.validationErrors || {}
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.validationErrors = {}
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.validationErrors = {}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        const parsedError = action.payload as any
        state.error = parsedError?.message || "Registration failed"
        state.validationErrors = parsedError?.validationErrors || {}
      })

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
        state.validationErrors = {}
      })

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        const parsedError = action.payload as any
        state.error = parsedError?.message || "Failed to fetch profile"
      })

    // Update Profile
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })

    // OAuth
    builder
      .addCase(initiateOAuth.pending, (state, action) => {
        state.isOAuthLoading = true
        state.oauthProvider = action.meta.arg
        state.error = null
      })
      .addCase(initiateOAuth.fulfilled, (state) => {
        state.isOAuthLoading = false
      })
      .addCase(initiateOAuth.rejected, (state, action) => {
        state.isOAuthLoading = false
        const parsedError = action.payload as any
        state.error = parsedError?.message || "OAuth initialization failed"
      })
      .addCase(exchangeOAuthToken.pending, (state) => {
        state.isOAuthLoading = true
      })
      .addCase(exchangeOAuthToken.fulfilled, (state, action) => {
        state.isOAuthLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.oauthProvider = undefined
        state.error = null
      })
      .addCase(exchangeOAuthToken.rejected, (state, action) => {
        state.isOAuthLoading = false
        const parsedError = action.payload as any
        state.error = parsedError?.message || "OAuth token exchange failed"
        state.oauthProvider = undefined
      })
  },
})

export const { setUser, updateUser, clearError, clearFieldError, checkAuthStatus } = authSlice.actions

// Export logout alias for backward compatibility
export const logout = logoutUser

export default authSlice.reducer
