import { $Enums } from "@prisma/client"
import { z } from "zod"

import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { StudentWithDept } from "@/types/student"
import { db } from "@/lib/db"
import { GeneratePlan } from "@/lib/generate"
import { separateSeatsInto2groupsForHalls } from "@/lib/hall/seats"
import { groupStudentsByDeptYear } from "@/lib/hall/student"

import { publicProcedure, router } from "./trpc"

export const planRouter = router({
  generate: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      const exam = await db.exam.findUnique({
        where: {
          id,
        },
        include: {
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
            include: {
              department: true,
            },
          },
          dates: true,
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
      if (!exam) {
        throw new Error("Exam not found")
      }
      const students = exam.students
      const dates = exam.dates
      const halls = exam.halls
      const seats = halls.flatMap((h) => h.seats)
      const studentsCount = students.length
      const seatsCount = halls.reduce(
        (acc, hall) =>
          acc +
          hall.seats.reduce((ac, seat) => ac + (seat.isBlocked ? 0 : 1), 0),
        0
      )
      if (studentsCount > seatsCount) {
        console.log("Not enough seats")
        throw new Error("Not enough seats")
      }
      const groupedStudents = groupStudentsByDeptYear(students)
      console.log(
        groupedStudents.map(([key, s]) => ({
          year: key.year,
          dept: key.dept,
          std: s.map((d) => ({ sec: d.section, rno: d.rollno })),
        }))
      )
      const studentsCountArr = groupedStudents.map(
        ([key, student]) => student.length
      )
      console.log(studentsCountArr)
      console.log(studentsCount)
      console.log(seatsCount)
      const HALL_TYPE = exam.halls[0].type || "NORMAL"
      const segregatedSeats = separateSeatsInto2groupsForHalls(
        halls,
        HALL_TYPE,
        "Minimal"
      )
      console.log(HALL_TYPE)
      console.log(segregatedSeats)
      const plan = new GeneratePlan(
        studentsCountArr,[
        segregatedSeats.group1Cnt,
        segregatedSeats.group2Cnt]
      )
      const combinations = plan.generateCombinations()
      if (!combinations) {
        console.log("Not enough seats")
        throw new Error("Not enough seats")
      }
      const groupStudentBySeatCombination = {
        1: groupedStudents.filter((_, ind) => combinations[ind] === 1),
        2: groupedStudents.filter((_, ind) => combinations[ind] === 2),
      }
      const groupHallBySeatCombination = {
        1: halls.filter(
          (_, ind) => segregatedSeats.seatsTypeForHalls[ind] === 1
        ),
        2: halls.filter(
          (_, ind) => segregatedSeats.seatsTypeForHalls[ind] === 2
        ),
      }
      console.log(
        groupStudentBySeatCombination[1].map(([key, s]) => ({
          year: key.year,
          dept: key.dept,
          std: s.map((d) => ({ sec: d.section, rno: d.rollno })),
        }))
      )
      console.log(groupHallBySeatCombination)
      const promises1 = fillHalls({
        groupedStudents: groupStudentBySeatCombination[1],
        groupedHalls: groupHallBySeatCombination[1],
        hallType: HALL_TYPE,
      })
      console.log("Success")
      if (HALL_TYPE !== "NORMAL") {
        const promises2 = fillHalls({
          groupedStudents: groupStudentBySeatCombination[2],
          groupedHalls: groupHallBySeatCombination[2],
          hallType: HALL_TYPE,
        })
        await Promise.all([...promises1, ...promises2])
      } else {
        await Promise.all(promises1)
      }
    }),
})

export const fillHalls = ({
  groupedStudents, //groupStudentBySeatCombination[1]
  groupedHalls, // groupHallBySeatCombination[1]
  hallType,
}: {
  groupedStudents: [{ dept: string; year: number }, StudentWithDept[]][]
  groupedHalls: HallWithSeatsWithStudentsAndDept[]
  hallType: $Enums.HallArrangementType
}) => {
  const promises = []
  let hallPtr = 0

  try {
    for (let i = 0; i < groupedStudents.length; i++) {
      // return plan.generateAlternatePlan(combinations, groupedStudents, groupedHalls)
      let stdSize = groupedStudents[i][1].length
      let stdPtr = 0
      let hallSize = groupedHalls[hallPtr].seats.length
      let seatPtr = 0
      while (stdPtr < stdSize) {
        if (
          seatPtr < hallSize &&
          groupedHalls[hallPtr].seats[seatPtr].isBlocked
        ) {
          seatPtr++
          continue
        }
        if (hallType === "STAGGERED") {
          if (seatPtr % 2 === 1) seatPtr++
        }
        if (hallType === "ALTERNATE") {
          if (
            seatPtr < hallSize &&
            groupedHalls[hallPtr].seats[seatPtr].col % 2 === 1
          )
            seatPtr++
        }
        if (seatPtr < hallSize) {
          promises.push(
            db.seat.update({
              where: {
                id: groupedHalls[hallPtr].seats[seatPtr].id,
              },
              data: {
                student: {
                  connect: {
                    id: groupedStudents[i][1][stdPtr].id,
                  },
                },
                year: groupedStudents[i][1][stdPtr].year,
                semester: groupedStudents[i][1][stdPtr].semester,
              },
            })
          )
          stdPtr++
          seatPtr++
        } else {
          hallPtr++
          seatPtr = 0
          hallSize = groupedHalls[hallPtr].seats.length
        }
      }
    }
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message)
  }
  return promises
}
