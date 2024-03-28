import { GenerateHallSchema } from "@/schemas/generate-hall/input-schema"
import { HallArrangementType } from "@prisma/client"
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
  create: publicProcedure
    .input(GenerateHallSchema)
    .mutation(async ({ input }) => {
      const {
        examDetails,
        timingDetails,
        hallType,
        durationDetails,
        ...hallDetails
      } = input
      const exam = await db.exam.create({
        data: {
          academicYear: examDetails.academicYear,
          name: examDetails.name,
          semester: examDetails.semester,
          departmentId:
            examDetails.type === "INTERNAL" ||
            examDetails.type === "MODEL_PRACTICAL"
              ? examDetails.departmentId
              : null,
          timingAn: timingDetails.type !== "fn" ? timingDetails.an : null,
          timingFn: timingDetails.type !== "an" ? timingDetails.fn : null,
          type: examDetails.type,
        },
      })
      db.student.updateMany({
        where: {
          departmentId: {
            in: Array.from(hallDetails.departments),
          },
        },
        data: {
          examIds: {
            push: exam.id,
          },
        },
      })
      const halls = await db.hall.findMany({
        where: {
          id: {
            in: Array.from(hallDetails.selectedHalls),
          },
        },
        include: {
          department: true,
          seats: true,
        },
      })
      const newHallsThatAreCopyOfItsParent = await Promise.all(
        halls.map(({ type, id, department, ...hall }) => {
          return db.hall.create({
            data: {
              ...hall,
              rootHallId: id,
              departmentId: hall.departmentId,
              examId: exam.id,
              type: hallType as HallArrangementType,
              seats: {
                createMany: {
                  data: hall.seats.map(({ id, ...seat }) => ({ ...seat })),
                },
              },
            },
          })
        })
      )
      return exam
    }),
})
