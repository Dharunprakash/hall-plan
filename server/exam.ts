import { GenerateHallSchema } from "@/schemas/generate-hall/input-schema"
import { ExamType, HallArrangementType } from "@prisma/client"
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
  delete: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    const studentIds = await db.student.findMany({
      where: {
        examIds: {
          has: id,
        },
      },
      select: {
        id: true,
      },
    })
    await db.exam.update({
      where: {
        id,
      },
      data: {
        students: {
          disconnect: studentIds,
        },
      },
    })
    return await db.exam.delete({
      where: {
        id,
      },
    })
  }),
  // get All exams pagination
  getAll: publicProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(10),
        type: z.nativeEnum(ExamType).nullish(),
        startDate: z.string().nullish(),
        endDate: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const res = await db.exam.findMany({
        where: {
          AND:
            input.startDate && input.endDate
              ? [
                  {
                    updatedAt: {
                      gte: new Date(input.startDate),
                    },
                  },
                  {
                    updatedAt: {
                      lte: new Date(input.endDate),
                    },
                  },
                  { type: input.type ? { equals: input.type } : undefined },
                ]
              : { type: input.type ? { equals: input.type } : undefined },
        },
        include: {
          department: true,
        },
        skip: input.skip,
        take: input.take,
        orderBy: {
          updatedAt: "desc",
        },
      })
      return res
    }),
  getExamsCount: publicProcedure.input(z.string()).query(async () => {
    return await db.exam.count()
  }),
})
