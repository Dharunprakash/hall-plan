import { Selection } from "@nextui-org/react"
import { create } from "zustand"

type SelectedStudents = {
  departmentIds: Selection
  years: Selection
  count: number
  setCount: (count: number) => void
  setDeptFilter: (dept: Selection) => void
  setYearsFilter: (years: Selection) => void
  getDepartmentIds: () => string[]
  getYears: () => number[]
}

export const useSelectedStudents = create<SelectedStudents>((set, get) => ({
  departmentIds: "all",
  years: "all",
  count: 0,
  setCount: (count) => {
    set({ count })
  },
  setDeptFilter: (dept) => {
    set({ departmentIds: dept })
  },
  setYearsFilter: (years) => {
    set({ years })
  },
  getDepartmentIds: () =>
    Array.from(get().departmentIds).map((dept) => String(dept)),
  getYears: () => Array.from(get().years).map((year) => Number(year)),
}))
