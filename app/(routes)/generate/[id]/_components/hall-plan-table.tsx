// @ts-ignore
import React from "react"

import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const groupHallByStudentYear = (halls: HallWithSeatsWithStudentsAndDept[]) => {
  const grouped: Record<string, HallWithSeatsWithStudentsAndDept[]> = {}
  halls.forEach((hall) => {
    hall.seats.forEach((seat) => {
      if (!seat.student) return

      const year = seat.year
      const semester = seat.semester
      if (!year || !semester) return
      if (!grouped[`${year}-${semester}`]) {
        grouped[`${year}-${semester}`] = []
      }
      grouped[`${year}-${semester}`].push(hall)
    })
  })
  return grouped
}

export const segregateHallsBySection = (
  halls: HallWithSeatsWithStudentsAndDept[]
) => {
  const pairsHallsAndSections: Record<
    string,
    (HallWithSeatsWithStudentsAndDept & {
      section: string
      startRollNo: number
      endRollNo: number
    })[]
  > = {}
  for (const hall of halls) {
    for (const seat of hall.seats) {
      if (!seat.student) continue
      const section = seat.student.section
      if (!pairsHallsAndSections[section]) {
        pairsHallsAndSections[section] = []
      }
    }
  }
  const hallPlans: [string, HallWithSeatsWithStudentsAndDept][] = []
  for (const section in pairsHallsAndSections) {
    for (const hall of pairsHallsAndSections[section]) {
      hallPlans.push([section, hall])
    }
  }
  return { pairsHallsAndSections, hallPlans }
}

const HallPlanTable = ({
  year,
  semester,
  halls,
}: {
  year: string
  semester: string
  halls: HallWithSeatsWithStudentsAndDept[]
}) => {
  const { hallPlans } = segregateHallsBySection(halls)
  return (
    <ScrollArea className="whitespace-nowrap rounded-md max-sm:mx-2 max-sm:w-screen max-sm:border max-sm:px-2">
      <div className="table-responsive">
        <table className="table-bordered mx-auto table">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
              >
                Year / Semester
              </th>
              <th
                rowSpan={2}
                className="border px-4 py-2 text-center md:min-w-[140px]"
              >
                Section
              </th>
              <th
                colSpan={2}
                rowSpan={1}
                className="border px-4 py-2 text-center md:min-w-[160px]"
              >
                Roll No
              </th>
              <th
                rowSpan={2}
                className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
              >
                Hall No. & Total Strength
              </th>

              <th
                rowSpan={2}
                className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
              >
                Block / Floor
              </th>
            </tr>
            <tr>
              <th className="min-w-[70px] border px-4 py-2 md:min-w-[80px]">
                From
              </th>
              <th className="min-w-[70px] border px-4 py-2 md:min-w-[80px]">
                To
              </th>
            </tr>
          </thead>
          <tbody>
            {hallPlans.map(([section, hall], ind) => (
              <tr>
                {ind == 0 && (
                  <td
                    className={`border px-4 py-2 text-center`}
                    rowSpan={halls.length}
                  >
                    {year} / {semester}
                  </td>
                )}
                <td className="border px-4 py-2 text-center">{section}</td>
                <td className="border px-4 py-2 text-center">
                  {/* {hall.rollNo.from} */}
                </td>
                <td className="border px-4 py-2 text-center">
                  {/* {hall.rollNo.to} */}
                </td>
                <td className="border px-4 py-2 text-center">{hall.hallno}</td>
                {ind == 0 && (
                  <td
                    // rowSpan={data.length}
                    className="border px-4 py-2 text-center"
                  >
                    {/* {hall.dept} */}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default HallPlanTable
