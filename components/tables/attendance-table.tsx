import { formatDate } from "date-fns"

import { DateWithTiming, ExamDetailsWithDate } from "@/types/exam"
import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { intToRoman } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

import DateOfExamModal from "../shared/date-of-exam-modal"

const AttendanceTable = ({
  examDetails,
  hall,
  showHeader = false,
}: {
  examDetails: ExamDetailsWithDate
  hall: HallWithSeatsWithStudentsAndDept
  showHeader?: boolean
}) => {
  const getAllSections = () => {
    const sections = new Set(
      hall.seats.map((s) => s.student?.section || "NULL")
    )
    sections.delete("NULL")
    return Array.from(sections).sort((a, b) => a.localeCompare(b))
  }
  const allSections = getAllSections()
  // !IMPORTANT
  // TODO: Group attendance per hall by year,dept,(semester) of the students
  const year = Array.from(new Set(hall.seats.map((s) => s.year || 0)))[0]
  const semester = Array.from(
    new Set(hall.seats.map((s) => s.semester || 0))
  )[0]
  // TODO: replace this with Actual student's department
  const dept = Array.from(new Set(hall.department.code))
  console.log(hall)
  return (
    <section className="mx-auto w-fit">
      {showHeader && (
        <div className="font-semibold">
          <div className="flex justify-between ">
            {/* Year: IV – A      Semester: VII       Degree: B.E       Branch: CSE */}
            <div>
              Year: {intToRoman(year)} - {allSections.join(" & ")}
            </div>
            <div>Semester: {intToRoman(semester)}</div>
            <div>Degree: B.E</div>
            <div>Branch: {dept}</div>
          </div>
          <div className="flex justify-between gap-2">
            {/* Hall No.:CSE209           Date of Exam: 14-9-23(FN) */}
            <div>Hall No: {hall.hallno}</div>
            <DateOfExamModal examDates={examDetails?.dates} />
          </div>
        </div>
      )}
      <ScrollArea className="whitespace-nowrap rounded-md max-sm:mx-2 max-sm:w-screen max-sm:border max-sm:px-2">
        <div className="table-responsive !text-[11px]">
          <table className="table-bordered mx-auto table">
            <thead>
              <tr>
                <th rowSpan={2} className="border px-1 !text-[12px]">
                  R.No
                </th>
                <th rowSpan={1} className="border px-1 !text-[12px]">
                  Hall No: {hall.hallno}
                </th>
                <th rowSpan={2} className="border px-1 !text-[12px]">
                  Name
                </th>
                {examDetails.dates.map((date) => (
                  <th
                    colSpan={date.an && date.fn ? 2 : 1}
                    rowSpan={date.fn || date.an ? 1 : 2}
                    className="border px-1 !text-[12px]"
                  >
                    {formatDate(date.date, "dd/MM/yy")}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="border px-1 !text-[12px]">Register No</th>
                {examDetails.dates.map((date) => (
                  <>
                    {date.an && (
                      <th className="border px-1 !text-[12px]">AN</th>
                    )}
                    {date.fn && (
                      <th className="border px-1 !text-[12px]">FN</th>
                    )}
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {hall.seats.map(({ student }, ind) =>
                !student ? null : (
                  <tr key={student.id}>
                    <td className="border px-1 !text-[12px]">
                      {student.rollno}
                    </td>
                    <td className="border px-1 !text-[12px]">
                      {student.regno}
                    </td>
                    <td className="border px-1 !text-[12px]">{student.name}</td>
                    <MapEmptyDateCells dates={examDetails.dates} />
                  </tr>
                )
              )}
              <AttendanceTableFooter dates={examDetails.dates} />
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </section>
  )
}

export default AttendanceTable

const AttendanceTableFooter = ({ dates }: { dates: DateWithTiming[] }) => {
  return (
    <>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Number of Students Present :
        </td>
        <MapEmptyDateCells dates={dates} />
      </tr>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Number of Students Absent :
        </td>
        <MapEmptyDateCells dates={dates} />
      </tr>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Invigilator Signature
        </td>
        <MapEmptyDateCells dates={dates} />
      </tr>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Designation &amp;Department
        </td>
        <MapEmptyDateCells dates={dates} />
      </tr>

      <tr>
        <td className="text-center font-bold" colSpan={3}>
          Note:Mark “AB” for Absent
        </td>
        <MapEmptyDateCells dates={dates} />
      </tr>
    </>
  )
}
const MapEmptyDateCells = ({ dates }: { dates: DateWithTiming[] }) => {
  return dates.map((date) => (
    <>
      {date.an && <td className="border px-1 !text-[12px]"></td>}
      {date.fn && <td className="border px-1 !text-[12px]"></td>}
    </>
  ))
}
