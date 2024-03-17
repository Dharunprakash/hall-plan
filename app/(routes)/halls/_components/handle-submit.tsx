"use client"
import React from "react"
import { CheckIcon } from "lucide-react"

import { mapMatrixToArrayOfPair } from "@/lib/hall/utils"
import { useHallStateWithSeat } from "@/hooks/use-hall-state"
import { trpc } from "@/app/_trpc/client"

const HandleSubmit = ({ hallId }: { hallId: string }) => {
  const editHall = trpc.hall.edit.useMutation()
  const setIsEditing = useHallStateWithSeat((s) => s.setIsEditing)
  const isEditing = useHallStateWithSeat((s) => s.isEditing)
  const seats = useHallStateWithSeat((s) => s.seats)

  const handleSubmit = async () => {
    console.log('hallId', hallId)
    // await editHall.mutateAsync({
    //   id: hallId,
    //   rows: seats.length,
    //   cols: seats[0].length,
    //   seats: mapMatrixToArrayOfPair(seats),
    // })
    setIsEditing(false)
  }
  if (!isEditing) {
    return null
  }

  return (
    <button
      className="flex cursor-pointer gap-2 rounded-md p-1 transition-all hover:bg-slate-500 hover:text-white"
      onClick={handleSubmit}
    >
      <CheckIcon className="h-4 w-4" />
    </button>
  )
}

export default HandleSubmit
