"use client"
import {z} from "zod"
import React, { useEffect, useState } from "react"
import { Select, SelectItem } from "@nextui-org/react"
import { useForm,Control,UseFormSetValue} from "react-hook-form"
import { editSchema } from "@/schemas/generate-hall/edit-schema"
import { db } from "@/lib/db"
import { useDurationDetails } from "@/hooks/use-duration-details"
import { Button } from "@/components/ui/button"
import { Exam } from "@prisma/client"
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

import DisplayChosenDates from "../../_components/display-choosen-dates"

export const Page = ({ params }: { params: { id: string } }) => {
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState<z.infer<typeof Exam || null>();
  const [testType, setTestType] = useState<string>("")
  const { data: departments } = trpc.department.getAll.useQuery()
  const addDate = useDurationDetails((s) => s.addDate)

  useEffect(() => {
    // Fetch data asynchronously within useEffect
    const fetchData = async () => {
      try {
        // Example: Fetching data from the database
        const data = await db.exam.findUnique({
          where: {
            id: params.id,
          },
        })
        console.log(data)
        setData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [params.id])

  const form = useForm<z.infer<typeof editSchema>>({
    mode: "onBlur",
    defaultValues: {
     
    },
  })

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
            <div className="grid w-full grid-cols-1 gap-16  md:grid-cols-3">
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
                        placeholder="Seriel Test-1"
                        {...field} // Spread field props
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
            <div className="grid w-full justify-start gap-y-4">
              {/* @tsignore */}
              <div className="grid w-full grid-flow-col gap-10">
                <Timing control={form.control} setValue={form.setValue}
                />
              </div>
              <div className="grid w-full grid-flow-col gap-10 flex-grow">
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
            </div>
          </form>
        </Form>
      </div>
      <div className="ml-2 grid w-full grid-flow-col gap-10">
        <DisplayChosenDates />
      </div>
    </div>
  )
}


const Timing = ({
  control,
  setValue,
  innerClassName
}: {
  control: Control<z.infer<typeof editSchema>> | undefined
  setValue: UseFormSetValue<z.infer<typeof editSchema>>
  innerClassName?: string
}) => {
  const isAnSelected = useDurationDetails((s) => s.isAnSelected)
  const isFnSelected = useDurationDetails((s) => s.isFnSelected)
  useEffect(() => {
    if (isAnSelected && isFnSelected) {
      setValue("type", "both")
    } else if (isFnSelected) {
      setValue("type", "fn")
    } else if (isAnSelected) {
      setValue("type", "an")
    } else {
      setValue("type", "fn")
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
