import React from "react"

import { ExamDetails } from "@/types/exam"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const VerticalCount = ({ examDetail }: { examDetail: ExamDetails }) => {
  const verticalNames = Array.from(
    new Set(examDetail.students.map((student) => student.vertical || "NONE"))
  )
  return (
    <ScrollArea className="whitespace-nowrap rounded-md max-sm:mx-2 max-sm:w-screen max-sm:border max-sm:px-2">
      <div className="table-responsive">
        <table className="table-bordered mx-auto table">
          <thead>
            <tr>
              <th className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base">
                Hall No.
              </th>
              {verticalNames.map((name, i) => (
                <th
                  className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
                  key={name}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examDetail.halls.map((hall) => (
              <tr>
                <td className="border px-4 py-2 text-center">{hall.hallno}</td>
                {verticalNames.map((name, i) => (
                  <td className="border px-4 py-2 text-center" key={name}>
                    {
                      hall.seats.filter(
                        ({ student }) => student?.vertical === name
                      ).length
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default VerticalCount
