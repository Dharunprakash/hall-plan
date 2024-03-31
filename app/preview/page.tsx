import { db } from "@/lib/db"
import { groupHallByStudentYear } from "@/lib/hall/utils"

import AttendanceTable from "../../components/tables/attendance-table"
import HallArrangementTable from "../../components/tables/hall-arrangement-table"
import HallPlanTable from "../../components/tables/hall-plan-table"
import VerticalCount from "../../components/tables/vertical-details"
import { serverClient } from "../_trpc/serverClient"
import { CollegeExamHeader } from "./_components/college-exam-header"

const page = async ({
  searchParams,
}: {
  searchParams: {
    planType?: "hall-plan" | "seat-plan" | "attendance" | "vertical"
    planNo?: string
    examId?: string
  }
}) => {
  if (!searchParams.planType || !searchParams.planNo || !searchParams.examId)
    return <>Page Not Found</>
  const examDetails = await serverClient.exam.preview(searchParams.examId)
  const collegeDetails = await db.college.findFirstOrThrow()
  if (!examDetails) return <h1> No Exam Found </h1>
  // console.log(examDetails)
  console.log(searchParams.planNo)
  const planNos = searchParams.planNo
    .split("-")
    .map((x) => Number(x.trim()) - 1)

  const HallPlanPreview = () => {
    try {
      const groupedHall = groupHallByStudentYear(examDetails.halls)[planNos[0]]

      const { year, semester, dept } = JSON.parse(groupedHall[0])
      return (
        <HallPlanTable
          showHeader={true}
          examDetails={examDetails}
          key={groupedHall[0]}
          year={Number(year)}
          semester={Number(semester)}
          halls={Array.from(groupedHall[1])}
        />
      )
    } catch (error) {
      console.log(error)
      return null
    }
  }
  console.log(planNos)
  const header = {
    collegeDetails,
    examDetails,
    name: searchParams.planType,
  }
  return (
    <main className="mt-2 space-y-4">
      {searchParams.planType === "vertical" ? (
        <CollegeExamHeader {...header}>
          <VerticalCount examDetail={examDetails} />
        </CollegeExamHeader>
      ) : searchParams.planType === "hall-plan" ? (
        <CollegeExamHeader {...header}>
          <HallPlanPreview />
        </CollegeExamHeader>
      ) : (
        examDetails.halls
          .filter((_, ind) => planNos.includes(ind))
          .map((hall) => (
            <CollegeExamHeader {...header} key={`${examDetails.id}-${hall.id}`}>
              {searchParams.planType === "attendance" ? (
                <AttendanceTable
                  hall={hall}
                  examDetails={examDetails}
                  showHeader={true}
                />
              ) : (
                searchParams.planType === "seat-plan" && (
                  <HallArrangementTable
                    hall={hall}
                    examDetails={examDetails}
                    showHeader={true}
                  />
                )
              )}
            </CollegeExamHeader>
          ))
      )}
    </main>
  )
}

export default page
