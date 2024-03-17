"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/app/_trpc/client"

const DepartmentFilter = () => {
  const departments = trpc.department.getAll.useQuery()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const newSearchParams = new URLSearchParams(searchParams.toString())

  useEffect(() => {
    if (departments.data && departments.data.length > 0) {
      if (!newSearchParams.get("departmentId")) {
        newSearchParams.set("departmentId", departments.data[0].id)
        router.push(pathname + "?" + newSearchParams.toString())
      }
    }
  })

  return (
    <div>
      <Select
        value={newSearchParams.get("departmentId") || "all"}
        onValueChange={(val) => {
          if (val === "all") newSearchParams.delete("departmentId")
          else newSearchParams.set("departmentId", val)
          router.push(pathname + "?" + newSearchParams.toString())
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Dept" />
        </SelectTrigger>
        <SelectContent>
          {departments.data?.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {department.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DepartmentFilter
