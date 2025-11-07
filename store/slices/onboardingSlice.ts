import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { onboardingApi } from "@/store/services/onboardingApi"
import { parseApiError } from "@/lib/errorUtils"

interface PersonalInfo {
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    country: string
    city: string
    bio: string
}

interface OnboardingData {
    personalInfo: PersonalInfo
    interests: number[]
    selectedPlan: number
    paymentMethod: string
    subscriptionPeriod: "monthly" | "yearly"
}

interface OnboardingState {
    onboardingData: OnboardingData
    isLoading: boolean
    error: string | null
}

const initialState: OnboardingState = {
    onboardingData: {
        personalInfo: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            dateOfBirth: "",
            country: "ZW",
            city: "",
            bio: "",
        },
        interests: [],
        selectedPlan: 0,
        paymentMethod: "",
        subscriptionPeriod: "monthly",
    },
    isLoading: false,
    error: null,
}

// Async thunks
export const savePersonalInfo = createAsyncThunk(
    "onboarding/savePersonalInfo",
    async (payload: PersonalInfo, { rejectWithValue }) => {
        try {
            const res = await onboardingApi.savePersonalInfo({
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNumber: payload.phoneNumber,
                dateOfBirth: payload.dateOfBirth,
                country: payload.country,
                city: payload.city,
                bio: payload.bio || undefined,
            })
            return res
        } catch (err: any) {
            const parsed = parseApiError(err?.message || err)
            return rejectWithValue(parsed)
        }
    }
)

export const saveGenres = createAsyncThunk(
    "onboarding/saveGenres",
    async (genreIds: number[], { rejectWithValue }) => {
        try {
            const res = await onboardingApi.saveGenres(genreIds)
            return res
        } catch (err: any) {
            const parsed = parseApiError(err?.message || err)
            return rejectWithValue(parsed)
        }
    }
)

export const saveSubscription = createAsyncThunk(
    "onboarding/saveSubscription",
    async (payload: {
        planId: number
        billingCycle: "monthly" | "yearly"
        paymentMethod?: string
    }, { rejectWithValue }) => {
        try {
            const res = await onboardingApi.saveSubscription(payload)
            return res
        } catch (err: any) {
            const parsed = parseApiError(err?.message || err)
            return rejectWithValue(parsed)
        }
    }
)

const onboardingSlice = createSlice({
    name: "onboarding",
    initialState,
    reducers: {
        setPersonalInfoField: (state, action: PayloadAction<{ field: keyof PersonalInfo; value: string }>) => {
            const { field, value } = action.payload
            state.onboardingData.personalInfo[field] = value
        },
        setSelectedPlan: (state, action: PayloadAction<number>) => {
            state.onboardingData.selectedPlan = action.payload
        },
        setPaymentMethod: (state, action: PayloadAction<string>) => {
            state.onboardingData.paymentMethod = action.payload
        },
        setSubscriptionPeriod: (state, action: PayloadAction<"monthly" | "yearly">) => {
            state.onboardingData.subscriptionPeriod = action.payload
        },
        setInterests: (state, action: PayloadAction<number[]>) => {
            state.onboardingData.interests = action.payload
        },
        resetOnboarding: (state) => {
            state.onboardingData = initialState.onboardingData
            state.isLoading = false
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(savePersonalInfo.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(savePersonalInfo.fulfilled, (state) => {
                state.isLoading = false
                // leave onboardingData in state (it already holds what we saved)
            })
            .addCase(savePersonalInfo.rejected, (state, action) => {
                state.isLoading = false
                state.error = (action.payload as any)?.message || "Failed to save personal info"
            })

        builder
            .addCase(saveGenres.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(saveGenres.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(saveGenres.rejected, (state, action) => {
                state.isLoading = false
                state.error = (action.payload as any)?.message || "Failed to save genres"
            })

        builder
            .addCase(saveSubscription.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(saveSubscription.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(saveSubscription.rejected, (state, action) => {
                state.isLoading = false
                state.error = (action.payload as any)?.message || "Failed to save subscription"
            })
    },
})

export const {
    setPersonalInfoField,
    setSelectedPlan,
    setPaymentMethod,
    setSubscriptionPeriod,
    setInterests,
    resetOnboarding,
    clearError,
} = onboardingSlice.actions

export default onboardingSlice.reducer
