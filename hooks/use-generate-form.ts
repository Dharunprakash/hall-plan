import { ExamDetailsType } from "@/schemas/generate-hall/exam-details"
import { HallDetailsSchema } from "@/schemas/generate-hall/hall-details"
import { TimingDetailsType } from "@/schemas/generate-hall/timing-details"
import { z } from "zod"
import { create } from "zustand"

interface GenerateFormState {
  step: number
  examDetailForm: z.infer<typeof ExamDetailsType> | null
  timingDetails: z.infer<typeof TimingDetailsType> | null
  hallDetails: z.infer<typeof HallDetailsSchema> | null
  setStep: (step: number) => void
  setExamDetailForm: (data: z.infer<typeof ExamDetailsType> | null) => void
  setTimingDetails: (data: z.infer<typeof TimingDetailsType> | null) => void
  setHallDetails: (data: z.infer<typeof HallDetailsSchema> | null) => void
}

export const usegenerateForm = create<GenerateFormState>((set) => ({
  step: 4,
  setStep: (step) => set({ step }),
  examDetailForm: null,
  timingDetails: null,
  hallDetails: null,
  setTimingDetails: (data) => set({ timingDetails: data ? { ...data } : null }),
  setHallDetails: (data) => set({ hallDetails: data ? { ...data } : null }),
  setExamDetailForm: (data) =>
    set({ examDetailForm: data ? { ...data } : null }),
}))
