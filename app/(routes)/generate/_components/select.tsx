import { use } from "react"

import { usegenerateForm } from "@/hooks/use-generate-form"

import { ExamDetailForm } from "./exam-detail-form"
import DateForm from "./date-select-form"

export const SelectForm = ({
  generateId,
  onClose,
}: {
  generateId?: string
  onClose?: () => void
}) => {
  const { step, setStep } = usegenerateForm()
  return <>
  {step === 1 && <ExamDetailForm onClose={onClose} />}
  {step ===2 && <DateForm  onClose={onClose} />}
  </>
}
