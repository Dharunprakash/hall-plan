import { HallArrangementType } from "@prisma/client"

import {
  HallPlan,
  HallPlanExtra,
  HallWithDeptAndBasicSeats,
  HallWithSeatsAndDept,
  HallWithSeatsWithStudentsAndDept,
} from "@/types/hall"
import { BasicSeat, SeatPosition, SeatStatus } from "@/types/seat"

export const mapArrayOfPairToMatrix = <T extends SeatPosition>(
  arr: T[],
  rows: number,
  cols: number
): T[][] => {
  const matrix: T[][] = Array.from({ length: rows }, () => Array(cols))
  for (const seat of arr) {
    matrix[seat.row][seat.col] = seat
  }
  return matrix
}

export const mapMatrixToArrayOfPair = <T extends SeatPosition>(
  matrix: T[][]
): T[] => {
  const arr: T[] = []
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        arr.push(matrix[row][col])
      }
    }
  }
  return arr
}
export const getHallCapacity = <T extends { seats: SeatStatus[] }>(
  hall: T
): number => {
  return hall.seats.reduce((acc, seat) => {
    return acc + (seat.isBlocked ? 0 : 1)
  }, 0)
}

export const getCapacity = <T extends BasicSeat[]>(seatMatrix: T[]): number => {
  const seats = mapMatrixToArrayOfPair(seatMatrix)
  return seats.reduce((acc, seat) => {
    return acc + (seat.isBlocked ? 0 : 1)
  }, 0)
}

export const generateSeatMatrix = (
  rows: number,
  cols: number,
  pattern?: HallArrangementType
): BasicSeat[][] => {
  if (!rows || !cols) return []
  const emptyMatrix: BasicSeat[][] = Array.from({ length: rows }, () =>
    Array(cols).fill({})
  )
  // fill the matrix with empty seats with
  // row and col properties
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      emptyMatrix[row][col] = {
        row,
        col,
        isBlocked:
          pattern === "STAGGERED"
            ? (row + col) % 2 === 0
            : pattern === "ALTERNATE"
            ? col % 2 === 0
            : false,
      }
    }
  }
  return emptyMatrix
}

export const updateSeatMatrixDimensions = (
  seatMatrix: BasicSeat[][],
  rows: number,
  cols: number
): BasicSeat[][] => {
  const newMatrix = generateSeatMatrix(rows, cols)
  for (let row = 0; row < Math.min(seatMatrix.length, rows); row++) {
    for (let col = 0; col < Math.min(seatMatrix[row].length, cols); col++) {
      newMatrix[row][col] = seatMatrix[row][col]
    }
  }
  return newMatrix
}

export const generateSeatArray = (rows: number, cols: number): BasicSeat[] => {
  return mapMatrixToArrayOfPair(generateSeatMatrix(rows, cols))
}

export const transformHall = (
  hall: HallWithSeatsAndDept
): HallWithDeptAndBasicSeats => ({
  ...hall,
  seats: mapArrayOfPairToMatrix<BasicSeat>(
    hall.seats.map((seat) => ({
      row: seat.row,
      col: seat.col,
      isBlocked: seat.isBlocked,
    })),
    hall.rows,
    hall.cols
  ),
})

export const groupHallByStudentYear = (
  halls: HallWithSeatsWithStudentsAndDept[]
): [string, HallWithSeatsWithStudentsAndDept[]][] => {
  const grouped: Record<string, Set<HallWithSeatsWithStudentsAndDept>> = {}

  halls.forEach((hall) => {
    hall.seats.forEach((seat) => {
      if (!seat.student) return
      const { year, semester } = seat
      if (!year || !semester) return

      const key = JSON.stringify({
        year,
        semester,
        dept: hall.department.code,
      })

      grouped[key] = grouped[key] || new Set()
      grouped[key].add(hall)
    })
  })

  return Object.entries(grouped).map(([key, halls]) => [key, Array.from(halls)])
}

export const segregateHallsBySection = (
  halls: HallWithSeatsWithStudentsAndDept[],
  year: number
) => {
  const pairsHallsAndSections: Record<string, HallPlan[]> = {}
  const hallPlans: [string, HallPlan][] = []

  halls.forEach((hall) => {
    const sections: Record<string, HallPlanExtra> = {}

    hall.seats.forEach((seat) => {
      if (!seat.student) return
      const {
        year: studentYear,
        semester: studentSemester,
        section,
        rollno,
      } = seat.student
      if (!section || !studentSemester || !studentYear) return

      sections[section] = sections[section] || {
        year: studentYear,
        semester: studentSemester,
        section,
        startRollNo: rollno,
        endRollNo: rollno,
      }

      sections[section].startRollNo = Math.min(
        rollno,
        sections[section].startRollNo
      )
      sections[section].endRollNo = Math.max(
        rollno,
        sections[section].endRollNo
      )
    })

    Object.entries(sections).forEach(([section, sectionData]) => {
      if (sectionData.year === year) {
        pairsHallsAndSections[section] = pairsHallsAndSections[section] || []
        pairsHallsAndSections[section].push({ ...hall, ...sectionData })
      }
    })
  })

  Object.entries(pairsHallsAndSections).forEach(([section, halls]) => {
    halls.forEach((hall) => {
      hallPlans.push([section, hall])
    })
  })

  return { pairsHallsAndSections, hallPlans }
}
