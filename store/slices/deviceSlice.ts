import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { deviceApi } from "@/store/services/deviceApi"
import { parseApiError } from "@/lib/errorUtils"

interface Device {
  id: number
  device_name: string
  device_type: string
  device_identifier: string
  device_model?: string
  os_name?: string
  os_version?: string
  app_version?: string
  is_active: boolean
  last_used_at?: string
  created_at: string
  [key: string]: any
}

interface DeviceStats {
  total_devices: number
  active_devices: number
  inactive_devices: number
  [key: string]: any
}

interface DeviceState {
  devices: Device[]
  stats: DeviceStats | null
  currentDevice: Device | null
  isLoading: boolean
  error: string | null
}

const initialState: DeviceState = {
  devices: [],
  stats: null,
  currentDevice: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const registerDevice = createAsyncThunk(
  "device/register",
  async (payload: {
    device_name: string
    device_type: string
    device_identifier: string
    device_model?: string
    os_name?: string
    os_version?: string
    app_version?: string
    device_metadata?: Record<string, any>
  }, { rejectWithValue }) => {
    try {
      const response = await deviceApi.registerDevice(payload)
      return response.data.device
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const fetchDevices = createAsyncThunk(
  "device/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceApi.listDevices()
      return response.data.devices
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const updateDevice = createAsyncThunk(
  "device/update",
  async ({ deviceId, data }: { deviceId: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await deviceApi.updateDevice(deviceId, data)
      return response.data.device
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const deactivateDevice = createAsyncThunk(
  "device/deactivate",
  async ({ deviceId, deviceIdentifier }: { deviceId: number; deviceIdentifier: string }, { rejectWithValue }) => {
    try {
      await deviceApi.deactivateDevice(deviceId, deviceIdentifier)
      return deviceId
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

export const fetchDeviceStats = createAsyncThunk(
  "device/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceApi.getDeviceStats()
      return response.data.stats
    } catch (error: any) {
      const parsed = parseApiError(error?.message || error)
      return rejectWithValue(parsed)
    }
  }
)

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setCurrentDevice: (state, action: PayloadAction<Device>) => {
      state.currentDevice = action.payload
    },
    clearDeviceError: (state) => {
      state.error = null
    },
    resetDeviceState: (state) => {
      state.devices = []
      state.stats = null
      state.currentDevice = null
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDevice.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerDevice.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentDevice = action.payload
        state.devices.push(action.payload)
      })
      .addCase(registerDevice.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to register device"
      })
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false
        state.devices = action.payload
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch devices"
      })
      .addCase(updateDevice.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.devices.findIndex(d => d.id === action.payload.id)
        if (index !== -1) {
          state.devices[index] = action.payload
        }
        if (state.currentDevice?.id === action.payload.id) {
          state.currentDevice = action.payload
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to update device"
      })
      .addCase(deactivateDevice.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deactivateDevice.fulfilled, (state, action) => {
        state.isLoading = false
        state.devices = state.devices.filter(d => d.id !== action.payload)
        if (state.currentDevice?.id === action.payload) {
          state.currentDevice = null
        }
      })
      .addCase(deactivateDevice.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to deactivate device"
      })
      .addCase(fetchDeviceStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDeviceStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(fetchDeviceStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch device stats"
      })
  },
})

export const { setCurrentDevice, clearDeviceError, resetDeviceState } = deviceSlice.actions
export default deviceSlice.reducer
