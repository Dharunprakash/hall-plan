import { Selection } from "@nextui-org/react"
import { create } from "zustand"

import { MinimalHall } from "@/types/hall"

type SelectedStudents = {
  departmentIds: Selection
  halls: MinimalHall[]
  setDeptFilter: (dept: Selection) => void
  setHalls: (halls: MinimalHall[]) => void
  getDepartmentIds: () => string[]
  getHalls: () => string[]
}

export const useSelectedHalls = create<SelectedStudents>((set, get) => ({
  departmentIds: new Set<string>(),
  halls: [],
  setDeptFilter: (dept) => set({ departmentIds: dept }),
  setHalls: (halls) => set({ halls }),
  getDepartmentIds: () => Array.from(get().departmentIds.toString()),
  getHalls: () => get().halls.map((hall) => hall.department.code + hall.hallno),
}))
