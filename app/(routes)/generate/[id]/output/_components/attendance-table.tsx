import { Exam } from "@prisma/client"

import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { ScrollArea } from "@/components/ui/scroll-area"

const AttendanceTable = ({
  examDetails,
  hall,
}: {
  examDetails?: Exam
  hall: HallWithSeatsWithStudentsAndDept
}) => {
  console.log(hall)
  return (
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
            </tr>
            <tr>
              <th className="border px-1 !text-[12px]">Register No</th>
            </tr>
          </thead>
          <tbody>
            {hall.seats.map(({ student }, ind) =>
              !student ? null : (
                <tr key={student.id}>
                  <td className="border px-1 !text-[12px]">{student.rollno}</td>
                  <td className="border px-1 !text-[12px]">{student.regno}</td>
                  <td className="border px-1 !text-[12px]">{student.name}</td>
                </tr>
              )
            )}
            <AttendanceTableFooter details={[]} />
          </tbody>
        </table>
      </div>
    </ScrollArea>
  )
}

const AttendanceTableFooter = ({
  details,
}: {
  details: { date: string; timings: string }[]
}) => {
  return (
    <>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Number of Students Present :
        </td>
        {details.map(({ date, timings }, ind) => (
          <td className="border" />
        ))}
      </tr>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Number of Students Absent :
        </td>
        {details.map(({ date, timings }, ind) => (
          <td className="border" />
        ))}
      </tr>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Invigilator Signature
        </td>
        {details.map(({ date, timings }, ind) => (
          <td className="border" />
        ))}
      </tr>
      <tr>
        <td className="border text-center font-bold" colSpan={3}>
          Designation &amp;Department
        </td>
        {details.map(({ date, timings }, ind) => (
          <td className="border" />
        ))}
      </tr>

      <tr>
        <td className="text-center font-bold" colSpan={3}>
          Note:Mark “AB” for Absent
        </td>
        {details.map(({ date, timings }, ind) => (
          <td />
        ))}
      </tr>
    </>
  )
}

export default AttendanceTable
