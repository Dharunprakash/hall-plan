import { Department, Hall, Seat } from "@prisma/client"

import { BasicSeat } from "./seat"

export type HallWithSeats = Hall & {
  seats: Seat[]
}

export type HallWithDept = Hall & {
  department: Department
}

export type HallWithSeatsAndDept = HallWithSeats & HallWithDept

export type HallWithDeptAndBasicSeats = HallWithDept & {
  seats: BasicSeat[][]
}
