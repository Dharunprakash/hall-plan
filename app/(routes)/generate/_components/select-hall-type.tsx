"use client"

import { HallArrangementType } from "@prisma/client"
import { CheckSquare2 } from "lucide-react"

import { HallArrangementTypeArr } from "@/types/enums"
import { generateSeatMatrix } from "@/lib/hall/utils"
import { capitalize, cn } from "@/lib/utils"
import { useSelectHallType } from "@/hooks/use-select-hall-type"
import DisplaySeats from "@/components/shared/display-seats"
import { Button } from "@/components/ui/button"

const SelectHallType = ({ onClose }: { onClose?: () => void }) => {
  const setHallType = useSelectHallType((state) => state.setHallType)

  return (
    <>
    <div className="grid grid-cols-3 gap-2">
      {HallArrangementTypeArr.map((type) => (
        <div
          className={cn(
            "relative !z-50 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 bg-transparent p-2 pb-4 transition-colors duration-300 ease-in-out"
          )}
          onClick={() => setHallType(type)}
        >
          <SelectedStyle type={type} />
          <CheckModal type={type} />
          <h3 className="font-orbitron z-50 py-1 font-semibold">
            {capitalize(type.toLocaleLowerCase())}
          </h3>
          <DisplaySeats
            className="z-50"
            color1="bg-blue-500"
            color2="bg-green-500"
            seats={generateSeatMatrix(6, 5, type)}
          />
        </div>
      ))}
    </div>
      <div className="flex w-full justify-end gap-x-5 mt-2">
        <Button color="danger" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
    </>
  )
}

const SelectedStyle = ({ type }: { type: HallArrangementType }) => {
  const hallType = useSelectHallType((state) => state.hallType)

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 rounded-lg",
        hallType === type ? "bg-green-200" : "bg-gray-300"
      )}
    >
    </div>
  )
}

export const CheckModal = ({ type }: { type: HallArrangementType }) => {
  const hallType = useSelectHallType((state) => state.hallType)
  if (hallType === type)
    return (
      <div className="absolute right-0 top-0 z-50 p-2">
        <CheckSquare2 size={24} className="text-blue-800" />
      </div>
    )
  return null
}
export default SelectHallType
