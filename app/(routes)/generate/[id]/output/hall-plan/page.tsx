import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { db } from "@/lib/db"
import { groupHallByStudentYear } from "@/lib/hall/utils"
import { serverClient } from "@/app/_trpc/serverClient"

import HallPlanTable from "../_components/hall-plan-table"

const Page = async ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  const halls: HallWithSeatsWithStudentsAndDept[] = (await db.hall.findMany({
    where: {
      examId: params.id,
      rootHallId: {
        not: null,
      },
    },
    include: {
      department: true,
      seats: {
        include: {
          student: true,
        },
      },
    },
  }))!
  const grouped = groupHallByStudentYear(halls)
  console.log(grouped)
  return (
    <div className="mt-2 space-y-4">
      {grouped.map(([key, halls]) => {
        const { year, semester, dept } = JSON.parse(key)
        return (
          <HallPlanTable
            key={key}
            year={Number(year)}
            semester={Number(semester)}
            halls={Array.from(halls)}
          />
        )
      })}
    </div>
  )
}

export default Page
