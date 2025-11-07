import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "@/lib/api"
import { parseApiError } from "@/lib/errorUtils"
import { subscriptionApi } from "@/store/services/subscriptionApi"


interface Plan { id: number; name: string; price: string;[k: string]: any }
interface PaymentMethod { key?: string; id?: string; name?: string; label?: string;[k: string]: any }

interface SubscriptionState {
  plans: Plan[] | null
  paymentMethods: PaymentMethod[] | null
  currentSubscription: any | null
  isLoading: boolean
  error: string | null
}

const initialState: SubscriptionState = {
  plans: null,
  paymentMethods: null,
  currentSubscription: null,
  isLoading: false,
  error: null,
}

export const fetchPlans = createAsyncThunk("subscription/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const res = await subscriptionApi.getPlans()
    return res.data
  } catch (err: any) {
    const parsed = parseApiError(err.message || err)
    return rejectWithValue(parsed)
  }
})

export const fetchPaymentMethods = createAsyncThunk(
  "subscription/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const res = await subscriptionApi.getPaymentMethods()
      // expect { success, message, data: { methods: [...] } }
      return res.data?.methods || []
    } catch (err: any) {
      const parsed = parseApiError(err?.message || err)
      return rejectWithValue(parsed)
    }
  }
)

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (payload: {
    planId: number
    billingCycle: "monthly" | "yearly"
    paymentMethod?: string
  }, { rejectWithValue }) => {
    try {
      const res = await subscriptionApi.createSubscription(payload)
      return res.data
    } catch (err: any) {
      const parsed = parseApiError(err?.message || err)
      return rejectWithValue(parsed)
    }
  }
)

export const cancelSubscription = createAsyncThunk(
  "subscription/cancel",
  async (_, { rejectWithValue }) => {
    try {
      const res = await subscriptionApi.cancelSubscription()
      return res.data
    } catch (err: any) {
      const parsed = parseApiError(err?.message || err)
      return rejectWithValue(parsed)
    }
  }
)

export const fetchCurrentSubscription = createAsyncThunk(
  "subscription/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await subscriptionApi.getCurrentSubscription()
      return res.data
    } catch (err: any) {
      const parsed = parseApiError(err?.message || err)
      return rejectWithValue(parsed)
    }
  }
)

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setPaymentMethods: (state, action: PayloadAction<any[]>) => {
      state.paymentMethods = action.payload
    },
    clearSubscriptionError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<any>) => { state.isLoading = false; state.plans = action.payload?.subscription_plans || action.payload || [] })
      .addCase(fetchPlans.rejected, (state, action) => { state.isLoading = false; const p = action.payload as any; state.error = p?.message || "Failed to fetch plans" })

      .addCase(fetchPaymentMethods.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false
        state.paymentMethods = action.payload
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to load payment methods"
      })

      .addCase(createSubscription.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSubscription = action.payload
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to create subscription"
      })

      .addCase(cancelSubscription.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.isLoading = false
        state.currentSubscription = null
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to cancel subscription"
      })

      .addCase(fetchCurrentSubscription.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSubscription = action.payload
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || "Failed to fetch current subscription"
      })
  },
})

export const { setPaymentMethods, clearSubscriptionError } = subscriptionSlice.actions
export default subscriptionSlice.reducer
