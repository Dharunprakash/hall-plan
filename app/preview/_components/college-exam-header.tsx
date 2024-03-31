import React from "react"
import { College } from "@prisma/client"

import { ExamDetails } from "@/types/exam"
import { cn } from "@/lib/utils"

export const CollegeExamHeader = ({
  collegeDetails,
  examDetails,
  name,
  className,
  children,
}: {
  collegeDetails: College
  examDetails: ExamDetails
  name: string
  className?: string
  children: React.ReactNode
}) => {
  const department =
    examDetails.type === "INTERNAL" || examDetails.type === "MODEL_PRACTICAL"
      ? examDetails.department
      : false
  console.log(department)
  return (
    <section>
      <div
        className={cn(
          "mb-2 flex h-full w-full flex-col items-center",
          className
        )}
      >
        <div className="text-md mt-4 flex flex-col items-center text-center">
          <h2 className="font-bold">
            {`${collegeDetails.name}, ${collegeDetails.district}`.toUpperCase()}
          </h2>
          {collegeDetails.description ? (
            <h3 className="italic">
              {"("}
              {collegeDetails.description}
              {")"}
            </h3>
          ) : null}
          {department && (
            <h3 className="font-semibold">
              {`Department of ${
                department.name || "Department Name"
              }`.toUpperCase()}
            </h3>
          )}
          <h3 className="font-semibold">{examDetails.name || "Exam Name"}</h3>
          <h3 className="font-semibold underline underline-offset-2">
            {`${name.toUpperCase()} - ${
              department ? department.code || "DEPT-CODE" : null
            } (${examDetails.academicYear || "Academic Year"}) ${
              examDetails.semester || "ODD/EVEN"
            }`}
          </h3>
        </div>
      </div>
      {children}
    </section>
  )
}
