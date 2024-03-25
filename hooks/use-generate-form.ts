import { ExamDetailsType } from "@/schemas/generate-hall/exam-details"
import { z } from "zod"
import { create } from "zustand"

interface GenerateFormState {
  step: number
  examDetailForm: z.infer<typeof ExamDetailsType> | null
  setStep: (step: number) => void
  setExamDetailForm: (data: z.infer<typeof ExamDetailsType> | null) => void
}

export const usegenerateForm = create<GenerateFormState>((set) => ({
  step: 2,
  setStep: (step) => set({ step }),
  examDetailForm: null,
  setExamDetailForm: (data) =>
    set({ examDetailForm: data ? { ...data } : null }),
}))
