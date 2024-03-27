import React, { useState } from "react"
import { HallDetailsSchema } from "@/schemas/generate-hall/hall-details"
import { TimingDetailsType } from "@/schemas/generate-hall/timing-details"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectItem, Selection } from "@nextui-org/react"
import { ChevronDownIcon } from "lucide-react"
import { Control, UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"

import { usegenerateForm } from "@/hooks/use-generate-form"
import { useSelectHallType } from "@/hooks/use-select-hall-type"
import { useSelectedHalls } from "@/hooks/use-selected-hall"
import { Button } from "@/components/ui/button"
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

const Selecthalls = ({ onClose }: { onClose?: () => void }) => {
  const [selectedDepts, setSelected] = useState<string[]>([])

  const setHallDetails = usegenerateForm((s) => s.setHallDetails)
  const setHalls = useSelectedHalls((s) => s.setHalls)
  const examDetails = usegenerateForm((s) => s.examDetailForm)
  const timingDetails = usegenerateForm((s) => s.timingDetails)
  const halltype = useSelectHallType((s) => s.hallType)
  const hallDetails = usegenerateForm((s) => s.hallDetails)
  const hallData = useSelectedHalls((s) => s.halls)

  console.log(hallData)

  console.log(hallDetails)

  const handleDepartmentChange = (selectedKeys: Selection) => {
    console.log(selectedKeys)
    setSelected(Array.from(selectedKeys as Set<string>))
  }

  const form = useForm<z.infer<typeof HallDetailsSchema>>({
    resolver: zodResolver(HallDetailsSchema),
    defaultValues: {
      departments: hallDetails?.departments || new Set<string>(),
      selectedHalls: hallDetails?.selectedHalls || new Set<string>(),
    },
    mode: "onChange",
  })
  const { data: departments } = trpc.department.getAll.useQuery()
  const { data: halls, error } =
    trpc.hall.getAllByDeptCode.useQuery(selectedDepts)
  const handleHallChange = (selectedKeys: Set<string>) => {
    if (!halls) return
    setHalls(halls.filter((hall) => selectedKeys.has(hall.id)))
    console.log(selectedKeys)
  }

  const onSubmit = (data: z.infer<typeof HallDetailsSchema>) => {
    console.log(data)
    setHallDetails(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {!departments ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <FormField
              control={form.control}
              name="departments"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Departments</FormLabel>
                  <FormControl>
                    <Select
                      // label="Department"
                      disallowEmptySelection
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
                          value={department.code}
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
          {!halls ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <FormField
              control={form.control}
              name="selectedHalls"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Halls</FormLabel>
                  <FormControl>
                    <Select
                      // label="Year"
                      disallowEmptySelection
                      selectionMode="multiple"
                      placeholder="Select years"
                      selectedKeys={field.value}
                      className="hidden max-w-xs sm:flex"
                      onSelectionChange={(selectedKeys) => {
                        field.onChange(selectedKeys) // Update form field value
                        handleHallChange(selectedKeys as Set<string>) // Call your custom handler
                      }}
                    >
                      {halls.map((hall) => (
                        <SelectItem key={hall.id} className="capitalize">
                          {hall.department.code + hall.hallno}
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
        <div className="flex w-full justify-end gap-x-5">
          <Button color="danger" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Selecthalls
