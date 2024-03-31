import { Date, Department, Exam, Student, Timing } from "@prisma/client"

import { HallWithSeatsWithStudentsAndDept } from "./hall"

export type ExamDetails = Exam & {
  halls: HallWithSeatsWithStudentsAndDept[]
  department: Department | null
  students: Student[]
}

export type ExamDetailsWithDate = ExamDetails & ExamWithDates

export type ExamWithDates = Exam & {
  dates: DateWithTiming[]
}

export type PrismaDate = {
  id: string
  date: Date
  examId: string
}

export type DateWithTiming = PrismaDate & {
  an: Timing | null
  fn: Timing | null
}

export type PrismaDateExtended = PrismaDate & {
  fn: Timing | null
  an: Timing | null
  exam: Exam
}
