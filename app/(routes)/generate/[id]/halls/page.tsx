import React from "react"
import { PlusIcon } from "lucide-react"

import DepartmentFilter from "@/components/halls/department-filter"
import { HallForm } from "@/components/halls/form/create-hall"
import HallCard from "@/components/halls/hall-card"
import DialogModal from "@/components/modal/dialog-modal"
import { serverClient } from "@/app/_trpc/serverClient"
import Selecthalls from "../../_components/select-hall-form"

const page = async ({
  searchParams,
  params,
}: {
  searchParams: {
    dept?: string
  }
  params: {
    id: string
  }
}) => {
  console.log(searchParams.dept)
  const exam = await serverClient.exam.get(params.id);
  if (!exam) return <>Not Found</>
  return (
    <div className="m-2 mx-6">
      <h1 className="mb-2 ml-2 text-2xl font-semibold">Departments</h1>
      <div className="flex items-center justify-end gap-2">
        <DepartmentFilter />
        <DialogModal
          title="Add Hall"
          description="Add a new hall to the department."
          trigger={
            <PlusIcon className="border-1 h-full w-full rounded-full bg-slate-100 p-1" />
          }
        >
          <Selecthalls exam={exam} />
        </DialogModal>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {exam.halls?.map((hall) => (
          <HallCard key={hall.id} hall={hall} className="mt-2" />
        ))}
      </div>
    </div>
  )
}

export default page
