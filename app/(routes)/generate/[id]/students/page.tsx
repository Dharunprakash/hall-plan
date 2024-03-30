import React from "react"

import { db } from "@/lib/db"
import StudentTable from "@/components/shared/student-table"

const page = async ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  const data = await db.student.findMany({
    include: {
      department: true,
      exams: {
        where: {
          id: params.id,
        },
      },
    },
    orderBy: [
      {
        department: {
          name: "asc",
        },
      },
      {
        section: "asc",
      },
      {
        rollno: "asc",
      },
    ],
  })
  return (
    <div>
      <StudentTable data={data} />
    </div>
  )
}

export default page
