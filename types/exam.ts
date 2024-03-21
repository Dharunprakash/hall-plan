import { Department, Exam, Student } from "@prisma/client"

import { HallWithSeatsWithStudentsAndDept } from "./hall"

export type ExamDetails = Exam & {
  halls: HallWithSeatsWithStudentsAndDept[]
  department: Department | null
  students: Student[]
}
