import React from "react"
import { PlusIcon } from "lucide-react"

import DialogModal from "@/components/modal/dialog-modal"
import { serverClient } from "@/app/_trpc/serverClient"

import DepartmentFilter from "./_components/department-filter"
import { HallForm } from "./_components/form/create-hall"
import HallCard from "./_components/hall-card"

const page = async ({
  searchParams,
}: {
  searchParams: {
    dept?: string
  }
}) => {
  const halls = await serverClient.hall.getAllMultiple(
    searchParams.dept?.split("-")
  )
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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {halls.map((hall) => (
          <HallCard key={hall.id} hall={hall} className="mt-2" />
        ))}
      </div>
    </div>
  )
}

export default page
