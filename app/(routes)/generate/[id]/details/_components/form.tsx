"use client"

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
      halltype: exam.halls[0].type!,
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
      const isValid = await form.trigger("date") // Await the result of the validation
      if (isValid) {
        addDate(dateValue)
      }
    }
  }

  return (
    <div>
      <div className="grid justify-end ">
        <div className="mr-4 space-x-4">
          {editing ? (
            <Button onClick={handleEdit}>Cancel</Button>
          ) : (
            <Button onClick={handleEdit}>Edit</Button>
          )}
          {editing && <Button>Save</Button>}
        </div>
      </div>
      {/* Your form JSX goes here */}
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-4 grid justify-stretch space-y-8"
          >
            <div className="text-center font-semibold">
              <h1>Exam Details</h1>
            </div>
            <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-3">
              <FormField
                disabled={!editing}
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Type</FormLabel>
                    <Select
                      className="text-muted-foreground !bg-white"
                      placeholder="Select the test type"
                      isDisabled={!editing}
                      defaultSelectedKeys={
                        field.value ? [field.value] : undefined
                      }
                      {...field}
                      onChange={(e) => {
                        setTestType(e.target.value)
                        field.onChange(e)
                      }}
                    >
                      <SelectItem value={"THEORY"} key={"THEORY"}>
                        THEORY
                      </SelectItem>
                      <SelectItem
                        value={"MODEL_PRACTICAL"}
                        key={"MODEL_PRACTICAL"}
                      >
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
                disabled={!editing}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seriel Test"
                        {...field} // Spread field props
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={!editing}
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2023-2024"
                        {...field} // Spread field props
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={!editing}
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
                        isDisabled={!editing}
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
              {(testType === "INTERNAL" || testType === "MODEL_PRACTICAL") && (
                <FormField
                  control={form.control}
                  disabled={!editing}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      {departments && (
                        <Select
                          placeholder="Select Department"
                          isDisabled={!editing}
                          onChange={field.onChange}
                          defaultSelectedKeys={
                            field.value ? [field.value] : undefined
                          }
                        >
                          {departments?.map((department) => (
                            <SelectItem key={department.id}>
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

              <FormField
                disabled={!editing}
                control={form.control}
                name="halltype"
                render={({ field }) => {
                  console.log(field.value)
                  return (
                    <FormItem>
                      <FormLabel>Hall type</FormLabel>
                      <Select
                        {...field}
                        value={field.value}
                        isDisabled={!editing}
                        defaultSelectedKeys={
                          field.value ? [field.value] : undefined
                        }
                        placeholder="Select HallType"
                      >
                        <SelectItem key={"NORMAL"} value={"NORMAL"}>
                          Normal
                        </SelectItem>
                        <SelectItem key={"STAGGERED"} value={"STAGGERED"}>
                          Staggered
                        </SelectItem>
                        <SelectItem key={"ALTERNATE"} value={"ALTERNATE"}>
                          Alternate
                        </SelectItem>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <div className="text-center font-semibold">
              <h1>Time Details</h1>
            </div>
            <div className="grid w-full  gap-y-4">
              {/* @tsignore */}
              <div className="grid w-full grow grid-cols-3 gap-10">
                <Timing control={form.control} setValue={form.setValue} />
              </div>
              <div className="grid w-full  grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            className="max-w-xs"
                            placeholder="shadcn"
                            {...field}
                            type="date"
                            onChange={(e) => {
                              field.onChange(e)
                            }}
                          />
                        </>
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

const Timing = ({
  control,
  setValue,
  innerClassName,
}: {
  control: Control<z.infer<typeof editSchema>> | undefined
  setValue: UseFormSetValue<z.infer<typeof editSchema>>
  innerClassName?: string
}) => {
  const isAnSelected = useDurationDetails((s) => s.isAnSelected)
  const isFnSelected = useDurationDetails((s) => s.isFnSelected)

  useEffect(() => {
    if (isAnSelected && isFnSelected) {
      setValue("timeType", "both")
    } else if (isFnSelected) {
      setValue("timeType", "fn")
    } else if (isAnSelected) {
      setValue("timeType", "an")
    } else {
      setValue("timeType", "fn")
    }
  }, [isAnSelected, isFnSelected, setValue])

  if (isAnSelected && isFnSelected)
    return (
      <>
        <FormField
          control={control}
          name="fn"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>FN Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="1:30-4:30"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="an"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>AN Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="1:30-4:30"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )
  if (isFnSelected)
    return (
      <>
        {" "}
        <FormField
          control={control}
          name="fn"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>FN Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="1:30-4:30"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1"></div>
      </>
    )
  if (isAnSelected)
    return (
      <>
        <FormField
          control={control}
          name="an"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>AN Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="1:30-4:30"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1"></div>
      </>
    )
  return (
    <>
      {" "}
      <FormField
        control={control}
        name="fn"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>FN Time</FormLabel>
            <FormControl>
              <Input
                placeholder="1:30-4:30"
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="col-span-1"></div>
    </>
  )
}

export default FormPage
