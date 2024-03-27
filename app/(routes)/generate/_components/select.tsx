import { use } from "react"

import { usegenerateForm } from "@/hooks/use-generate-form"

import { ExamDetailForm } from "./exam-detail-form"
import Selecthalls from "./select-hall-form"
import SelectHallType from "./select-hall-type"
import DateForm from "./time-select-form"

export const SelectForm = ({
  generateId,
  onClose,
}: {
  generateId?: string
  onClose?: () => void
}) => {
  const { step, setStep } = usegenerateForm()
  return (
    <>
      {step === 1 && <ExamDetailForm onClose={onClose} />}
      {step === 2 && <DateForm onClose={onClose} />}
      {step === 3 && <SelectHallType onClose={onClose} />}
      {step === 4 && <Selecthalls onClose={onClose} />}
    </>
  )
}
