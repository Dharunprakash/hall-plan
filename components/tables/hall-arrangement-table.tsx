import { Exam } from "@prisma/client"
import { format } from "date-fns"

import { ExamDetailsWithDate } from "@/types/exam"
import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { mapArrayOfPairToMatrix } from "@/lib/hall/utils"
import { intToRoman } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

import DateOfExamModal from "../shared/date-of-exam-modal"

const HallArrangementTable = ({
  examDetails,
  hall,
  showHeader = false,
}: {
  examDetails?: ExamDetailsWithDate
  hall: HallWithSeatsWithStudentsAndDept
  showHeader?: boolean
}) => {
  const seats = mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols)

  return (
    <section className="mx-auto w-fit">
      {showHeader && (
        <div className="font-semibold">
          <div className="flex justify-between ">
            <DateOfExamModal examDates={examDetails?.dates} />
            {/* LEAST Important TODO: GET actual time object */}
            <div className="flex gap-2">
              {!!examDetails?.timingFn && (
                <p>Time: {examDetails.timingFn} (FN)</p>
              )}
              {!!examDetails?.timingAn && (
                <p>Time: {examDetails.timingAn} (AN)</p>
              )}
            </div>
          </div>
          <div className="flex justify-between ">
            <div>HALL NO: {hall.hallno}</div>
            {/* TODO: use this s.studentId !== null */}
            <div>Total: {hall.seats.filter((s) => !s.isBlocked).length}</div>
          </div>
        </div>
      )}
      <div className="table-responsive">
        <ScrollArea className="whitespace-nowrap rounded-md max-sm:mx-2 max-sm:w-screen max-sm:border max-sm:px-2">
          <table className="table-bordered mx-auto table">
            <thead>
              <tr>
                {seats[0]?.map((_, index) => (
                  <th className="border px-4 py-2 text-center">
                    col {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seats.map((row, i) => (
                <tr key={i}>
                  {row.map((seat, j) => (
                    <td
                      key={seat.id}
                      className="w-[100px] border px-4 py-2 text-center"
                    >
                      <div className="text-sm">
                        {seat.student
                          ? `${intToRoman(seat.student.year)}-${
                              seat.student.section
                            }(${seat.student.rollno})`
                          : "Empty"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </section>
  )
}

export default HallArrangementTable
