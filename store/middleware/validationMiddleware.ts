import { Middleware } from "@reduxjs/toolkit"
import { getStoredTokens } from "@/lib/auth"

/**
 * Validation middleware that checks auth state consistency
 */
export const validationMiddleware: Middleware = (store) => (next) => (action) => {
  // Run action first
  const result = next(action)
  
  // After action, validate state consistency
  const state = store.getState()
  
  // Validate auth state matches stored tokens
  if (action.type?.startsWith('auth/')) {
    const { accessToken } = getStoredTokens()
    const { isAuthenticated } = state.auth
    
    // If tokens exist but state says not authenticated, fix it
    if (accessToken && !isAuthenticated && action.type !== 'auth/logout/fulfilled') {
      console.warn('Auth state mismatch detected, tokens exist but state is not authenticated')
    }
    
    // If no tokens but state says authenticated, clear it
    if (!accessToken && isAuthenticated) {
      console.warn('Auth state mismatch detected, no tokens but state is authenticated')
    }
  }
  
  return result
}
