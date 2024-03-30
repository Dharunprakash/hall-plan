import { z } from "zod"

const timeFormatRegex =
  /^(0[0-9]|1[0-9]|2[0-3])\.[0-5][0-9]-([0-9]|1[0-9]|2[0-3])\.[0-5][0-9]$/

const validationSchema = z.object({
  time: z
    .string()
    .min(1, { message: "Time is required" })
    .refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
})

export const TimingDetailsSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  departments: z
    .set(z.string())
    .min(1, { message: "Select at least one department" }),
  selectedYears: z
    .set(z.string())
    .min(1, { message: "Select at least one year" }),
})

export const AnTimingSchema = z
  .object({
    type: z.literal("an"),
    an: z.string().refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
  })
  .merge(TimingDetailsSchema)

export const FnTimingSchema = z
  .object({
    type: z.literal("fn"),
    fn: z.string().refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
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
