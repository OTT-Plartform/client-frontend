import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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
  isLoading: boolean
}

const initialState: ContentState = {
  content: [],
  trending: [],
  recommended: [],
  isLoading: false,
}

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
  },
})

export const { setContent, setTrending, setRecommended, setLoading } = contentSlice.actions
export default contentSlice.reducer
