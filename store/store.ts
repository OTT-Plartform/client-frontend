import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import contentSlice from "./slices/contentSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    content: contentSlice,
    ui: uiSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
