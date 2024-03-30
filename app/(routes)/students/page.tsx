import { serverClient } from "@/app/_trpc/serverClient"

import StudentTable from "../../../components/shared/student-table"

const page = async () => {
  const data = await serverClient.student.getAll({})
  return (
    <div>
      <StudentTable data={data} />
    </div>
  )
}

export default page
