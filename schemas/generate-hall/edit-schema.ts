import { time } from "console"
import { $Enums } from "@prisma/client"
import { z } from "zod"

import { ExamDetailsType } from "./exam-details"
import { TimingDetailsType, timeFormatRegex } from "./timing-details"

export const EditTimingDetail = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  halltype: z.enum(["NORMAL", "ALTERNATE", "STAGGERED"]),
})

export const AnTimingSchema = z
  .object({
    timeType: z.literal("an"),
    an: z.string().refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
  })
  .merge(EditTimingDetail)

export const FnTimingSchema = z
  .object({
    timeType: z.literal("fn"),
    fn: z.string().refine((value) => timeFormatRegex.test(value), {
      message:
        "Invalid time format. Time format should be in the format 's hh.mm-hh.mm'",
    }),
  })
  .merge(EditTimingDetail)

export const BothTimingSchema = z
  .object({
    timeType: z.literal("both"),
    fn: z.string().refine((value) => timeFormatRegex.test(value)),
    an: z.string().refine((value) => timeFormatRegex.test(value)),
  })
  .merge(EditTimingDetail)

export const EditTimingDetailsType = z.discriminatedUnion("timeType", [
  AnTimingSchema,
  FnTimingSchema,
  BothTimingSchema,
])

const yearRegex = /^[0-9]{4}-[0-9]{4}$/
export const ExamDetailsSchema = z.object({
  // type:z.enum(["THEORY","MODEL_PRACTICAL","INTERNAL","PRACTICAL"]),
  name: z.string().min(1, { message: "Name is required" }),
  academicYear: z.string().refine((data) => yearRegex.test(data), {
    message: "Invalid Academic Year",
  }),
  semester: z.enum(["ODD", "EVEN"]),
})

// to zod

// if type==internal or model examschema will add the departmentid

type EditTimingDetailsType = {
  date: string
  halltype: "NORMAL" | "ALTERNATE" | "STAGGERED"
  name: string
  academicYear: string
  semester: "ODD" | "EVEN"
} & (
  | {
      timeType: "an"
      an: string
    }
  | {
      timeType: "fn"
      fn: string
    }
  | {
      timeType: "both"
      fn: string
      an: string
    }
) &
  (
    | {
        type: "INTERNAL" | "MODEL_PRACTICAL"
        departmentId: string
      }
    | {
        type: "PRACTICAL" | "THEORY"
      }
  )

export const editSchema = z
  .object({
    date: z.string(),
    halltype: z.nativeEnum($Enums.HallArrangementType),
    name: z.string(),
    academicYear: z.string(),
    semester: z.union([z.literal("ODD"), z.literal("EVEN")]),
  })
  .and(
    z.union([
      z.object({
        timeType: z.literal("an"),
        an: z.string(),
      }),
      z.object({
        timeType: z.literal("fn"),
        fn: z.string(),
      }),
      z.object({
        timeType: z.literal("both"),
        fn: z.string(),
        an: z.string(),
      }),
    ])
  )
  .and(
    z.union([
      z.object({
        type: z.union([z.literal("INTERNAL"), z.literal("MODEL_PRACTICAL")]),
        departmentId: z.string(),
      }),
      z.object({
        type: z.union([z.literal("PRACTICAL"), z.literal("THEORY")]),
      }),
    ])
  )
