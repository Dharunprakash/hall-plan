import { z } from "zod"

export const HallDetailsSchema = z.object({
  departments: z
    .set(z.string())
    .min(1, { message: "Select at least one department" }),
  selectedHalls: z.set(z.string()).refine((years) => {
    console.log(years)
    return true
  }),
})
