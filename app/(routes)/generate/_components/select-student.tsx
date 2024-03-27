import React, { useState } from "react"
import { TimingDetailsType } from "@/schemas/generate-hall/timing-details"
import { Select, SelectItem, Selection } from "@nextui-org/react"
import { ChevronDownIcon } from "lucide-react"
import { Control, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { usegenerateForm } from "@/hooks/use-generate-form"
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

  const timingDetails = usegenerateForm((s) => s.timingDetails)
  console.log(timingDetails?.departments)
  console.log(timingDetails?.selectedYears)

  const [departmentIds, setDepartmentIds] = useState(
    new Set<string>(timingDetails?.departments)
  )
  const [yearFilter, setYearFilter] = useState(
    new Set<string>(timingDetails?.selectedYears)
  )
  const [count, setCount] = useState(0)

  const filteredStudents = React.useMemo(() => {
    if (!students || departmentIds.size === 0 || yearFilter.size === 0) {
      setCount(0)
      return []
    }
    const res = students.filter((student) => {
      if (
        departmentIds.size > 0 &&
        !departmentIds.has(student.department.code)
      ) {
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
      <div className="grid grid-cols-2">
        <div className="flex w-full max-w-xs flex-col gap-2">
          {!departments ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <FormField
              control={form.control}
              name="departments"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Select
                      // label="Department"
                      selectionMode="multiple"
                      placeholder="Select departments"
                      selectedKeys={field.value} // Use field.value for selectedKeys
                      className="max-w-xs"
                      //@ts-ignore
                      onSelectionChange={(selectedKeys) => {
                        field.onChange(selectedKeys) // Update form field value
                        handleDepartmentChange(selectedKeys) // Call your custom handler
                      }}
                    >
                      {departments.map((department) => (
                        <SelectItem
                          key={department.code}
                          className="capitalize"
                        >
                          {department.code}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <FormField
            control={form.control}
            name="selectedYears"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Select
                    // label="Year"
                    selectionMode="multiple"
                    placeholder="Select years"
                    selectedKeys={field.value}
                    className="hidden max-w-xs sm:flex"
                    onSelectionChange={(selectedKeys) => {
                      field.onChange(selectedKeys) // Update form field value
                      handleYearChange(selectedKeys) // Call your custom handler
                    }}
                  >
                    {years.map((status) => (
                      <SelectItem
                        key={status.uid.toString()}
                        value={status.uid.toString()}
                        className="capitalize"
                      >
                        {status.name}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default SelectStudents
