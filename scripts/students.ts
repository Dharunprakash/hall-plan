import { db } from "@/lib/db"

export const clearAllExamIds = async () => {
  await db.student.updateMany({
    data: {
      examIds: {
        set: [],
      },
    },
  })
}

export const clearAllSeats = async () => {
  await db.seat.updateMany({
    data: {
      studentId: null,
      semester: null,
      year: null,
    },
  })
  console.log("cleared AllSeats")
}
