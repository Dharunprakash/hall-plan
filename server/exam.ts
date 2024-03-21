import { z } from "zod"

import { ExamDetails } from "@/types/exam"
import { db } from "@/lib/db"

import { publicProcedure, router } from "./trpc"

export const examRouter = router({
  get: publicProcedure
    .input(z.string())
    .query(async ({ input: id }): Promise<ExamDetails | null> => {
      const res = await db.exam.findUnique({
        where: {
          id,
        },
        include: {
          halls: {
            include: {
              department: true,
              seats: {
                include: {
                  student: true,
                },
              },
            },
          },
          department: true,
          students: true,
        },
      })
      return res
    }),
})
