"use server"

import { db } from "@/lib/db"

export const checkSameHallNoExists = async (
  hallno: number,
  departmentId: string
) => {
  return !!!(await db.hall.findFirst({
    where: {
      hallno,
      departmentId,
    },
  }))
}
