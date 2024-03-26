"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExamDetailsType } from "@/schemas/generate-hall/exam-details"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectItem, Skeleton } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { usegenerateForm } from "@/hooks/use-generate-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { trpc } from "@/app/_trpc/client"

export const ExamDetailForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter()
  const step = usegenerateForm((s) => s.step)
  const setStep = usegenerateForm((s) => s.setStep)
  const setExamDetailForm = usegenerateForm((s) => s.setExamDetailForm)
  const examDetailForm = usegenerateForm((s) => s.examDetailForm)
  console.log(examDetailForm)
  const form = useForm<z.infer<typeof ExamDetailsType>>({
    resolver: zodResolver(ExamDetailsType),
    defaultValues: {
      type: examDetailForm?.type || undefined,
      name: examDetailForm?.name || "",
      academicYear: examDetailForm?.academicYear || "",
      semester: examDetailForm?.semester || undefined,
      departmentId:
        ((examDetailForm?.type === "INTERNAL" ||
          examDetailForm?.type === "MODEL_PRACTICAL") &&
          examDetailForm?.departmentId) ||
        "",
    },
  })

  console.log(form.formState.isValid)
  console.log(form.getValues())
  const [testType, setTestType] = useState("")
  const onSubmit = async (values: z.infer<typeof ExamDetailsType>) => {
    setStep(step + 1)
    setExamDetailForm(values)
  }
  const { data: departments } = trpc.department.getAll.useQuery()
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Type</FormLabel>
                <Select
                  className="text-muted-foreground !bg-white"
                  placeholder="Select the test type"
                  defaultSelectedKeys={field.value ? [field.value] : undefined}
                  {...field}
                  onChange={(e) => {
                    setTestType(e.target.value)
                    field.onChange(e)
                    console.log(e.target.value, testType)
                  }}
                >
                  <SelectItem value={"THEORY"} key={"THEORY"}>
                    THEORY
                  </SelectItem>
                  <SelectItem value={"MODEL_PRACTICAL"} key={"MODEL_PRACTICAL"}>
                    MODEL_PRACTICAL
                  </SelectItem>
                  <SelectItem value={"INTERNAL"} key={"INTERNAL"}>
                    INTERNAL
                  </SelectItem>
                  <SelectItem value={"PRACTICAL"} key={"PRACTICAL"}>
                    PRACTICAL
                  </SelectItem>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seriel Test-1"
                    {...field} // Spread field props
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2023-2024"
                    {...field} // Spread field props
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => {
              console.log(field.value)
              return (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    {...field}
                    value={field.value}
                    defaultSelectedKeys={
                      field.value ? [field.value] : undefined
                    }
                    placeholder="Select Semester"
                  >
                    <SelectItem key={"ODD"} value={"ODD"}>
                      ODD
                    </SelectItem>
                    <SelectItem key={"EVEN"} value={"EVEN"}>
                      EVEN
                    </SelectItem>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          {(testType === "INTERNAL" ||
            testType === "MODEL_PRACTICAL" ||
            examDetailForm?.type === "INTERNAL" ||
            examDetailForm?.type === "MODEL_PRACTICAL") && (
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  {departments && (
                    <Select
                      placeholder="Select Department"
                      onChange={field.onChange}
                      defaultSelectedKeys={
                        field.value ? [field.value] : undefined
                      }
                    >
                      {departments?.map((department) => (
                        <SelectItem
                          key={department.code}
                          value={department.code}
                        >
                          {department.code}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* <DurationDetails /> */}
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
