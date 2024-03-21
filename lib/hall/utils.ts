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
  cols: number
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
        isBlocked: false,
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
) => {
  const grouped: Record<string, Set<HallWithSeatsWithStudentsAndDept>> = {}
  halls.forEach((hall) => {
    hall.seats.forEach((seat) => {
      if (!seat.student) return
      const dept = hall.department.code
      const { year, semester } = seat
      if (!year || !semester) return
      const key = JSON.stringify({
        year,
        semester,
        dept,
      })
      if (!grouped[key]) {
        grouped[key] = new Set()
      }
      grouped[key].add(hall)
    })
  })
  return grouped
}

export const segregateHallsBySection = (
  halls: HallWithSeatsWithStudentsAndDept[],
  year: number
) => {
  const pairsHallsAndSections: Record<string, HallPlan[]> = {}
  const hallPlans: [string, HallPlan][] = []
  for (const hall of halls) {
    const sections: Record<string, HallPlanExtra> = {}
    for (const seat of hall.seats) {
      if (!seat.student) continue
      const { year: studentYear, semester: studentSemester } = seat
      const { rollno, section } = seat.student
      if (!section || !studentSemester || !studentYear) continue
      if (!sections[section]) {
        sections[section] = {
          year: studentYear,
          semester: studentSemester,
          section,
          startRollNo: rollno,
          endRollNo: rollno,
        }
      } else {
        const existingSections = sections[section]!
        sections[section] = {
          section,
          year: studentYear,
          semester: studentSemester,
          startRollNo: Math.min(rollno, existingSections.startRollNo),
          endRollNo: Math.max(rollno, existingSections.endRollNo),
        }
      }
    }
    for (const section in sections) {
      const sectionData = sections[section]
      if (sectionData.year === year) {
        if (!pairsHallsAndSections[section]) {
          pairsHallsAndSections[section] = []
        }
        pairsHallsAndSections[section].push({ ...hall, ...sectionData })
      }
    }
  }

  for (const section in pairsHallsAndSections) {
    for (const hall of pairsHallsAndSections[section]) {
      hallPlans.push([section, hall])
    }
  }
  return { pairsHallsAndSections, hallPlans }
}
