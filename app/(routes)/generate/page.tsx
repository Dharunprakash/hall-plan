import { DeleteIcon } from "lucide-react"

import { serverClient } from "@/app/_trpc/serverClient"

import DeleteExam from "./_components/delete-exam"
import ExamCard from "./_components/exam-card"
import ExamPagination from "./_components/exam-pagination"
import TopBar from "./_components/top-bar"

const page = async ({
  searchParams,
}: {
  searchParams: {
    page?: number
    type?: string
    startDate?: string
    endDate?: string
  }
}) => {
  const exams = await serverClient.exam.getAll({})
  return (
    <main className="h-full w-full p-2">
      <TopBar />
      <div className="mx-auto flex max-h-[65vh] max-w-7xl flex-col overflow-y-auto">
        {exams.map((exam) => (
          // <div className="flex " key={exam.id}>
          <ExamCard key={exam.id} exam={exam} />
          //   <DeleteExam id={exam.id} />
          // </div>
        ))}
      </div>
      <ExamPagination />
    </main>
  )
}

export default page
