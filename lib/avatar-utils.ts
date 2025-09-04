// Utility functions for handling avatar URLs

/**
 * Formats Google avatar URLs to ensure they display correctly
 * Converts malformed URLs like "lh3.googleusercontent.com//a//ACg8ocL-II9A_R6ozaD53aRQsh8gvkdQtlFG0SQPaw6DOf7sOzsjlA=s96-c"
 * to proper URLs like "https://lh3.googleusercontent.com/a/ACg8ocL-II9A_R6ozaD53aRQsh8gvkdQtlFG0SQPaw6DOf7sOzsjlA=s96-c"
 */
export function formatAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null

  // If it's already a proper URL, return as is
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl
  }

  // Handle Google avatar URLs that might be malformed
  if (avatarUrl.includes('googleusercontent.com')) {
    // Remove any double slashes and ensure proper protocol
    const cleanedUrl = avatarUrl
      .replace(/\/\/+/g, '/') // Replace multiple slashes with single slash
      .replace(/^\/+/, '') // Remove leading slashes
    
    // Add https protocol if missing
    if (!cleanedUrl.startsWith('http')) {
      return `https://${cleanedUrl}`
    }
    
    return cleanedUrl
  }

  // For other URLs, add https if no protocol is specified
  if (!avatarUrl.startsWith('http')) {
    return `https://${avatarUrl}`
  }

  return avatarUrl
}

/**
 * Gets the user's display name for avatar fallback
 */
export function getUserDisplayName(user: any): string {
  if (!user) return 'U'
  
  // Try different name properties in order of preference
  if (user.full_name) return user.full_name
  if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
  if (user.first_name) return user.first_name
  if (user.email) return user.email.split('@')[0]
  
  return 'U'
}

/**
 * Gets the first letter of the user's name for avatar fallback
 */
export function getUserInitials(user: any): string {
  const name = getUserDisplayName(user)
  return name.charAt(0).toUpperCase()
}
