import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface LanguageState {
  selected: string
}

const initialState: LanguageState = {
  selected: "English", // default language
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
