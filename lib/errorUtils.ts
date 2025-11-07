export interface ValidationErrors {
  [field: string]: string
}

export interface ParsedError {
  message: string
  validationErrors?: ValidationErrors
  statusCode?: number
}

/**
 * Parses API error responses into a standardized format
 */
export function parseApiError(error: any): ParsedError {
  // Default error response
  const defaultError: ParsedError = {
    message: "An unexpected error occurred",
  }

  if (!error) return defaultError

  // Handle string errors (might be JSON)
  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error)
      return parseApiError(parsed)
    } catch {
      return { message: error }
    }
  }

  // Handle error objects with validation errors
  if (error.errors && typeof error.errors === 'object') {
    return {
      message: error.message || "Validation failed",
      validationErrors: error.errors,
      statusCode: error.status || error.statusCode,
    }
  }

  // Handle standard error object
  if (error.message) {
    return {
      message: error.message,
      statusCode: error.status || error.statusCode,
    }
  }

  // Handle error with only error property
  if (error.error) {
    return { message: error.error }
  }

  return defaultError
}

/**
 * Extracts validation errors from parsed error
 */
export function getValidationErrors(error: ParsedError): ValidationErrors {
  return error.validationErrors || {}
}

/**
 * Checks if error contains validation errors
 */
export function hasValidationErrors(error: ParsedError): boolean {
  return !!error.validationErrors && Object.keys(error.validationErrors).length > 0
}
