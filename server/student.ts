import { excelFormSchema, singleStudentSchema } from "@/schemas/student"
import { z } from "zod"

import { StudentWithDept } from "@/types/student"
import { db } from "@/lib/db"

import { publicProcedure, router } from "./trpc"

const sortStudents = (students: StudentWithDept[]) => {
  return students.sort((a, b) => {
    if (a.department.code === b.department.code) {
      if (a.section === b.section) {
        return a.rollno - b.rollno
      }
      return a.section < b.section ? -1 : 1
    }
    return a.department.code < b.department.code ? -1 : 1
  })
}

export const studentRouter = router({
  getAll: publicProcedure.query(async (): Promise<StudentWithDept[]> => {
    return sortStudents(
      await db.student.findMany({
        include: { department: true },
        orderBy: [
          {
            department: {
              code: "asc",
            },
          },
          {
            section: "asc",
          },
          {
            rollno: "asc",
          },
        ],
      })
    )
  }),
  getAllMinimal: publicProcedure.query(async () => {
    return await db.student.findMany({
      select: {
        year: true,
        department: {
          select: {
            code: true,
          },
        },
      },
    })
  }),
  upsertOne: publicProcedure
    .input(singleStudentSchema)
    .mutation(async ({ input }) => {
      const { departmentId, ...data } = input
      return await db.student.upsert({
        where: {
          regno: input.regno,
        },
        update: data,
        create: input,
        include: {
          department: true,
        },
      })
    }),
  upsertMany: publicProcedure
    .input(excelFormSchema)
    .mutation(async ({ input }) => {
      const { studentData, departmentId, strength, ...rest } = input
      const data = studentData.map((student) => {
        return {
          ...student,
          ...rest,
        }
      })
      const res = await Promise.all(
        data.map((std) => {
          return db.student.upsert({
            where: {
              regno: std.regno,
            },
            update: std,
            create: {
              ...std,
              departmentId,
            },
            include: {
              department: true,
            },
          })
        })
      )
      return sortStudents(
        res.sort((a, b) => (a.department.code < b.department.code ? 1 : -1))
      )
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input: id }) => {
    return await db.student.delete({
      where: { id },
    })
  }),
})
