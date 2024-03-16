export const mapArrayOfPairToMatrix = <T extends { row: number; col: number }>(
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

export const mapMatrixToArrayOfPair = <T extends { row: number; col: number }>(
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
export const getHallCapacity = <T extends { seats: { isBlocked: boolean }[] }>(
  hall: T
): number => {
  return hall.seats.reduce((acc, seat) => {
    return acc + (seat.isBlocked ? 0 : 1)
  }, 0)
}
