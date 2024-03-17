"use client"

import React, { useEffect, useState } from "react"
import { Seat } from "@prisma/client"

import { BasicSeat } from "@/types/seat"
import { generateSeatMatrix } from "@/lib/hall/utils"
import { cn } from "@/lib/utils"
import { useHallStateWithSeat } from "@/hooks/use-hall-state"

const SeatBox = ({
  seats: InitialSeats,
}: {
  seats: (Partial<Seat> & BasicSeat)[][]
}) => {
  const setSeats = useHallStateWithSeat((s) => s.setSeats)
  const rows = useHallStateWithSeat((s) => s.rows)
  const cols = useHallStateWithSeat((s) => s.cols)
  const seats = useHallStateWithSeat((s) => s.seats)
  useEffect(() => {
    setSeats(InitialSeats)
  }, [InitialSeats, setSeats])
  useEffect(() => {
    setSeats(generateSeatMatrix(rows, cols))
  }, [rows, cols, setSeats])

  return (
    <>
      {seats.map((row, i) => (
        <tr key={i}>
          {row.map((seat, j) => (
            <td key={seat.id}>
              <SeatToggle i={i} j={j} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function SeatToggle({ i, j }: { i: number; j: number }) {
  const isEditing = useHallStateWithSeat((s) => s.isEditing)
  const toggleSeat = useHallStateWithSeat((s) => s.toggleSeat)
  const getSeat = useHallStateWithSeat((s) => s.getSeat)
  const [isBlocked, setIsBlocked] = useState<boolean>(
    () => getSeat(i, j).isBlocked
  )
  const handleClick = () => {
    setIsBlocked((prev) => {
      toggleSeat(i, j)
      return !prev
    })
  }

  return (
    <div
      className={cn(
        "h-6 w-6 rounded-md border bg-white",
        isBlocked && "bg-red-500"
      )}
      onClick={() => {
        if (isEditing) {
          handleClick()
        }
      }}
    ></div>
  )
}

export default SeatBox
