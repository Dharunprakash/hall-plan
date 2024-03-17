import { HallWithSeatsAndDept } from "@/types/hall"
import { getHallCapacity, mapArrayOfPairToMatrix } from "@/lib/hall/utils"
import { cn } from "@/lib/utils"
import { useHallStateWithSeat } from "@/hooks/use-hall-state"

import DisplayHallDimension from "./display-hall-dimension"
import EditHallButton from "./edit-hall-button"
import EditHall from "./form/edit-hall"

const HallCard = ({
  hall,
  className,
}: {
  hall: HallWithSeatsAndDept
  className?: string
}) => {
  const tmp = mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols)
  useHallStateWithSeat.setState({
    seats: tmp,
  })
  const seats = useHallStateWithSeat.getState().seats
  console.log(seats)
  return (
    <div
      className={cn(
        "relative my-2 rounded-lg border border-slate-100 !bg-slate-100 p-3",
        className
      )}
    >
      <EditHall hall={hall} />
      <div className="flex w-full items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">
          {hall.department.code.substring(0, 2)}
          {hall.hallno}
        </h1>
        <EditHallButton />
      </div>
      <div className="flex w-full flex-row-reverse items-center justify-between">
        <p>Type: {hall.type}</p>
        <p>TotalSeats: {getHallCapacity(hall)}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <DisplayHallDimension />
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
