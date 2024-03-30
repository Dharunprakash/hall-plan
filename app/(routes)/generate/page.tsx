import { serverClient } from "@/app/_trpc/serverClient"

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
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
      <ExamPagination />
    </main>
  )
}

export default page
