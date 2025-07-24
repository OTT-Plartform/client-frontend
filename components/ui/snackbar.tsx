"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { hideSnackbar } from "@/store/slices/uiSlice"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Snackbar() {
  const dispatch = useDispatch()
  const { snackbar } = useSelector((state: RootState) => state.ui)

  useEffect(() => {
    if (snackbar.isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideSnackbar())
      }, snackbar.duration)

      return () => clearTimeout(timer)
    }
  }, [snackbar.isVisible, snackbar.duration, dispatch])

  if (!snackbar.isVisible) return null

  const getIcon = () => {
    switch (snackbar.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getAlertClass = () => {
    switch (snackbar.type) {
      case "success":
        return "border-green-500 bg-green-900/20"
      case "error":
        return "border-red-500 bg-red-900/20"
      case "info":
        return "border-blue-500 bg-blue-900/20"
      default:
        return "border-gray-500 bg-gray-900/20"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className={`${getAlertClass()} backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
          {getIcon()}
          <AlertDescription className="text-white flex-1">{snackbar.message}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-6 w-6"
            onClick={() => dispatch(hideSnackbar())}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}
