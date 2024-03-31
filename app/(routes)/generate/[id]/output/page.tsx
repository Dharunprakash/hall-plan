import Link from "next/link"
import { redirect } from "next/navigation"

import { HallPlans } from "@/components/shared/hall-plans"
import { serverClient } from "@/app/_trpc/serverClient"

import AttendanceTable from "../../../../../components/tables/attendance-table"
import HallArrangementTable from "../../../../../components/tables/hall-arrangement-table"
import VerticalCount from "../../../../../components/tables/vertical-details"

const page = async ({
  params,
  searchParams,
}: {
  params: {
    id: string
  }
  searchParams: {
    planType?: "hall-plan" | "seat-plan" | "attendance" | "vertical"
  }
}) => {
  if (!searchParams.planType)
    redirect(`/generate/${params.id}/output?planType=hall-plan`)
  const examDetails = await serverClient.exam.getDetailed(params.id)
  if (!examDetails) return <h1> No Exam Found </h1>
  console.log(examDetails)

  const LinkModal = ({
    children,
    ind,
  }: {
    children: React.ReactNode
    ind: number
  }) => {
    return (
      <Link
        target="_blank"
        href={`/preview?planType=${searchParams.planType}&planNo=${
          ind + 1
        }&examId=${params.id}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <section className="mt-2 space-y-4">
      {searchParams.planType === "vertical" && (
        <LinkModal ind={1}>
          <VerticalCount examDetail={examDetails} />
        </LinkModal>
      )}
      {searchParams.planType === "hall-plan" && (
        <HallPlans examDetails={examDetails} />
      )}
      {examDetails.halls.map((hall, ind) => (
        <LinkModal ind={ind} key={`${examDetails.id}-${hall.id}`}>
          {searchParams.planType === "attendance" ? (
            <AttendanceTable
              hall={hall}
              examDetails={examDetails}
              key={`${examDetails.id}-${hall.id}`}
            />
          ) : (
            searchParams.planType === "seat-plan" && (
              <HallArrangementTable hall={hall} examDetails={examDetails} />
            )
          )}
        </LinkModal>
      ))}
    </section>
  )
}

export default page
