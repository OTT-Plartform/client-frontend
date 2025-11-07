import { apiClient } from "@/lib/apiClient"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export const deviceApi = {
  async registerDevice(data: any): Promise<ApiResponse<{ device: any }>> {
    return apiClient.post<ApiResponse>("/devices/register", data)
  },

  async listDevices(): Promise<ApiResponse<{ devices: any[] }>> {
    return apiClient.get<ApiResponse>("/devices")
  },

  async updateDevice(deviceId: number, data: any): Promise<ApiResponse<{ device: any }>> {
    return apiClient.put<ApiResponse>(`/devices/${deviceId}`, data)
  },

  async deactivateDevice(deviceId: number, deviceIdentifier: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/devices/${deviceId}`, {
      body: { device_identifier: deviceIdentifier },
    })
  },

  async getDeviceStats(): Promise<ApiResponse<{ stats: any }>> {
    return apiClient.get<ApiResponse>("/devices/stats")
  },
}
