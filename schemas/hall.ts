import { z } from "zod"

export const HallSchema = z.object({
  hallno: z.string().min(1, {
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
