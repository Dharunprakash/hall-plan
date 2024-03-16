import { Department, Hall, Seat } from "@prisma/client"

export type HallWithSeatsAndDept = Hall & {
  seats: Seat[]
  department: Department
}
