import React, { createContext, useContext, useState } from "react";
import type { FormData } from "@/types/form"; // ✅ Use your real type here

interface FormContextType {
  formData: FormData;
  updateFormData: <T extends keyof FormData>(
    step: T,
    data: FormData[T]
  ) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>({
    pricing: {
      brandingStatusCost: 0,
      hostingStatusCost: 0,
      languageCost: 0,
      totalCost: 0,
    },
  });

  const updateFormData = <T extends keyof FormData>(
    step: T,
    data: FormData[T]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
