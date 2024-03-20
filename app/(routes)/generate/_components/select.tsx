import { use } from "react"

import { usegenerateForm } from "@/hooks/use-generate-form"

import { ExamDetailForm } from "./exam-detail-form"

export const SelectForm = ({
  generateId,
  onClose,
}: {
  generateId?: string
  onClose?: () => void
}) => {
  const { step, setStep } = usegenerateForm()
  return <>{step === 1 && <ExamDetailForm onClose={onClose} />}</>
}
