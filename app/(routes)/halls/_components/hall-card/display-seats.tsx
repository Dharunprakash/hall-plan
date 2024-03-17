import { memo } from "react"

import { BasicSeat } from "@/types/seat"
import { cn } from "@/lib/utils"

const DisplaySeats = ({
  seats,
  isEditing,
  toggleBlockSeat,
}: {
  seats: BasicSeat[][]
  isEditing: boolean
  toggleBlockSeat: (row: number, col: number) => void
}) => {
  return (
    <div className="mx-auto w-full max-w-full overflow-x-auto">
      <table className="table-bordered mx-auto table">
        <tbody>
          {seats.map((row, i) => (
            <tr key={i}>
              {row.map((seat, j) => (
                <td key={`display-hall-${i}-${j}`}>
                  <div
                    className={cn(
                      "h-6 w-6 rounded-md border bg-white",
                      seat.isBlocked && "bg-red-500"
                    )}
                    onClick={() => {
                      if (isEditing) {
                        toggleBlockSeat(i, j)
                      }
                    }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(DisplaySeats)
