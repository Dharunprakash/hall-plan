import { Seat } from "@prisma/client"
import { StateCreator } from "zustand"

import { BasicSeat } from "@/types/seat"

export type SeatsState = {
  seats: (Partial<Seat> & BasicSeat)[][]
  setSeats: (seats: (Partial<Seat> & BasicSeat)[][]) => void
  toggleSeat: (row: number, col: number) => void
  getSeat: (row: number, col: number) => Partial<Seat> & BasicSeat
}

export const seatsSlice: StateCreator<SeatsState, []> = (set, get) => ({
  seats: [],
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
})
