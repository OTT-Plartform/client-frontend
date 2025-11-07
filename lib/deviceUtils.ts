export interface DeviceInfo {
  device_name: string
  device_type: "mobile" | "tablet" | "desktop"
  device_identifier: string
  device_model: string
  os_name: string
  os_version: string
  app_version: string
  device_metadata: {
    user_agent: string
    screen_resolution?: string
    timezone: string
  }
}

const DEVICE_IDENTIFIER_KEY = "device_identifier"

/**
 * Detects device type from user agent
 */
export function detectDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  const isMobile = /Mobi|Android/i.test(userAgent)
  const isTablet = /iPad|Tablet/i.test(userAgent)
  
  if (isTablet) return "tablet"
  if (isMobile) return "mobile"
  return "desktop"
}

/**
 * Gets or creates a stable device identifier
 */
export function getOrCreateDeviceIdentifier(): string {
  if (typeof window === "undefined") {
    return `server-${Date.now()}`
  }

  try {
    let deviceIdentifier = localStorage.getItem(DEVICE_IDENTIFIER_KEY)
    
    if (!deviceIdentifier) {
      deviceIdentifier = crypto?.randomUUID 
        ? crypto.randomUUID() 
        : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      
      localStorage.setItem(DEVICE_IDENTIFIER_KEY, deviceIdentifier)
    }
    
    return deviceIdentifier
  } catch (error) {
    console.warn("Failed to access localStorage for device identifier:", error)
    return `fallback-${Date.now()}`
  }
}

/**
 * Gets comprehensive device information
 */
export function getDeviceInfo(): Partial<DeviceInfo> {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const userAgent = navigator.userAgent || ""
    const device_type = detectDeviceType(userAgent)
    const device_name = navigator.platform || "web"
    const device_model = navigator.vendor || "browser"
    const device_identifier = getOrCreateDeviceIdentifier()
    
    // Try to get OS info from userAgentData (modern browsers)
    const os_name = (navigator as any).userAgentData?.platform 
      || navigator.platform 
      || "unknown"
    
    const os_version = "" // Can be enhanced with more sophisticated detection
    
    const app_version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"
    
    const screen_resolution = `${window.screen.width}x${window.screen.height}`
    
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    return {
      device_name,
      device_type,
      device_identifier,
      device_model,
      os_name,
      os_version,
      app_version,
      device_metadata: {
        user_agent: userAgent,
        screen_resolution,
        timezone,
      },
    }
  } catch (error) {
    console.warn("Failed to get device info:", error)
    return {}
  }
}

/**
 * Clears stored device identifier (useful for logout)
 */
export function clearDeviceIdentifier(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(DEVICE_IDENTIFIER_KEY)
    } catch (error) {
      console.warn("Failed to clear device identifier:", error)
    }
  }
}
