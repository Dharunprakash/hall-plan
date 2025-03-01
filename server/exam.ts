import { ExamType, HallArrangementType } from "@prisma/client"
import { z } from "zod"

import { ExamDetails, ExamDetailsWithDate } from "@/types/exam"
import { HallWithSeatsAndDept } from "@/types/hall"
import { db } from "@/lib/db"

import { planRouter } from "./plan"
import { publicProcedure, router } from "./trpc"

export const examRouter = router({
  plan: planRouter,
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
          dates: true,
        },
      })
      return res
    }),
  updateHalls: publicProcedure
    .input(
      z.object({
        examId: z.string(),
        hallIds: z.array(z.string()),
        type: z.nativeEnum(HallArrangementType),
      })
    )
    .mutation(async ({ input }): Promise<HallWithSeatsAndDept[]> => {
      // TODO: optimize this to be single query
      let exam = await db.exam.findUnique({
        where: {
          id: input.examId,
        },
        include: {
          halls: {
            include: {
              department: true,
              seats: true,
            },
          },
        },
      })
      if (!exam) {
        throw new Error("Exam not found")
      }
      let existingHallIds = exam.halls.map((hall) => hall.id)
      let hallsToBeDeleted = existingHallIds.filter(
        (hallId) => !input.hallIds.includes(hallId)
      )
      let hallsToBeAdded = input.hallIds.filter(
        (hallId) => !existingHallIds.includes(hallId)
      )
      console.log(hallsToBeDeleted)
      console.log(hallsToBeAdded)
      let halls = await db.hall.findMany({
        where: {
          id: {
            in: hallsToBeAdded,
          },
        },
        include: {
          department: true,
          seats: true,
        },
      })
      const newHalls = await db.$transaction(async (tx) => {
        const newHallsThatAreCopyOfItsParentPromise = Promise.all(
          halls.map(({ type, id, department, seats, ...hall }) => {
            return tx.hall.create({
              data: {
                ...hall,
                rootHallId: id,
                departmentId: hall.departmentId,
                examId: input.examId,
                type: input.type,
                seats: {
                  createMany: {
                    data: seats.map(
                      ({ id, hallId, studentId, year, semester, ...seat }) => ({
                        ...seat,
                      })
                    ),
                  },
                },
              },
              include: {
                department: true,
                seats: true,
              },
            })
          })
        )
        const oldHallsThatAreDeletedPromise = Promise.all(
          hallsToBeDeleted.map((hallId) => {
            return tx.hall.delete({
              where: {
                id: hallId,
              },
            })
          })
        )
        const [newHallsThatAreCopyOfItsParent] = await Promise.all([
          newHallsThatAreCopyOfItsParentPromise,
          oldHallsThatAreDeletedPromise,
        ])
        return newHallsThatAreCopyOfItsParent
      })
      const currentHallsForExam = [
        ...exam.halls
          .filter((hall) => !hallsToBeDeleted.includes(hall.id))
          .map((hall) => hall),
        ...newHalls,
      ]
      return currentHallsForExam
    }),

  editExam: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    const res = await db.exam.findUnique({
      where: {
        id,
      },
      include: {
        halls: {
          select: {
            type: true,
          },
        },
        dates: {
          include: {
            an: true,
            fn: true,
          },
        },
      },
    })
    return res
  }),

  delete: publicProcedure.input(z.string()).mutation(async ({ input: id }) => {
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
  getDetailed: publicProcedure
    .input(z.string())
    .query(async ({ input: id }): Promise<ExamDetailsWithDate | null> => {
      return await getDetailedExam(id)
    }),
  preview: publicProcedure
    .input(z.string())
    .query(async ({ input: id }): Promise<ExamDetailsWithDate | null> => {
      return await getDetailedExam(id)
    }),
})

export const getDetailedExam = async (id: string) => {
  return await db.exam.findUnique({
    where: {
      id,
    },
    include: {
      dates: {
        orderBy: {
          date: "asc",
        },
        include: {
          fn: true,
          an: true,
        },
      },
      department: true,
      students: {
        orderBy: [
          {
            department: {
              code: "asc",
            },
          },
          {
            year: "asc",
          },
          {
            section: "asc",
          },
          {
            rollno: "asc",
          },
        ],
      },
      halls: {
        orderBy: [
          {
            department: {
              code: "asc",
            },
          },
          {
            hallno: "asc",
          },
        ],
        where: {
          examId: id,
          rootHallId: {
            not: null,
          },
        },
        include: {
          department: true,
          seats: {
            orderBy: [
              {
                hall: {
                  department: {
                    code: "asc",
                  },
                },
              },
              {
                hall: {
                  hallno: "asc",
                },
              },
              {
                row: "asc",
              },
              {
                col: "asc",
              },
            ],
            include: {
              student: {
                include: {
                  department: true,
                },
              },
            },
          },
        },
      },
    },
  })
}
