import { Edit2Icon } from "lucide-react"

import { HallWithSeatsAndDept } from "@/types/hall"
import { getHallCapacity, mapArrayOfPairToMatrix } from "@/lib/hall/utils"
import { cn } from "@/lib/utils"

const HallCard = ({
  hall,
  className,
}: {
  hall: HallWithSeatsAndDept
  className: string
}) => {
  const seats = mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols)
  return (
    <div
      className={cn(
        "relative my-2 rounded-lg border border-slate-100 !bg-slate-100 p-3",
        className
      )}
    >
      <div className="flex w-full items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">
          {hall.department.code.substring(0, 2)}
          {hall.hallno}
        </h1>
        <div>
          <Edit2Icon className="ml-2 h-4 w-4 cursor-pointer" />
        </div>
      </div>
      <div className="flex w-full flex-row-reverse items-center justify-between">
        <p>Type: {hall.type}</p>
        <p>TotalSeats: {getHallCapacity(hall)}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <p>Rows: {hall.rows}</p>
        <p>Cols: {hall.cols}</p>
      </div>
      {/* display  */}
      <div className="mx-auto w-full">
        <table className="table-bordered mx-auto table">
          <tbody>
            {seats.map((row, i) => (
              <tr key={i}>
                {row.map((seat, j) => (
                  <td key={seat.id}>
                    <div
                      className={cn(
                        "h-6 w-6 rounded-md border bg-white",
                        seat.isBlocked && "bg-red-500"
                      )}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HallCard
