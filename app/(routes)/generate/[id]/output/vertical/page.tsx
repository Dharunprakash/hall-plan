import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { db } from "@/lib/db"
import { groupHallByStudentYear } from "@/lib/hall/utils"
import { serverClient } from "@/app/_trpc/serverClient"

import HallPlanTable from "../_components/hall-plan-table"
import VerticalCount from "../_components/vertical-details"

const Page = async ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  const examDetails = (await db.exam.findUnique({
    where: {
      id: params.id,
    },
    include: {
      department: true,
      students: true,
      halls: {
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
      },
    },
  }))!
  return (
    <div className="mt-2 space-y-4">
      <VerticalCount examDetail={examDetails} />
    </div>
  )
}

export default Page
