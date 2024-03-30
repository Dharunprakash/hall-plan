"use server"

import { GenerateHallSchema } from "@/schemas/generate-hall/input-schema"
import { HallArrangementType } from "@prisma/client"
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
  const {
    examDetails,
    timingDetails,
    hallType,
    durationDetails,
    ...hallDetails
  } = input

  const selectedYears = Array.from(timingDetails.selectedYears).map(Number)

  const studentIds = (
    await db.student.findMany({
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
  )?.map((st) => st.id)

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
        studentIds: studentIds,
        // dates: {
        //   create: durationDetails.map(detail => ({
        //     date: new Date(detail.date),
        //     fn: detail.timings.fn ? {
        //       create: {
        //         time:timingDetails.type !== "an" && timingDetails.fn,
        //       }
        //     } : null,
        //     an: detail.timings.an ? {
        //       create: {
        //         time: timingDetails.type !== "fn" && timingDetails.an,
        //       }
        //     } : null
        //   }))
        // }
      },
    })
    for (const detail of durationDetails) {
      const date = await db.date.create({
        data: {
          date: new Date(detail.date),
          examId: exam.id,
        },
      })

      if (detail.timings.fn) {
        await db.timing.create({
          data: {
            time: timingDetails.type !== "an" ? timingDetails.fn : "",
            dateId: date.id,
            name: "FN",
          },
        })
      }

      if (detail.timings.an) {
        await db.timing.create({
          data: {
            time: timingDetails.type !== "fn" ? timingDetails.an : "",
            dateId: date.id,
            name:"AN"
          },
        })
      }
    }

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
                data: hall.seats.map(({ id, hallId, ...seat }) => ({
                  ...seat,
                })),
              },
            },
          },
        })
      })
    )

    const res = await db.exam.findUnique({
      where: {
        id: exam.id,
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
        dates: true,
        department: true,
        students: true,
      },
    })
    console.log(res)
  } catch (error: any) {
    console.error("Error creating exam:", error.message)
  }
}
