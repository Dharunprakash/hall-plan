import React from "react"

import { DateWithTiming } from "@/types/exam"
import { getFormatedStartAndEndDate } from "@/lib/utils"

const DateOfExamModal = ({ examDates }: { examDates?: DateWithTiming[] }) => {
  const [start, end] = getFormatedStartAndEndDate(
    examDates?.map((d) => d.date) || []
  )
  return (
    <div>
      Date of Exam: {start}
      {start === end ? null : " - " + end}
    </div>
  )
}

export default DateOfExamModal
