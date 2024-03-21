"use client"

import React from "react"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import { ChevronDownIcon } from "lucide-react"

import { useSelectedStudents } from "@/hooks/use-selected-students"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/app/_trpc/client"

import { years } from "../../students/_components/data"

const SelectStudents = () => {
  const { data: students } = trpc.student.getAllMinimal.useQuery()
  const { data: departments } = trpc.department.getAll.useQuery()
  const deptFilter = useSelectedStudents((state) => state.departmentIds)
  const setDeptFilter = useSelectedStudents((state) => state.setDeptFilter)
  const yearFilter = useSelectedStudents((state) => state.years)
  const setYearFilter = useSelectedStudents((state) => state.setYearsFilter)
  const setCount = useSelectedStudents((state) => state.setCount)

  const filteredStudents = React.useMemo(() => {
    if (!students) {
      setCount(0)
      return []
    }
    const res = students.filter((student) => {
      if (deptFilter !== "all" && !deptFilter.has(student.departmentId)) {
        return false
      }
      if (yearFilter !== "all" && !yearFilter.has(student.year.toString())) {
        return false
      }
      return true
    })
    setCount(res.length)
    return res
  }, [students, setCount, deptFilter, yearFilter])
  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <h2>student Count: {filteredStudents.length}</h2>
      </div>
      <div className="flex items-center gap-2">
        {!departments ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                variant="flat"
                endContent={<ChevronDownIcon className="text-small" />}
              >
                Dept
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Multiple selection example"
              variant="flat"
              closeOnSelect={false}
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={deptFilter}
              onSelectionChange={setDeptFilter}
            >
              {departments.map((department) => (
                <DropdownItem key={department.id} className="capitalize">
                  {department.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              size="sm"
              variant="flat"
            >
              Year
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={yearFilter}
            selectionMode="multiple"
            onSelectionChange={setYearFilter}
          >
            {years.map((status) => (
              <DropdownItem key={status.uid.toString()} className="capitalize">
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  )
}

export default SelectStudents
