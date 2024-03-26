import { z } from "zod"

export const TimingDetailsSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  departments: z
    .set(z.string())
    .min(1, { message: "Select at least one department" }),
  selectedYears: z.set(z.string()).refine((years) => {
    console.log(years)
    return true
  }),
})

export const AnTimingSchema = z
  .object({
    type: z.literal("an"),
    an: z.string().min(1, { message: "Time is required" }),
  })
  .merge(TimingDetailsSchema)

export const FnTimingSchema = z
  .object({
    type: z.literal("fn"),
    fn: z.string().min(1, { message: "Time is required" }),
  })
  .merge(TimingDetailsSchema)

export const BothTimingSchema = z
  .object({
    type: z.literal("both"),
    fn: z.string().min(1, { message: "Time is required" }),
    an: z.string().min(1, { message: "Time is required" }),
  })
  .merge(TimingDetailsSchema)

export const TimingDetailsType = z.discriminatedUnion("type", [
  AnTimingSchema,
  FnTimingSchema,
  BothTimingSchema,
])
