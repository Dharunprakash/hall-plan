import Link from "next/link"

import { ExamDetailsWithDate } from "@/types/exam"
import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { groupHallByStudentYear } from "@/lib/hall/utils"
import HallPlanTable from "@/components/tables/hall-plan-table"

export const HallPlans = ({
  examDetails,
}: {
  examDetails: ExamDetailsWithDate
}) => {
  const grouped = groupHallByStudentYear(examDetails.halls)
  return (
    <>
      {grouped.map(([key, Groupedhalls], ind) => {
        const { year, semester, dept } = JSON.parse(key)
        return (
          <Link
            key={key}
            target="_blank"
            href={`/preview?planType=hall-plan&planNo=${ind + 1}&examId=${
              examDetails.id
            }`}
          >
            <HallPlanTable
              examDetails={examDetails}
              key={key}
              year={Number(year)}
              semester={Number(semester)}
              halls={Array.from(Groupedhalls)}
            />
          </Link>
        )
      })}
    </>
  )
}
