import { Department, Hall, Seat } from "@prisma/client"

import { BasicSeat, SeatWithStudent } from "./seat"

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

export type HallWithSeatsWithStudentsAndDept = HallWithDept & {
  seats: SeatWithStudent[]
}

export type HallPlanExtra = {
  year: number
  semester: number
  section: string
  startRollNo: number
  endRollNo: number
}

export type HallPlan = HallWithSeatsWithStudentsAndDept & HallPlanExtra

export type MinimalHall = {
  id: string
  hallno: number
  department: {
    code: string
  }
}
