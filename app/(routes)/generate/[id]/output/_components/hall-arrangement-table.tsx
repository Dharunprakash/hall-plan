import { Exam } from "@prisma/client"

import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { mapArrayOfPairToMatrix } from "@/lib/hall/utils"
import { intToRoman } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const HallArrangementTable = ({
  examDetails,
  hall,
}: {
  examDetails?: Exam
  hall: HallWithSeatsWithStudentsAndDept
}) => {
  const seats = mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols)
  return (
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
  )
}

export default HallArrangementTable
