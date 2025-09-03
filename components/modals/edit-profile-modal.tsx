"use client"

import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "@/store/slices/authSlice"
import { api } from "@/lib/api"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Calendar as CalendarIcon, Upload, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const africanCountries = [
  { code: "ZW", name: "Zimbabwe" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "EG", name: "Egypt" },
  { code: "ET", name: "Ethiopia" },
  { code: "UG", name: "Uganda" },
  { code: "TZ", name: "Tanzania" },
  { code: "RW", name: "Rwanda" },
  { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" },
  { code: "ZM", name: "Zambia" },
  { code: "MW", name: "Malawi" },
  { code: "MZ", name: "Mozambique" },
  { code: "AO", name: "Angola" },
  { code: "CM", name: "Cameroon" },
  { code: "CI", name: "Ivory Coast" },
  { code: "SN", name: "Senegal" },
  { code: "ML", name: "Mali" },
  { code: "BF", name: "Burkina Faso" },
  { code: "NE", name: "Niger" },
  { code: "TD", name: "Chad" },
  { code: "SD", name: "Sudan" },
  { code: "LY", name: "Libya" },
  { code: "TN", name: "Tunisia" },
  { code: "DZ", name: "Algeria" },
  { code: "MA", name: "Morocco" },
  { code: "SO", name: "Somalia" },
  { code: "DJ", name: "Djibouti" },
  { code: "ER", name: "Eritrea" },
  { code: "SS", name: "South Sudan" },
  { code: "CF", name: "Central African Republic" },
  { code: "CG", name: "Republic of the Congo" },
  { code: "CD", name: "Democratic Republic of the Congo" },
  { code: "GA", name: "Gabon" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ST", name: "São Tomé and Príncipe" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GN", name: "Guinea" },
  { code: "SL", name: "Sierra Leone" },
  { code: "LR", name: "Liberia" },
  { code: "TG", name: "Togo" },
  { code: "BJ", name: "Benin" },
  { code: "MR", name: "Mauritania" },
  { code: "GM", name: "Gambia" },
  { code: "CV", name: "Cape Verde" },
  { code: "MU", name: "Mauritius" },
  { code: "SC", name: "Seychelles" },
  { code: "KM", name: "Comoros" },
  { code: "MG", name: "Madagascar" },
  { code: "BI", name: "Burundi" },
  { code: "LS", name: "Lesotho" },
  { code: "SZ", name: "Eswatini" },
]

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const dispatch = useDispatch()
  const { user } = useSelector((state: any) => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user?.date_of_birth ? new Date(user.date_of_birth) : undefined
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone_number || "",
    date_of_birth: user?.date_of_birth || "",
    country: user?.country || "",
    city: user?.city || "",
    bio: user?.bio || "",
    avatar: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("first_name", formData.first_name)
      formDataToSend.append("last_name", formData.last_name)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("date_of_birth", formData.date_of_birth)
      formDataToSend.append("country", formData.country)
      formDataToSend.append("city", formData.city)
      formDataToSend.append("bio", formData.bio)
      
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar)
      }

      const response = await api.updateProfile(formDataToSend)
      
      if (response.success) {
        // Fetch updated profile
        const profileResponse = await api.getProfile()
        if (profileResponse.success) {
          dispatch(updateUser(profileResponse.data.user))
          // Update localStorage
          localStorage.setItem("userData", JSON.stringify(profileResponse.data.user))
        }
        
        dispatch(showSnackbar({ message: "Profile updated successfully!", type: "success" }))
        onClose()
      } else {
        throw new Error(response.message || "Failed to update profile")
      }
    } catch (error: any) {
      dispatch(showSnackbar({ 
        message: error.message || "Failed to update profile", 
        type: "error" 
      }))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-blue-600 shadow-lg">
                <AvatarImage 
                  src={formData.avatar ? URL.createObjectURL(formData.avatar) : user?.avatar || "/placeholder-user.jpg"} 
                  alt="Profile" 
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold">
                  {(user?.full_name || "U")?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 shadow-lg"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-gray-400 text-center">
              Click the upload icon to change your profile picture
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-gray-300">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-gray-300">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                      !selectedDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      if (date) {
                        setFormData(prev => ({ 
                          ...prev, 
                          date_of_birth: date.toISOString().split('T')[0] 
                        }))
                      }
                    }}
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-300">Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  {africanCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="hover:bg-gray-700">
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-300">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
      </div>
    </div>
  )
}
