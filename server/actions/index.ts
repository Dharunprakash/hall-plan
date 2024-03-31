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

  const studentIds = await db.student.findMany({
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

  try {
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
        students: {
          connect: studentIds,
        },
      },
    })

    // Handle halls creation here...

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

    const newHallsThatAreCopyOfItsParentPromise = Promise.all(
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
                data: hall.seats.map(({ id, hallId, studentId, ...seat }) => ({
                  ...seat,
                })),
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
                ? { create: { time: timingDetails.fn } }
                : undefined,
            an:
              detail.timings.an && timingDetails.type !== "fn"
                ? { create: { time: timingDetails.an } }
                : undefined,
          },
        }
        return db.date.create(data)
      })
    )
    redirect(`/generate/${exam.id}/details`)
    // const res = await db.exam.findUnique({
    //   where: {
    //     id: exam.id,
    //   },
    //   include: {
    //     halls: {
    //       include: {
    //         department: true,
    //         seats: {
    //           include: {
    //             student: true,
    //           },
    //         },
    //       },
    //     },
    //     dates: true,
    //     department: true,
    //     students: true,
    //   },
    // })
    // console.log(res)
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
