import { Department } from "@prisma/client"

import { StudentWithDept } from "@/types/student"

export type GroupingKey = {
  department?: Department
  year?: number
  section?: string
  subject?: string
}

export function isGroupingKey(key: string): key is keyof GroupingKey {
  return ["department", "year", "section", "subject"].includes(key)
}

export class GroupedStudent {
  key: GroupingKey
  students: StudentWithDept[]

  constructor(key: GroupingKey, students: StudentWithDept[]) {
    this.key = key
    this.students = students
  }

  getStudents(): StudentWithDept[] {
    return this.students
  }

  getKey() {
    return this.key
  }
}
