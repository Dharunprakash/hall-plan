import { Seat } from "@prisma/client"
import { StateCreator } from "zustand"

import { BasicSeat } from "@/types/seat"

export type SeatsState = {
  seats: (Partial<Seat> & BasicSeat)[][]
  setSeats: (seats: (Partial<Seat> & BasicSeat)[][]) => void
  toggleSeat: (row: number, col: number) => void
}

export const seatsSlice: StateCreator<SeatsState, []> = (set) => ({
  seats: [],
  setSeats: (seats) => set({ seats }),
  toggleSeat: (row, col) =>
    set((state) => {
      const newSeats = state.seats
      newSeats[row][col].isBlocked = !newSeats[row][col].isBlocked
      return { seats: newSeats }
    }),
})
