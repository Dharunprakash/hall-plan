import { db } from "@/lib/db"

import AttendanceTable from "../_components/attendance-table"

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
        <AttendanceTable hall={hall} examDetails={examDetails} />
      ))}
    </div>
  )
}

export default Page
