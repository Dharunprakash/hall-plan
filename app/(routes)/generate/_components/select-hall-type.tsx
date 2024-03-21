"use client"

import { useState } from "react"
import { HallArrangementType } from "@prisma/client"
import { CheckSquare2 } from "lucide-react"

import { HallArrangementTypeArr } from "@/types/enums"
import { generateSeatMatrix } from "@/lib/hall/utils"
import { capitalize, cn } from "@/lib/utils"
import DisplaySeats from "@/components/shared/display-seats"

const SelectHallType = () => {
  const [hallType, setHallType] = useState<HallArrangementType>("NORMAL")

  return (
    <div className="grid grid-cols-3 gap-2">
      {HallArrangementTypeArr.map((type) => (
        <div
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 p-2 pb-4 transition-colors duration-300 ease-in-out hover:border-gray-500",
            hallType === type ? "bg-green-200" : "bg-gray-300"
          )}
          onClick={() => setHallType(type)}
        >
          {hallType === type && (
            <div className="absolute right-0 top-0 p-2">
              <CheckSquare2 size={24} className="text-blue-800" />
            </div>
          )}
          <h3 className="font-orbitron py-1 font-semibold">
            {capitalize(type.toLocaleLowerCase())}
          </h3>
          <DisplaySeats
            color1="bg-blue-500"
            color2="bg-green-500"
            seats={generateSeatMatrix(6, 5, type)}
          />
        </div>
      ))}
    </div>
  )
}

export default SelectHallType
