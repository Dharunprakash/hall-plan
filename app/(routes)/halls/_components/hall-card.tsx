import { HallWithSeatsAndDept } from "@/types/hall"
import { getHallCapacity, mapArrayOfPairToMatrix } from "@/lib/hall/utils"
import { cn } from "@/lib/utils"

import DisplayHallDimension from "./display-hall-dimension"
import EditHallButton from "./edit-hall-button"
import SeatBox from "./seat-box"

const HallCard = ({
  hall,
  className,
}: {
  hall: HallWithSeatsAndDept
  className?: string
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
        <EditHallButton hallId={hall.id} />
      </div>
      <div className="grid w-full grid-cols-2">
        <DisplayHallDimension className="text-center" />
        <div className="text-center">
          <p>Type: {hall.type}</p>
          <p>TotalSeats: {getHallCapacity(hall)}</p>
        </div>
      </div>
      {/* display  */}
      <div className="mx-auto w-full">
        <table className="table-bordered mx-auto table">
          <tbody>
            <SeatBox seats={seats} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HallCard
