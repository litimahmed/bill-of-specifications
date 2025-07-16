"use client";

import { useState } from "react";
import Step1 from "@/components/steps/step1";
import Step2 from "@/components/steps/step2";
import Step3 from "@/components/steps/step3";
import Step4 from "@/components/steps/step4";
import Step5 from "@/components/steps/step5";
import Summary from "@/components/steps/summary";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormData,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  SummaryData,
} from "@/types/form";
import { FormProvider } from "@/hook/FormContext";

const steps = [Step1, Step2, Step3, Step4, Step5, Summary];

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(0); // Start at step 1 for testing
  const [formData, setFormData] = useState<FormData>({
    step1: undefined,
    step2: undefined,
    step3: undefined,
    step4: undefined,
    step5: undefined,
    summary: undefined,
    pricing: {
      totalCost: 0,
      brandingStatusCost: 0,
      hostingStatusCost: 0,
      languageCost: 0,
    },
  });

  const CurrentStepComponent = steps[currentStep];

  const goNext = (
    data:
      | Step1Data
      | Step2Data
      | Step3Data
      | Step4Data
      | Step5Data
      | SummaryData
  ) => {
    setFormData((prev) => {
      if (currentStep === 0) {
        return {
          ...prev,
          step1: data as Step1Data,
          pricing: {
            ...prev.pricing,
            ...(data as Step1Data).pricing, // Merge pricing
          },
        };
      } else if (currentStep === 1) {
        return {
          ...prev,
          step2: data as Step2Data,
          pricing: {
            ...prev.pricing,
            ...(data as Step2Data).pricing,
          },
        };
      } else if (currentStep === 2) {
        return {
          ...prev,
          step3: data as Step3Data,
          pricing: {
            ...prev.pricing,
            ...(data as Step3Data).pricing,
          },
        };
      } else if (currentStep === 3) {
        return {
          ...prev,
          step4: data as Step4Data,
          pricing: {
            ...prev.pricing,
            ...(data as Step4Data).pricing,
          },
        };
      } else if (currentStep === 4) {
        return {
          ...prev,
          step5: data as Step5Data,
          pricing: {
            ...prev.pricing,
            ...(data as Step5Data).pricing,
          },
        };
      } else if (currentStep === 5) {
        const finalData = {
          ...prev,
          summary: data as SummaryData,
          pricing: {
            ...prev.pricing,
            ...(data as SummaryData).pricing,
          },
        };
        console.log("Final Form Data:", finalData);
        return finalData;
      }
      return prev;
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl shadow-2xl">
          <CardContent className="p-6">
            <Progress
              value={(currentStep / (steps.length - 1)) * 100}
              className="mb-6"
            />
            <CurrentStepComponent
              onNext={goNext} // Pass goNext directly
              onBack={currentStep > 0 ? goBack : () => {}}
              formData={formData}
            />
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
