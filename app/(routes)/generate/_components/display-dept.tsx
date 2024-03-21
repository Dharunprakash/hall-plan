import React from "react"
import { Select, SelectItem } from "@nextui-org/react"
import { Department } from "@prisma/client"

import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/app/_trpc/client"

const DeptFilter = ({
  departments,
}: {
  departments: Department[] | null | undefined
}) => {
  if (!departments) return
  return <div></div>
}

export default DeptFilter
