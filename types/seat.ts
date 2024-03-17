// export type { isBlocked: boolean; row: number; col: number }

// SeatPosition
// SeatStatus
// BasicSeat

export type SeatPosition = {
  row: number
  col: number
}

export type SeatStatus = {
  isBlocked: boolean
}

export type BasicSeat = SeatPosition & SeatStatus
