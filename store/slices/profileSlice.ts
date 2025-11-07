import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { profileApi } from "@/store/services/profileApi"
import { parseApiError } from "@/lib/errorUtils"

interface Profile {
  id: number
  name: string
  avatar?: string
  is_primary: boolean
  is_kids: boolean
  pin_protected: boolean
  user_id: number
  created_at: string
  updated_at: string
  [key: string]: any
}

interface WatchHistoryItem {
  id: number
  content_id: number
  profile_id: number
  watched_duration: number
  total_duration: number
  completed: boolean
  last_watched_at: string
  [key: string]: any
}

interface ProfileState {
  profiles: Profile[]
  currentProfile: Profile | null
  watchHistory: WatchHistoryItem[]
  isLoading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  watchHistory: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchProfiles = createAsyncThunk(
  "profile/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.listProfiles()
      return response.data.profiles
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const createProfile = createAsyncThunk(
  "profile/create",
  async (payload: {
    name: string
    avatar?: string
    is_kids?: boolean
    pin?: string
  }, { rejectWithValue }) => {
    try {
      const response = await profileApi.createProfile(payload)
      return response.data.profile
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const fetchProfileById = createAsyncThunk(
  "profile/fetchById",
  async (profileId: number, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfileById(profileId)
      return response.data.profile
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const updateProfile = createAsyncThunk(
  "profile/update",
  async ({ profileId, data }: { profileId: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(profileId, data)
      return response.data.profile
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const deleteProfile = createAsyncThunk(
  "profile/delete",
  async (profileId: number, { rejectWithValue }) => {
    try {
      await profileApi.deleteProfile(profileId)
      return profileId
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const setPrimaryProfile = createAsyncThunk(
  "profile/setPrimary",
  async (profileId: number, { rejectWithValue }) => {
    try {
      await profileApi.setPrimaryProfile(profileId)
      return profileId
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const fetchWatchHistory = createAsyncThunk(
  "profile/fetchWatchHistory",
  async (profileId: number, { rejectWithValue }) => {
    try {
      const response = await profileApi.getWatchHistory(profileId)
      return response.data
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload
    },
    clearProfileError: (state) => {
      state.error = null
    },
    resetProfileState: (state) => {
      state.profiles = []
      state.currentProfile = null
      state.watchHistory = []
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.isLoading = false
        state.profiles = action.payload
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch profiles"
      })
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profiles.push(action.payload)
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to create profile"
      })
      .addCase(fetchProfileById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProfile = action.payload
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch profile"
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.profiles.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.profiles[index] = action.payload
        }
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to update profile"
      })
      .addCase(deleteProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profiles = state.profiles.filter(p => p.id !== action.payload)
        if (state.currentProfile?.id === action.payload) {
          state.currentProfile = null
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to delete profile"
      })
      .addCase(setPrimaryProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(setPrimaryProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profiles = state.profiles.map(p => ({
          ...p,
          is_primary: p.id === action.payload
        }))
      })
      .addCase(setPrimaryProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to set primary profile"
      })
      .addCase(fetchWatchHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.watchHistory = action.payload
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch watch history"
      })
  },
})

export const { setCurrentProfile, clearProfileError, resetProfileState } = profileSlice.actions
export default profileSlice.reducer
