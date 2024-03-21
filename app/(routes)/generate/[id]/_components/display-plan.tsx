import React from "react"
import Link from "next/link"

import { ExamDetails } from "@/types/exam"
import { Button } from "@/components/ui/button"

import AttendanceTable from "./attendance-table"
import HallArrangementTable from "./hall-arrangement-table"

const DisplayPlan = ({ name, data }: { name: string; data: ExamDetails }) => {
  const { students, halls, ...examDetails } = data
  return (
    <div className="flex flex-col items-center gap-16">
      {/* <DisplayDownloadOptions name={name} size={data.length} /> */}
      {data.halls.map((hall, index) => (
        <div className="flex max-w-6xl flex-col gap-8">
          <div className="!mx-3 flex flex-wrap gap-2">
            <h1 className="text-2xl font-bold">
              {name} {index + 1}
            </h1>
            <Button onClick={() => console.log()}>Download</Button>
            <Link href={`preview/${name}/${name}${index}`} target="_blank">
              <Button>Print Preview</Button>
            </Link>
          </div>
          {name === "attendance" && (
            <AttendanceTable examDetails={examDetails} hall={hall} />
          )}
          {name === "seatarrangement" && (
            <HallArrangementTable examDetails={examDetails} hall={hall} />
          )}
        </div>
      ))}
    </div>
  )
}

export default DisplayPlan
