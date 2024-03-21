import { HallArrangementType } from "@prisma/client"
import { create } from "zustand"

type HallType = {
  hallType: HallArrangementType
  setHallType: (hallType: HallArrangementType) => void
}

export const useSelectHallType = create<HallType>((set, get) => ({
  hallType: "NORMAL",
  setHallType: (hallType) => {
    set({ hallType })
  },
}))
