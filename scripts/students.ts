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
