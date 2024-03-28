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
    // Add student information from student hook
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
      // timingAn: timingDetails.type !== "fn" ? timingDetails.an : null,
      // timingFn: timingDetails.type !== "an" ? timingDetails.fn : null,
      type: examDetails.type,
    },
  })
  try {
    // Gett student information from student hook
    // db.student.updateMany({
    //   where: {
    //     AND: [
    //       {
    //         departmentId: {
    //           in: Array.from(StudentDetails.departments),
    //         },
    //       },
    //       {
    //         year: {
    //           in: Array.from(StudentDetails.years),
    //         },
    //       },
    //     ],
    //   },
    //   data: {
    //     examIds: {
    //       // NOT working
    //       push: exam.id,
    //     },
    //   },
    // })
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
            // not working
            examId: exam.id,
            // Exam: {
            //   connect: {
            //     id: exam.id,
            //   },
            // },
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
  } catch (error: any) {
    console.log(error.message)
  }
  db.exam
    .findUnique({
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
    .then((res) => {
      console.log(res)
    })
}
