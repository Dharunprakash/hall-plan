import React from "react"
import { Hall, Seat } from "@prisma/client"

import { HallWithSeats } from "@/types/hall"
import { cn } from "@/lib/utils"

const mapArrayOfPairToMatrix = (arr: Seat[], rows: number, cols: number) => {
  const matrix: Seat[][] = new Array(rows)
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array(cols)
  }
  for (const seat of arr) {
    matrix[seat.row][seat.col] = seat
  }
  return matrix
}

const HallCard = ({
  hall,
  className,
}: {
  hall: HallWithSeats
  className: string
}) => {
  const seats = mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols)
  return (
    <div
      className={cn(
        "relative my-2 flex items-center gap-3 rounded-lg border border-slate-100 !bg-slate-100 p-3",
        className
      )}
    >
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">{hall.hallno}</h1>
        <p>Capacity: {hall.capacity}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <p>Type: {hall.type}</p>
        <p>Rows: {hall.rows}</p>
        <p>Cols: {hall.cols}</p>
      </div>
      {/* display  */}
      <div>
        <table></table>
      </div>
    </div>
  )
}

export default HallCard
