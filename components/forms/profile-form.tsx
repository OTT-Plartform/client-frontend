"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { RootState } from "@/store/store"
import { updateUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"

const profileSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().optional(),
  bio: yup.string().max(500, "Bio must be less than 500 characters").optional(),
})

type ProfileFormData = yup.InferType<typeof profileSchema>

export default function ProfileForm() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)

    setTimeout(() => {
      dispatch(updateUser(data))
      dispatch(showSnackbar({ message: "Profile updated successfully!", type: "success" }))
      const updatedUser = { ...user, ...data }
      localStorage.setItem("userData", JSON.stringify(updatedUser))
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-gray-900/80 rounded-xl shadow-lg p-6 md:p-10 backdrop-blur-md"
    >
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            type="button"
            size="icon"
            className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-white font-semibold">Profile Picture</h3>
          <p className="text-gray-400 text-sm">Click the camera icon to update your avatar</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          {...register("phone")}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white">
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
          {...register("bio")}
        />
        {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </div>
    </form>
  )
}
