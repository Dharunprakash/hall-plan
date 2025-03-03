"use client"

import { useState } from "react"
import { HallDetailsSchema } from "@/schemas/generate-hall/hall-details"
import { GenerateHallSchema } from "@/schemas/generate-hall/input-schema"
import { createExam } from "@/server/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectItem, Selection } from "@nextui-org/react"
import { HallArrangementType } from "@prisma/client"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import { ExamDetails } from "@/types/exam"
import { useDurationDetails } from "@/hooks/use-duration-details"
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

const Selecthalls = ({
  onClose,
  exam,
}: {
  onClose?: () => void
  exam?: ExamDetails
}) => {
  const [selectedDepts, setSelected] = useState<string[]>([])

  const { data: departments } = trpc.department.getAll.useQuery()
  const { data: halls, error } = trpc.hall.getAllMultiple.useQuery({
    departmentCodes: selectedDepts,
  })

  const updateHalls = trpc.exam.updateHalls.useMutation({
    onSuccess: () => {
      onClose && onClose()
      toast.remove()
      toast.success("Halls added to exam successfully")
    },
    onError: (error) => {
      toast.remove()
      toast.error(
        error.message
          ? error.message
          : "An error occurred while adding halls to exam"
      )
    },
  })

  // const createExam = trpc.exam.create.useMutation({
  //   onSuccess: () => {
  //     onClose && onClose()
  //     toast.remove()
  //     toast.success("Exam created successfully")
  //   },
  //   onError: (error) => {
  //     toast.remove()
  //     toast.error(error.message)
  //   },
  // })

  const setHallDetails = usegenerateForm((s) => s.setHallDetails)
  const setHalls = useSelectedHalls((s) => s.setHalls)
  const examDetails = usegenerateForm((s) => s.examDetailForm)
  const timingDetails = usegenerateForm((s) => s.timingDetails)
  const halltype = useSelectHallType((s) => s.hallType)
  const hallDetails = usegenerateForm((s) => s.hallDetails)
  const hallData = useSelectedHalls((s) => s.halls)
  const durationDetails = useDurationDetails((s) => s.details)
  const setStep = usegenerateForm((s) => s.setStep)

  console.log(hallData)
  console.log(hallDetails)
  console.log(halls)

  const handleDepartmentChange = (selectedKeys: Selection) => {
    console.log(selectedKeys)
    setSelected(Array.from(selectedKeys as Set<string>))
  }

  const form = useForm<z.infer<typeof HallDetailsSchema>>({
    resolver: zodResolver(HallDetailsSchema),
    defaultValues: {
      departments: exam
        ? new Set<string>(exam?.halls?.map((h) => h.department.code) ?? [])
        : hallDetails?.departments,
      selectedHalls: exam
        ? new Set(exam?.halls?.map((h) => h.rootHallId) ?? [])
        : hallDetails?.selectedHalls,
    },
    mode: "onChange",
  })

  const handleHallChange = (selectedKeys: Set<string>) => {
    if (!halls) return
    setHalls(halls.filter((hall) => selectedKeys.has(hall.id)))
    console.log(selectedKeys)
  }

  const onSubmit = async (data: z.infer<typeof HallDetailsSchema>) => {
    if (exam) {
      toast.loading("Adding halls to exam")
      const hallArrangementType =
        (exam.arrangementType ??
          (!!exam.halls?.length && exam.halls[0]?.type)) ||
        HallArrangementType.NORMAL
      updateHalls.mutate({
        examId: exam.id,
        type: hallArrangementType,
        hallIds: Array.from(data.selectedHalls),
      })
      return
    }
    console.log(examDetails)
    console.log(timingDetails)
    toast.loading("Creating exam")
    console.log(data)
    setHallDetails(data)
    const fullData: z.infer<typeof GenerateHallSchema> = {
      durationDetails,
      hallType: halltype,
      ...data,
      examDetails: examDetails!,
      timingDetails: timingDetails!,
    }
    console.log("hi")
    try {
      await createExam(fullData)
      console.log("exam created")
      toast.remove()
      toast.success("Exam created successfully")
      onClose && onClose()
      setStep(1)
    } catch (error: any) {
      console.log(error)
      toast.remove()
      toast.error(error.message)
    }
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
          {!halls && !hallData ? (
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
                      {halls?.length
                        ? halls.map((hall) => (
                            <SelectItem key={hall.id} className="capitalize">
                              {hall.department.code + hall.hallno}
                            </SelectItem>
                          ))
                        : hallData.map((hall) => (
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
