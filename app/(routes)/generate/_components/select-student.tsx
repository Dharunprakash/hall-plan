import React, { useState } from "react"
import { TimingDetailsType } from "@/schemas/generate-hall/timing-details"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@nextui-org/react"
import { ChevronDownIcon } from "lucide-react"
import { Control, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/app/_trpc/client"

import { years } from "../../students/_components/data"

const SelectStudents = ({
  control,
  form,
}: {
  control: Control<z.infer<typeof TimingDetailsType>> | undefined
  form: UseFormReturn<z.infer<typeof TimingDetailsType>>
}) => {
  const { data: students } = trpc.student.getAllMinimal.useQuery()
  const { data: departments } = trpc.department.getAll.useQuery()

  const [departmentIds, setDepartmentIds] = useState(new Set<string>())
  const [yearFilter, setYearFilter] = useState(new Set<string>())
  const [count, setCount] = useState(0)

  const filteredStudents = React.useMemo(() => {
    if (!students || departmentIds.size === 0 || yearFilter.size === 0) {
      setCount(0)
      return []
    }
    const res = students.filter((student) => {
      if (departmentIds.size > 0 && !departmentIds.has(student.departmentId)) {
        return false
      }
      if (yearFilter.size > 0 && !yearFilter.has(student.year.toString())) {
        return false
      }
      return true
    })
    setCount(res.length)
    return res
  }, [students, departmentIds, yearFilter])

  //@ts-ignore
  const handleDepartmentChange = (selectedIds) => {
    setDepartmentIds(new Set(selectedIds))
  }
  //@ts-ignore
  const handleYearChange = (selectedYears) => {
    setYearFilter(new Set(selectedYears))
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <h2>student Count: {count}</h2>
      </div>
      <div className="flex items-center gap-2">
        {!departments ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <FormField
            control={form.control}
            name="departments"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
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
                      //@ts-ignore
                      selectedKeys={field.value} // Use field.value for selectedKeys
                      onSelectionChange={(selectedKeys) => {
                        field.onChange(selectedKeys) // Update form field value
                        handleDepartmentChange(selectedKeys) // Call your custom handler
                      }}
                    >
                      {departments.map((department) => (
                        <DropdownItem
                          key={department.id}
                          className="capitalize"
                        >
                          {department.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="selectedYears"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
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
                    //@ts-ignore
                    selectedKeys={yearFilter} // Use field.value for selectedKeys
                    selectionMode="multiple"
                    onSelectionChange={(selectedKeys) => {
                      field.onChange(selectedKeys) // Update form field value
                      handleYearChange(selectedKeys) // Call your custom handler
                    }}
                  >
                    {years.map((status) => (
                      <DropdownItem
                        key={status.uid.toString()}
                        className="capitalize"
                      >
                        {status.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default SelectStudents
