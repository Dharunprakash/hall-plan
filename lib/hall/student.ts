// export const groupHallByStudentYear = (
//   halls: HallWithSeatsWithStudentsAndDept[]
// ): [string, HallWithSeatsWithStudentsAndDept[]][] => {
//   const grouped: Record<string, Set<HallWithSeatsWithStudentsAndDept>> = {}

import { StudentWithDept } from "@/types/student"

//   halls.forEach((hall) => {
//     hall.seats.forEach((seat) => {
//       if (!seat.student) return
//       const { year, semester } = seat
//       if (!year || !semester) return

//       const key = JSON.stringify({
//         year,
//         semester,
//         dept: hall.department.code,
//       })

//       grouped[key] = grouped[key] || new Set()
//       grouped[key].add(hall)
//     })
//   })

//   return Object.entries(grouped).map(([key, halls]) => [key, Array.from(halls)])
// }

export const groupStudentsByDeptYear = (
  students: StudentWithDept[]
): [{ dept: string; year: number }, StudentWithDept[]][] => {
  const grouped: Record<string, StudentWithDept[]> = {}

  students.forEach((student) => {
    const {
      year,
      department: { code: dept },
    } = student
    if (!year || !dept) return

    const key = JSON.stringify({
      year,
      dept,
    })

    grouped[key] = grouped[key] || new Array()
    grouped[key].push(student)
  })

  const res: [{ dept: string; year: number }, StudentWithDept[]][] =
    Object.entries(grouped).map(([key, students]) => [
      JSON.parse(key) as { dept: string; year: number },
      Array.from(students) as StudentWithDept[],
    ])
  console.log(res)
  return res.sort((a, b) => {
    if (a[0].dept < b[0].dept) return -1
    if (a[0].dept > b[0].dept) return 1
    if (a[0].year < b[0].year) return -1
    if (a[0].year > b[0].year) return 1
    return 1
  })
}
