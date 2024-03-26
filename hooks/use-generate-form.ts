import { ExamDetailsType } from "@/schemas/generate-hall/exam-details"
import { TimingDetailsType } from "@/schemas/generate-hall/timing-details"
import { z } from "zod"
import { create } from "zustand"

interface GenerateFormState {
  step: number
  examDetailForm: z.infer<typeof ExamDetailsType> | null
  timingDetails: z.infer<typeof TimingDetailsType> | null
  setStep: (step: number) => void
  setExamDetailForm: (data: z.infer<typeof ExamDetailsType> | null) => void
  setTimingDetails: (data: z.infer<typeof TimingDetailsType> | null) => void
}

export const usegenerateForm = create<GenerateFormState>((set) => ({
  step: 2,
  setStep: (step) => set({ step }),
  examDetailForm: null,
  timingDetails: null,
  setTimingDetails: (data) => set({ timingDetails: data ? { ...data } : null }),
  setExamDetailForm: (data) =>
    set({ examDetailForm: data ? { ...data } : null }),
}))
