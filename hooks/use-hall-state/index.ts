import { create } from "zustand"

import { HallState, hallSlice } from "./hall-slice"
import { SeatsState, seatsSlice } from "./seats-slice"

export type hallStateWithSeat = HallState & SeatsState

export const useHallStateWithSeat = create<hallStateWithSeat>((...a) => ({
  ...hallSlice(...a),
  ...seatsSlice(...a),
}))
