// export type { isBlocked: boolean; row: number; col: number }

import { Seat, Student } from "@prisma/client"

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

export type SeatWithStudent = Seat & {
  student: Student | null
}
