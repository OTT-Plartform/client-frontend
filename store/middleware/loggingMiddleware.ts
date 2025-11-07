import { Middleware } from "@reduxjs/toolkit"

const isDevelopment = process.env.NODE_ENV === "development"

/**
 * Logging middleware for development debugging
 */
export const loggingMiddleware: Middleware = (store) => (next) => (action) => {
  if (!isDevelopment) return next(action)
  
  const prevState = store.getState()
  console.group(`Action: ${action.type}`)
  console.log("Previous State:", prevState)
  console.log("Action:", action)
  
  const result = next(action)
  
  const nextState = store.getState()
  console.log("Next State:", nextState)
  console.groupEnd()
  
  return result
}
