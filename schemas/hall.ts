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
    departmentId: z
      .string()
      .min(12, {
        message: "department is required",
      })
      .refine((d) => d !== "-", {
        message: "department is required",
      }),
  })
  .refine(
    async (data) => {
      return await checkSameHallNoExists(data.hallno, data.departmentId)
    },
    {
      path: ["hallno"],
      message: "Hall already exists in the department",
    }
  )
