import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { contentApi, type Genre } from "@/store/services/contentApi"
import { parseApiError } from "@/lib/errorUtils"

interface ContentItem {
  id: string
  title: string
  description: string
  thumbnail: string
  backdrop?: string
  type: "movie" | "series"
  genre: string
  genres?: string[]
  year: number
  rating: string
  duration?: string
  match: number
  episodes?: number
  seasons?: number
}

interface ContentState {
  content: ContentItem[]
  trending: ContentItem[]
  recommended: ContentItem[]
  genres: Genre[]
  isLoading: boolean
  error: string | null
}

const initialState: ContentState = {
  content: [],
  trending: [],
  recommended: [],
  genres: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchGenres = createAsyncThunk(
  "content/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await contentApi.getGenres()
      return response.data.genres
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const fetchGenreById = createAsyncThunk(
  "content/fetchGenreById",
  async (genreId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getGenreById(genreId)
      return response.data.genre
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.content = action.payload
    },
    setTrending: (state, action: PayloadAction<ContentItem[]>) => {
      state.trending = action.payload
    },
    setRecommended: (state, action: PayloadAction<ContentItem[]>) => {
      state.recommended = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload
    },
    clearContentError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.isLoading = false
        state.genres = action.payload
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch genres"
      })
      .addCase(fetchGenreById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGenreById.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(fetchGenreById.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch genre"
      })
  },
})

export const { setContent, setTrending, setRecommended, setLoading, setGenres, clearContentError } = contentSlice.actions
export default contentSlice.reducer
