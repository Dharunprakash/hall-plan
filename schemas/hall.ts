import { checkSameHallNoExists } from "@/server/actions"
import { z } from "zod"

export const HallSchema = z
  .object({
    hallno: z.number().min(1, {
      message: "department name is required",
    }),
    rows: z.number().min(1, {
      message: "row is required",
    }),
    cols: z.number().min(1, {
      message: "col is required",
    }),
    capacity: z.number().min(1, {
      message: "capacity is required",
    }),
    departmentId: z.string().min(1, {
      message: "department is required",
    }),
  })
  .refine(
    (data) => {
      return data.rows * data.cols <= data.capacity
    },
    {
      path: ["capacity"],
      message: "rows * cols should be less than or equal to capacity",
    }
  )
  .refine(
    async (data) => {
      return await checkSameHallNoExists(data.hallno, data.departmentId)
    },
    {
      path: ["hallno"],
      message: "Hall already exists in the department",
    }
  )
