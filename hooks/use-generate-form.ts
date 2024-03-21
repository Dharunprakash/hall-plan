import { z } from "zod"
import { create } from "zustand"

interface GenerateFormState {
  step: number
  setStep: (step: number) => void
}

export const usegenerateForm = create<GenerateFormState>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
}))
