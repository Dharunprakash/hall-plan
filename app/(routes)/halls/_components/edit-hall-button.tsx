"use client"

import { CheckIcon, EditIcon, XIcon } from "lucide-react"

import { useHallStateWithSeat } from "@/hooks/use-hall-state"

import HandleSubmit from "./handle-submit"

const EditHallButton = ({ hallId }: { hallId: string }) => {
  const toggleEditing = useHallStateWithSeat((s) => s.toggleEditing)
  const isEditing = useHallStateWithSeat((s) => s.isEditing)

  return (
    <div className="flex items-center gap-2">
      <button
        className="flex cursor-pointer rounded-md p-1 transition-all hover:bg-slate-500 hover:text-white"
        onClick={toggleEditing}
      >
        {isEditing ? (
          <XIcon className="h-4 w-4 text-red-500" />
        ) : (
          <EditIcon className="h-4 w-4" />
        )}
      </button>
      <HandleSubmit hallId={hallId} />
    </div>
  )
}

export default EditHallButton
