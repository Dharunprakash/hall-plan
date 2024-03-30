import { PlusIcon } from "lucide-react"

import GenerateDialogModal from "@/components/modal/generate-dialog-modal"
import { serverClient } from "@/app/_trpc/serverClient"

import ExamCard from "./_components/exam-card"
import ExamPagination from "./_components/exam-pagination"
import Filters from "./_components/filter"

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
    <main className="h-full w-full">
      <section className="flex justify-between">
        <Filters />
        <GenerateDialogModal Icon={PlusIcon} />
      </section>
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
      <ExamPagination />
    </main>
  )
}

export default page
