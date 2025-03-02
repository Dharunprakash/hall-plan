import React, { useEffect, useState } from "react"
import { editSchema } from "@/schemas/generate-hall/edit-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectItem } from "@nextui-org/react"
import { Exam } from "@prisma/client"
import { Control, UseFormSetValue, useForm } from "react-hook-form"
import { z } from "zod"

import { ExamDetails, ExamDetailsWithDate } from "@/types/exam"
import { db } from "@/lib/db"
import { useDurationDetails } from "@/hooks/use-duration-details"
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

import DisplayChosenDates from "../../../_components/display-choosen-dates"

const FormPage = ({ exam }: { exam: ExamDetailsWithDate }) => {
  const [editing, setEditing] = useState(false)
  const [testType, setTestType] = useState<string>("")
  const { data: departments } = trpc.department.getAll.useQuery()
  const addDate = useDurationDetails((s) => s.addDate)
  const setData = useDurationDetails((s) => s.setData)

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: exam.name,
      type: exam.type,
      academicYear: exam.academicYear,
      semester: exam.semester,
      departmentId:
        ((exam.type === "INTERNAL" || exam.type === "MODEL_PRACTICAL") &&
          exam.departmentId) ||
        undefined,
      an: exam.timingAn || undefined,
      fn: exam.timingFn || undefined,
      halltype: exam.arrangementType || undefined,
    },
  })

  useEffect(() => {
    setData({
      isAnSelected: exam.dates.reduce((acc, d) => !!d.an || acc, false),
      isFnSelected: exam.dates.reduce((acc, d) => !!d.fn || acc, false),
      details: exam.dates.map((d) => ({
        date: d.date,
        timings: {
          an: !!d.an,
          fn: !!d.fn,
        },
      })),
    })
  }, [exam, setData])

  const handleEdit = () => {
    setEditing(!editing)
  }

  const onSubmit = () => {}

  async function handleAddDate() {
    const dateValue = form.getValues().date
    if (dateValue) {
      const isValid = await form.trigger("date")
      if (isValid) {
        addDate(dateValue)
      }
    }
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="grid justify-end mb-4">
        <div className="mr-4 space-x-4">
          {editing ? (
            <Button onClick={handleEdit} variant="outline">Cancel</Button>
          ) : (
            <Button onClick={handleEdit} variant="outline">Edit</Button>
          )}
          {editing && <Button variant="primary">Save</Button>}
        </div>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-4 grid justify-stretch space-y-8"
          >
            <div className="text-center font-semibold mb-4">
              <h1 className="text-2xl text-gray-800">Exam Details</h1>
            </div>
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
              {editing ? (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Type</FormLabel>
                      <Select
                        className="text-muted-foreground !bg-white"
                        placeholder="Select the test type"
                        isDisabled={!editing}
                        defaultSelectedKeys={field.value ? [field.value] : undefined}
                        {...field}
                        onChange={(e) => {
                          setTestType(e.target.value)
                          field.onChange(e)
                        }}
                      >
                        <SelectItem value={"THEORY"} key={"THEORY"}>THEORY</SelectItem>
                        <SelectItem value={"MODEL_PRACTICAL"} key={"MODEL_PRACTICAL"}>MODEL_PRACTICAL</SelectItem>
                        <SelectItem value={"INTERNAL"} key={"INTERNAL"}>INTERNAL</SelectItem>
                        <SelectItem value={"PRACTICAL"} key={"PRACTICAL"}>PRACTICAL</SelectItem>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="mx-4 grid grid-cols-1 gap-0 rounded-lg bg-[#cbfcf8cc] p-2">
                  <span className="text-gray-600">Test type</span>
                  <span className="font-semibold">{exam.type}</span>
                </div>
              )}
              {/* Repeat similar structure for other fields */}
              {editing ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Serial Test"
                          {...field}
                          onChange={(e) => field.onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="mx-4 grid grid-cols-1 gap-0 rounded-lg bg-[#cbfcf8cc] p-2">
                  <span className="text-gray-600">Name</span>
                  <span className="font-semibold">{exam.name}</span>
                </div>
              )}
              {/* Add more fields as needed */}
            </div>
            <div className="text-center font-semibold mt-8 mb-4">
              <h1 className="text-2xl text-gray-800">Time Details</h1>
            </div>
            <div className="grid w-full gap-y-4">
              {/* Timing component */}
              <div className="grid w-full grid-cols-3 gap-10">
                <Timing control={form.control} setValue={form.setValue} editing={editing} exam={exam} />
              </div>
              <div className="grid w-full grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          className="max-w-xs"
                          placeholder="Select Date"
                          {...field}
                          type="date"
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className="!mt-8"
                  onClick={() => handleAddDate()}
                  variant={"secondary"}
                >
                  Add Exam Date
                </Button>
              </div>
              <div className="grid w-full grid-flow-col">
                <DisplayChosenDates />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default FormPage 