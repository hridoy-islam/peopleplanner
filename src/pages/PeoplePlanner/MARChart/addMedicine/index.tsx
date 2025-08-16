import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom" // 🔁 Added navigate

import NameStep from "../components/medication-form/name-step"
import DetailsStep from "../components/medication-form/details-step"
import InstructionsStep from "../components/medication-form/instructions-step"
import SaveStep from "../components/medication-form/save-step"
import ScheduleStep from "../components/medication-form/schedule-step"

const steps = [
  { id: "name", title: "Name", component: NameStep },
  { id: "schedule", title: "Schedule", component: ScheduleStep },
  { id: "instructions", title: "Instructions", component: InstructionsStep },
  { id: "details", title: "Details", component: DetailsStep },
  { id: "save", title: "Save", component: SaveStep },
]

export default function AddMedicationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    medicineType: "",
    scheduleType: "",
    scheduledTimes: [],
    prnInstructions: "",
    dosage: "",
    instructions: "",
    startDate: "",
    endDate: "",
    frequency: "",
  })

  const navigate = useNavigate() // ✅ Hook for navigation
  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  // ✅ Handle final save
  const handleSave = () => {
    console.log("Saving medication:", formData)
    // Here you can call an API to save the medication
    // await saveMedication(formData)

    // Navigate to MAR Chart after save
    navigate("/admin/people-planner/mar-chart")
  }

  return (
    <div className="min-h-screen">
      <div className=" space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            className="bg-supperagent text-white hover:bg-supperagent/90"
            size="sm"
            onClick={() => navigate(-1)} // Go back to chart
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chart
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Medication</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? "text-supperagent" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep ? "bg-supperagent text-white" : "bg-gray-300 text-black"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSave={currentStep === steps.length - 1 ? handleSave : undefined} // Pass save only on last step
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSave}
              className="bg-supperagent hover:bg-supperagent/90 text-white"
            >
              Save Medication
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-supperagent hover:bg-supperagent/90 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}