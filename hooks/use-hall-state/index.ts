import { Seat } from "@prisma/client"
import { create } from "zustand"

import { BasicSeat } from "@/types/seat"

const initialState = {
  isEditing: false,
  rows: 6,
  cols: 5,
  hallId: "",
  seats: [],
}

export type SeatsState = {
  seats: (Partial<Seat> & BasicSeat)[][]
  setSeats: (seats: (Partial<Seat> & BasicSeat)[][]) => void
  toggleSeat: (row: number, col: number) => void
  getSeat: (row: number, col: number) => Partial<Seat> & BasicSeat
}

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

export type hallStateWithSeat = HallState &
  SeatsState & {
    clearState: () => void
  }

export const useHallStateWithSeat = create<hallStateWithSeat>((set, get) => ({
  ...initialState,
  setIsEditing: (isEditing) => set({ isEditing }),
  toggleEditing: () =>
    set((state) => ({ isEditing: !state.isEditing })),

  setRows: (rows) => set({ rows }),
  setCols: (cols) => set({ cols }),

  setSeats: (seats) => set({ seats }),
  toggleSeat: (row, col) =>
    set((state) => {
      const newSeats = state.seats
      newSeats[row][col].isBlocked = !newSeats[row][col].isBlocked
      return { seats: newSeats }
    }),
  getSeat: (row, col) => {
    return get().seats[row][col]
  },
  clearState: () =>
    set({
      ...initialState,
    }),
}))
