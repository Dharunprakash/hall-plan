import React from "react"
import { PlusIcon } from "lucide-react"

import DialogModal from "@/components/modal/dialog-modal"
import { serverClient } from "@/app/_trpc/serverClient"

import DepartmentFilter from "./_components/department-filter"
import HallCard from "./_components/hall-card"
import { HallForm } from "./_components/hall-form"

const page = async ({
  searchParams,
}: {
  searchParams: {
    departmentId: string
  }
}) => {
  const halls = await serverClient.hall.getAll(searchParams.departmentId)
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
          <HallForm />
        </DialogModal>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {halls.map((hall) => (
          <HallCard key={hall.id} hall={hall} className="mt-2" />
        ))}
      </div>
    </div>
  )
}

export default page
