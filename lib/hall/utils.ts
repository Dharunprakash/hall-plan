import { HallWithDeptAndBasicSeats, HallWithSeatsAndDept } from "@/types/hall"
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
