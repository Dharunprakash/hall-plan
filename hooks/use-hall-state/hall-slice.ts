import { StateCreator } from "zustand"

export type HallState = {
  hallId: string
  isEditing: boolean
  rows: number
  cols: number
  setRows: (row: number) => void
  setCols: (col: number) => void
  setIsEditing: (isEditing: boolean) => void
  toggleEditing: () => void
}

export const hallSlice: StateCreator<HallState, []> = (set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
  rows: 6,
  cols: 5,
  hallId: "",
  setRows: (rows) => set({ rows }),
  setCols: (cols) => set({ cols }),
})
