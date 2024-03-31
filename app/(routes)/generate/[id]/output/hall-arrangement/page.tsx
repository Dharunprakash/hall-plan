import { db } from "@/lib/db"

import HallArrangementTable from "../_components/hall-arrangement-table"

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
  console.log(
    "hi",
    examDetails.halls[0].seats.map((s) => s.studentId)
  )
  return (
    <div className="mt-2 space-y-4">
      {examDetails.halls.map((hall) => (
        <HallArrangementTable hall={hall} examDetails={examDetails} />
      ))}
    </div>
  )
}

export default Page
