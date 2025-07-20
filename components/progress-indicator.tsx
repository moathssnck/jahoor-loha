import { Check } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  steps: string[]
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>
              <span className="text-xs mt-2 text-center max-w-20">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
