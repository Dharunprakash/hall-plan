import React from "react"
import { format } from "date-fns"
import { X } from "lucide-react"

import { useDurationDetails } from "@/hooks/use-duration-details"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const DisplayChosenDates = () => {
  const { removeDate, details, setTimingsForDate } = useDurationDetails()

  console.log(details)
  return (
    <div className="flex max-w-3xl flex-wrap">
      {details.map(({ date, timings }) => (
        <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 p-1">
          <span
            key={date}
            className="flex items-center rounded-2xl bg-slate-200 px-1"
          >
            {format(date, "dd-MM-yyyy")}
            <button
              type="button"
              className="ml-2 text-red-500"
              onClick={() => removeDate(date)}
            >
              <X size={15} />
            </button>
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="fn"
                checked={timings.fn}
                onCheckedChange={(checked) => {
                  setTimingsForDate(date, { ...timings, fn: !!checked })
                }}
              />
              <Label
                htmlFor="fn"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                FN
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="an"
                checked={timings.an}
                onCheckedChange={(checked) => {
                  console.log(checked)
                  setTimingsForDate(date, { ...timings, an: !!checked })
                }}
              />
              <Label
                htmlFor="an"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                AN
              </Label>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DisplayChosenDates
