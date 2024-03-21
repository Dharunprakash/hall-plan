import { memo } from "react"

import { BasicSeat } from "@/types/seat"
import { cn } from "@/lib/utils"

const DisplaySeats = ({
  color1 = "bg-white",
  color2 = "bg-red-500",
  seats,
  isEditing,
  toggleBlockSeat,
  className,
}: {
  color1?: string
  color2?: string
  seats: BasicSeat[][]
  className?: string
} & (
  | {
      isEditing: boolean
      toggleBlockSeat: (row: number, col: number) => void
    }
  | {
      isEditing?: undefined
      toggleBlockSeat?: never
    }
)) => {
  return (
    <div className={cn("mx-auto w-full max-w-full overflow-x-auto", className)}>
      <table className="table-bordered mx-auto table">
        <tbody>
          {seats.map((row, i) => (
            <tr key={i}>
              {row.map((seat, j) => (
                <td key={`display-hall-${i}-${j}`}>
                  <div
                    className={cn(
                      `h-6 w-6 rounded-md border ${color1}`,
                      seat.isBlocked && color2
                    )}
                    onClick={() => {
                      if (isEditing && isEditing !== undefined) {
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
