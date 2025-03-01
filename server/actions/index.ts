"use server"

import { redirect } from "next/navigation"
import { GenerateHallSchema } from "@/schemas/generate-hall/input-schema"
import { HallArrangementType, Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { z } from "zod"

import { db } from "@/lib/db"

export const checkSameHallNoExists = async (
  hallno: number,
  departmentId: string
) => {
  if (departmentId === "-" || !departmentId || departmentId === "") return true
  return !!!(await db.hall.findFirst({
    where: {
      hallno,
      departmentId,
    },
  }))
}
export const createExam = async (input: z.infer<typeof GenerateHallSchema>) => {
  const validatedFields = GenerateHallSchema.safeParse(input)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const {
    examDetails,
    timingDetails,
    hallType,
    durationDetails,
    ...hallDetails
  } = input
  console.log(timingDetails.departments)
  console.log(hallDetails.departments)
  const selectedYears = Array.from(timingDetails.selectedYears).map(Number)

  try {
    const studentsPromise = db.student.findMany({
      where: {
        AND: [
          {
            departmentId: {
              in: Array.from(timingDetails.departments),
            },
          },
          {
            year: {
              in: selectedYears,
            },
          },
        ],
      },
      select: {
        id: true,
      },
    })

    console.log(hallDetails.selectedHalls)
    const hallsPromise = db.hall.findMany({
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
    const [studentIds, halls] = await Promise.all([studentsPromise, hallsPromise])

    let examId = ""
    await db.$transaction(async (tx) => {
      const exam = await tx.exam.create({
        data: {
          academicYear: examDetails.academicYear,
          name: examDetails.name,
          arrangementType: hallType,
          semester: examDetails.semester,
          departmentId:
            examDetails.type === "INTERNAL" ||
            examDetails.type === "MODEL_PRACTICAL"
              ? examDetails.departmentId
              : null,
          timingAn: timingDetails.type !== "fn" ? timingDetails.an : null,
          timingFn: timingDetails.type !== "an" ? timingDetails.fn : null,
          type: examDetails.type,
          students: {
            connect: studentIds,
          },
        },
      })

      // Handle halls creation here...
      console.log(halls)
      if (halls.length === 0) {
        throw new Error("No halls selected")
      }
      const newHallsThatAreCopyOfItsParentPromise = Promise.all(
        halls.map(({ type, id, department, ...hall }) => {
          return tx.hall.create({
            data: {
              ...hall,
              rootHallId: id,
              departmentId: hall.departmentId,
              examId: exam.id,
              type: hallType as HallArrangementType,
              seats: {
                createMany: {
                  data: hall.seats.map(
                    ({ id, hallId, studentId, year, semester, ...seat }) => ({
                      ...seat,
                    })
                  ),
                },
              },
            },
          })
        })
      )

      const examDatesPromise = Promise.all(
        durationDetails.map((detail) => {
          const data: Prisma.DateCreateArgs<DefaultArgs> = {
            data: {
              date: new Date(detail.date),
              examId: exam.id,
              fn:
                detail.timings.fn && timingDetails.type !== "an"
                  ? {
                      create: {
                        time: timingDetails.fn,
                        fnDateId: detail.fnDateId ?? undefined, // Ensure fnDateId is not null
                      },
                    }
                  : undefined,
              an:
                detail.timings.an && timingDetails.type !== "fn"
                  ? {
                      create: {
                        time: timingDetails.an,
                        anDateId: detail.anDateId ?? undefined, // Ensure anDateId is not null
                      },
                    }
                  : undefined,
            },
          }
          return tx.date.create(data)
        })
      )
      await Promise.all([newHallsThatAreCopyOfItsParentPromise, examDatesPromise])
      console.log("Creating exam...")
      examId = exam.id
    })
    console.log("Exam created", examId)
    redirect(`/generate/${examId}/details`)
  } catch (error: any) {
    console.error("Error creating exam:", error.message)
  }
}

export const updateExam = async (
  id: string,
  input: z.infer<typeof GenerateHallSchema>
) => {
  const {
    examDetails,
    timingDetails,
    hallType,
    durationDetails,
    ...hallDetails
  } = input
  const selectedYears = Array.from(timingDetails.selectedYears).map(Number)

  // Do it as efficiently as possible for
}
