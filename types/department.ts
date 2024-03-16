import { Department, Hall } from "@prisma/client"

export type DepartmentWithHalls = Department & {
  halls: Hall[]
}
