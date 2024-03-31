export class GeneratePlan {
  private dp: number[][][]
  private students: number[]
  private type1Seats: number
  private type2Seats: number

  constructor(students: number[], type1Seats: number, type2Seats: number) {
    this.students = students
    this.type1Seats = type1Seats
    this.type2Seats = type2Seats
    this.dp = Array.from({ length: students.length + 1 }, () =>
      Array.from({ length: type1Seats + 1 }, () =>
        Array.from({ length: type2Seats + 1 }, () => -1)
      )
    )
  }

  isPossibleToMakeThemSit(): boolean {
    return this.f(0, this.type1Seats, this.type2Seats)
  }

  private f(i: number, tar1: number, tar2: number): boolean {
    if (tar1 < 0 || tar2 < 0) {
      return false
    }
    if (i === this.students.length) {
      return true
    }
    if (this.dp[i][tar1][tar2] !== -1) {
      return this.dp[i][tar1][tar2] === 1
    }
    let type1 = this.f(i + 1, tar1 - this.students[i], tar2)
    let type2 = this.f(i + 1, tar1, tar2 - this.students[i])
    this.dp[i][tar1][tar2] = type1 || type2 ? 1 : 0
    return this.dp[i][tar1][tar2] === 1
  }
  generateCombinations(): number[] | undefined {
    this.f(0, this.type1Seats, this.type2Seats)
    let fi = [0],
      se = [0],
      ans: number[] = []
    const generate = (i: number, tar1: number, tar2: number): void => {
      if (i === this.students.length) {
        return
      }
      if (
        tar1 - this.students[i] >= 0 &&
        this.dp[i + 1][tar1 - this.students[i]][tar2] &&
        tar2 - this.students[i] >= 0 &&
        this.dp[i + 1][tar1][tar2 - this.students[i]]
      ) {
        if (fi[0] < se[0]) {
          fi[0]++
          ans.push(1)
          generate(i + 1, tar1 - this.students[i], tar2)
        } else {
          se[0]++
          ans.push(2)
          generate(i + 1, tar1, tar2 - this.students[i])
        }
        return
      }
      if (
        tar1 - this.students[i] >= 0 &&
        this.dp[i + 1][tar1 - this.students[i]][tar2]
      ) {
        fi[0]++
        ans.push(1)
        generate(i + 1, tar1 - this.students[i], tar2)
        return
      }
      if (
        tar2 - this.students[i] >= 0 &&
        this.dp[i + 1][tar1][tar2 - this.students[i]]
      ) {
        se[0]++
        ans.push(2)
        generate(i + 1, tar1, tar2 - this.students[i])
        return
      }
    }
    if (this.dp[0][this.type1Seats][this.type2Seats]) {
      generate(0, this.type1Seats, this.type2Seats)
      return ans
    } else {
      return undefined
    }
  }
}
