import { time } from "console"
import { z } from "zod"

import { ExamDetailsType } from "./exam-details"
import { TimingDetailsType, timeFormatRegex } from "./timing-details"

export const EditTimingDetail = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  halltype:z.enum(["NORMAL","ALTERNATE","STAGGERED"])
})

export const AnTimingSchema = z
  .object({
    type: z.literal("an"),
    an: z.string().refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
  })
  .merge(EditTimingDetail)

export const FnTimingSchema = z
  .object({
    type: z.literal("fn"),
    fn: z.string().refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
  })
  .merge(EditTimingDetail)

export const BothTimingSchema = z
  .object({
    type: z.literal("both"),
    fn: z.string().refine((value) => timeFormatRegex.test(value)),
    an: z.string().refine((value) => timeFormatRegex.test(value)),
  })
  .merge(EditTimingDetail)

export const EditTimingDetailsType = z.discriminatedUnion("type", [
  AnTimingSchema,
  FnTimingSchema,
  BothTimingSchema,
])

export const editSchema = z.union([EditTimingDetailsType,ExamDetailsType])
