import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import contentSlice from "./slices/contentSlice"
import uiSlice from "./slices/uiSlice"
import languageReducer from "./slices/languageSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    content: contentSlice,
    ui: uiSlice,
    language: languageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
