import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SnackbarState {
  isVisible: boolean
  message: string
  type: "success" | "error" | "info"
  duration: number
}

interface UiState {
  snackbar: SnackbarState
}

const initialState: UiState = {
  snackbar: {
    isVisible: false,
    message: "",
    type: "info",
    duration: 4000,
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; type: "success" | "error" | "info"; duration?: number }>,
    ) => {
      state.snackbar = {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.type,
        duration: action.payload.duration || 4000,
      }
    },
    hideSnackbar: (state) => {
      state.snackbar.isVisible = false
    },
  },
})

export const { showSnackbar, hideSnackbar } = uiSlice.actions
export default uiSlice.reducer
