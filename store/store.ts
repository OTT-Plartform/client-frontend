import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import contentReducer from "./slices/contentSlice"
import uiReducer from "./slices/uiSlice"
import languageReducer from "./slices/languageSlice"
import subscriptionReducer from "./slices/subscriptionSlice"
import onboardingReducer from "./slices/onboardingSlice"
import deviceReducer from "./slices/deviceSlice"
import profileReducer from "./slices/profileSlice"
import { validationMiddleware } from "./middleware/validationMiddleware"
import { persistenceMiddleware, loadPersistedState } from "./middleware/persistenceMiddleware"
import { loggingMiddleware } from "./middleware/loggingMiddleware"

// Load persisted state
const persistedState = loadPersistedState()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    ui: uiReducer,
    language: languageReducer,
    subscription: subscriptionReducer,
    onboarding: onboardingReducer,
    device: deviceReducer,
    profile: profileReducer,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/pending', 'auth/register/pending'],
      },
    })
    .concat(validationMiddleware)
    .concat(persistenceMiddleware)
    .concat(loggingMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
