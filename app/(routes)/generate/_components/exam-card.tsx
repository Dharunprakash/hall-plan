import React from "react"
import Link from "next/link"
import { Department, Exam } from "@prisma/client"
import { format } from "date-fns"

import { capitalize } from "@/lib/utils"

const ExamCard = ({
  exam,
}: {
  exam: Exam & { department: Department | null }
}) => {
  return (
    <Link
      href={`/generate/${exam.id}/details`}
      className="flex w-full flex-col items-start gap-2 rounded-lg border-2 border-gray-300 bg-white p-3 px-6 shadow-lg transition-all hover:bg-slate-100"
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">{exam.name}</h1>
          <div className="flex h-full items-center rounded-md bg-yellow-800 px-1 text-base text-gray-100">
            <h2>{capitalize(exam.type).replaceAll("_", " ")}</h2>
          </div>
          {!!exam.department && (
            <div className="flex h-full items-center rounded-md bg-blue-400 px-1 text-base text-gray-100">
              <h2>{exam.department.code}</h2>
            </div>
          )}
        </div>
        <p className="text-base text-gray-500 ">
          {format(exam.updatedAt, "dd MMM yyy")}
        </p>
      </div>
      <div className="grid grid-cols-5 items-center gap-x-4">
        <p className="text-center text-base font-semibold">Academic Year</p>
        <p className="text-center text-base font-semibold">Semester</p>
        <p className="text-center text-base font-semibold">students</p>
        <p className="text-center text-base font-semibold">Timing (AN) </p>
        <p className="text-center text-base font-semibold">Timing (FN) </p>
        <p className="text-center text-base text-gray-500">
          {exam.academicYear}
        </p>
        <p className="text-center text-base text-gray-500"> {exam.semester}</p>
        <p className="text-center text-base text-gray-500">
          {exam.studentIds.length}
        </p>
        <p className="text-center text-base text-gray-500">
          {exam.timingAn || "-"}
        </p>
        <p className="text-center text-base text-gray-500">{exam.timingFn}</p>
      </div>
    </Link>
  )
}

export default ExamCard
