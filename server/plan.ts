import { $Enums } from "@prisma/client"
import { z } from "zod"

import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { StudentWithDept } from "@/types/student"
import { db } from "@/lib/db"
import { GeneratePlan } from "@/lib/generate"
import { separateSeatsInto2groupsForHalls } from "@/lib/hall/seats"
import {
  CriteriaFactory,
  CriteriaTypes,
  GroupingCriteriaConditionalProcessor,
  GroupingCriteriaNode,
  GroupingCriteriaType,
  OrderCriteriaNode,
  OrderCriteriaType,
} from "@/lib/utils/criteria"

import {
  CriteriaBuilder,
  OrderCriteriaProcessor,
} from "./../lib/utils/criteria"
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
      const orderBuilder = CriteriaBuilder.createBuilder(
        CriteriaFactory.createCriteria(CriteriaTypes.ORDER)
      )
      const orderNode = new OrderCriteriaNode(OrderCriteriaType.DEPARTMENT, 1)
      const order = orderBuilder
        .initialCriteria(orderNode)
        .and(new OrderCriteriaNode(OrderCriteriaType.YEAR, 1))
        .and(new OrderCriteriaNode(OrderCriteriaType.SECTION, 1))
        .and(new OrderCriteriaNode(OrderCriteriaType.ROLLNO, 1))
        .build()
      const orderedStudents = new OrderCriteriaProcessor(order).order(students)
      const groupBuilder = CriteriaBuilder.createBuilder(
        CriteriaFactory.createCriteria(CriteriaTypes.GROUPING)
      )
      const group = groupBuilder
        .initialCriteria(
          new GroupingCriteriaNode(GroupingCriteriaType.DEPARTMENT, 1)
        )
        .and(new GroupingCriteriaNode(GroupingCriteriaType.YEAR, 1))
        .build()
      const groupedStudents = new GroupingCriteriaConditionalProcessor(
        group
      ).group(orderedStudents)
      const studentsCountArr = groupedStudents.map((obj) => obj.students.length)
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
        studentsCountArr,
        segregatedSeats.group1Cnt,
        segregatedSeats.group2Cnt
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
        groupStudentBySeatCombination[1].map((obj) => ({
          year: obj.key.year,
          dept: obj.key.department?.code,
          std: obj.students.map((d) => ({ sec: d.section, rno: d.rollno })),
        }))
      )
      console.log(groupHallBySeatCombination)
      const promises1 = fillHalls({
        groupedStudents: groupStudentBySeatCombination[1].map((obj) => [
          { dept: obj.key.department?.code ?? "", year: obj.key.year ?? 0 },
          obj.students,
        ]),
        groupedHalls: groupHallBySeatCombination[1],
        hallType: HALL_TYPE,
      })
      console.log("Success")
      if (HALL_TYPE !== "NORMAL") {
        const promises2 = fillHalls({
          groupedStudents: groupStudentBySeatCombination[2].map((obj) => [
            { dept: obj.key.department?.code ?? "", year: obj.key.year ?? 0 },
            obj.students,
          ]),
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
    let tempArr = []
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
          tempArr.push({
            studentId: groupedStudents[i][1][stdPtr].id,
            year: groupedStudents[i][1][stdPtr].year,
            semester: groupedStudents[i][1][stdPtr].semester,
          })
          promises.push(
            db.seat.update({
              where: {
                id: groupedHalls[hallPtr].seats[seatPtr].id,
              },
              data: {
                studentId: groupedStudents[i][1][stdPtr].id,
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
    console.log(tempArr)
    console.log("Success")
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message)
  }
  return promises
}
