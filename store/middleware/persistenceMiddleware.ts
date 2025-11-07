import { Middleware } from "@reduxjs/toolkit"

const PERSIST_KEY = "redux_persisted_state"
const PERSIST_WHITELIST = ["language", "ui"]

/**
 * Persistence middleware that auto-saves whitelisted state to localStorage
 */
export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  
  // Prevent duplicate fetches in same session
  if (typeof action.type === 'string') {
    if (action.type.includes('/fulfilled')) {
      const baseType = action.type.replace('/fulfilled', '')
      fetchedInSession.add(baseType)
    }
    
    // Block duplicate pending requests
    if (action.type.includes('/pending')) {
      const baseType = action.type.replace('/pending', '')
      if (fetchedInSession.has(baseType)) {
        console.log(`Blocked duplicate fetch: ${baseType}`)
      }
    }
  }
  
  if (typeof window !== "undefined") {
    savePersistedState(store.getState())
  }
  
  return result
}

/**
 * Load persisted state on store initialization
 */
export function loadPersistedState() {
  if (typeof window === "undefined") return {}
  
  try {
    const serialized = localStorage.getItem(PERSIST_KEY)
    if (!serialized) return {}
    
    return JSON.parse(serialized)
  } catch (error) {
    console.warn("Failed to load persisted state:", error)
    return {}
  }
}

/**
 * Save state to localStorage
 */
const savePersistedState = (state: any) => {
  try {
    const stateToPersist: any = {}
    PERSIST_WHITELIST.forEach((key) => {
      if (state[key]) {
        stateToPersist[key] = state[key]
      }
    })
    localStorage.setItem(PERSIST_KEY, JSON.stringify(stateToPersist))
  } catch (err) {
    console.error("Failed to save persisted state:", err)
  }
}

// Track which data has been fetched in this session
const fetchedInSession = new Set<string>()

export const clearPersistedState = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PERSIST_KEY)
      fetchedInSession.clear()
    }
  } catch (err) {
    console.error("Failed to clear persisted state:", err)
  }
}
