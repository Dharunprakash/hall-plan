export class GeneratePlan {
  private dp: Map<string, boolean>
  private students: number[]
  private seats: number[]

  constructor(students: number[], seats: number[]) {
    this.students = students
    this.seats = seats
    this.dp = new Map()
  }

  isPossibleToMakeThemSit(): boolean {
    return this.f(0, this.seats)
  }

  private f(i: number, remainingSeats: number[]): boolean {
    if (remainingSeats.some(seat => seat < 0)) {
      return false
    }
    if (i === this.students.length) {
      return true
    }
    const key = `${i},${remainingSeats.join(',')}`
    if (this.dp.has(key)) {
      return this.dp.get(key)!
    }
    for (let j = 0; j < remainingSeats.length; j++) {
      const newRemainingSeats = [...remainingSeats]
      newRemainingSeats[j] -= this.students[i]
      if (this.f(i + 1, newRemainingSeats)) {
        this.dp.set(key, true)
        return true
      }
    }
    this.dp.set(key, false)
    return false
  }

  generateCombinations(): number[] | undefined {
    this.f(0, this.seats)
    const ans: number[] = []
    const generate = (i: number, remainingSeats: number[]): void => {
      if (i === this.students.length) {
        return
      }
      for (let j = 0; j < remainingSeats.length; j++) {
        const newRemainingSeats = [...remainingSeats]
        newRemainingSeats[j] -= this.students[i]
        if (newRemainingSeats[j] >= 0 && this.f(i + 1, newRemainingSeats)) {
          ans.push(j + 1)
          generate(i + 1, newRemainingSeats)
          return
        }
      }
    }
    if (this.f(0, this.seats)) {
      generate(0, this.seats)
      return ans
    } else {
      return undefined
    }
  }
}