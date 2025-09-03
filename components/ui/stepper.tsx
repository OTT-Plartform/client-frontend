import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: {
    title: string
    description: string
    icon: React.ReactNode
  }[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step Icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  index + 1 <= currentStep
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-400"
                )}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              
              {/* Step Labels */}
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    index + 1 <= currentStep ? "text-white" : "text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connecting Line - Perfectly centered */}
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center mx-2">
                <div
                  className={cn(
                    "w-16 h-1 transition-all duration-300",
                    index + 1 < currentStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gray-700"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Step Indicator */}
      <div className="text-center mt-6">
        <p className="text-white text-lg font-medium">
          Step {currentStep} of {steps.length}
        </p>
      </div>
    </div>
  )
}
