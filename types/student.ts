import { Department, Student } from "@prisma/client"

export type StudentWithDept = Student & {
  department: Department
}

export type StudentWithDeptWithActions = StudentWithDept & {
  actions: any
}
