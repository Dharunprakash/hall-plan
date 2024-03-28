import { HallArrangementType } from "@prisma/client"
import { z } from "zod"

import { ExamDetailsType } from "./exam-details"
import { HallDetailsSchema } from "./hall-details"
import { TimingDetailsType } from "./timing-details"

export const GenerateHallSchema = z
  .object({
    hallType: z.string(),
    examDetails: ExamDetailsType,
    durationDetails: z.array(
      z.object({
        date: z.string(),
        timings: z.object({
          fn: z.boolean(),
          an: z.boolean(),
        }),
      })
    ),
    timingDetails: TimingDetailsType,
  })
  .merge(HallDetailsSchema)
