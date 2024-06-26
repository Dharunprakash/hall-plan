import { z } from "zod"

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

export const InternalExamDetailsSchema = z
  .object({
    type: z.enum(["INTERNAL", "MODEL_PRACTICAL"]),
    departmentId: z.string().min(1, { message: "Department is required" }),
  })
  .merge(ExamDetailsSchema)

export const PracticalExamDetailsSchema = z
  .object({
    type: z.enum(["PRACTICAL", "THEORY"]),
  })
  .merge(ExamDetailsSchema)

export const ExamDetailsType = z.discriminatedUnion("type", [
  InternalExamDetailsSchema,
  PracticalExamDetailsSchema,
])
