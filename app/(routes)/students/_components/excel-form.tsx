import React, { useState } from "react"
import { inputExcelFormSchema } from "@/schemas/student"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import { intToRoman, readExcel, romanToInt } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/app/_trpc/client"

const ExcelForm = () => {
  const utils = trpc.useUtils()
  const { data: departmentData } = trpc.department.getAll.useQuery()
  const upsert = trpc.student.upsertMany.useMutation({
    onSuccess: (data) => {
      toast.remove()
      toast.success("Students added")
      utils.student.getAll.invalidate()
      console.log(data)
    },
  })
  const [strength, setStrength] = useState(0)
  const form = useForm<z.infer<typeof inputExcelFormSchema>>({
    resolver: zodResolver(inputExcelFormSchema),
    mode: "onChange",
  })
  const { isValid, isSubmitting } = form.formState

  console.log(isValid, form.getValues())
  const onSubmit = async (data: z.infer<typeof inputExcelFormSchema>) => {
    console.log(data)
    toast.loading("Adding students")
    await upsert.mutateAsync(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex w-full flex-col items-center gap-2  p-2 max-sm:p-0">
          <div className="flex w-full flex-col gap-2 p-1">
            <div>Total Students: {strength}</div>
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`file`}>Excel File</FormLabel>
                  <FormControl>
                    <div className="max-xs:flex-col flex gap-2">
                      <Input
                        placeholder="Excel File"
                        id={`file`}
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e?.target?.files![0]
                          console.log(file)
                          readExcel(file, form, setStrength)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`department`}>Department</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <SelectTrigger className="min-w-[210px] lg:min-w-[150px] xl:min-w-[135px]">
                          <SelectValue placeholder="Dept" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentData?.map(({ code, id }) => (
                            <SelectItem key={id} value={id.toString()}>
                              {code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`year`}>Year</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={intToRoman(field.value)}
                        onValueChange={(value) => {
                          field.onChange(romanToInt(value))
                        }}
                      >
                        <SelectTrigger className="min-w-[210px] lg:min-w-[150px] xl:min-w-[135px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((year) => (
                            <SelectItem
                              key={year}
                              value={intToRoman(year) as string}
                            >
                              {intToRoman(year)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`semester`}>Semester</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={intToRoman(field.value)}
                        onValueChange={(value) => {
                          field.onChange(romanToInt(value))
                        }}
                      >
                        <SelectTrigger className="min-w-[210px] lg:min-w-[150px] xl:min-w-[135px]">
                          <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                            <SelectItem
                              key={semester}
                              value={intToRoman(semester) as string}
                            >
                              {intToRoman(semester)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-end gap-2 max-lg:w-full max-md:pb-2 max-md:pl-2 lg:flex-nowrap">
            <DialogClose asChild>
              <Button variant={"outline"} type="reset" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            {!isValid ? (
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            ) : (
              <DialogClose asChild>
                <Button type="submit" disabled={isSubmitting}>
                  Save
                </Button>
              </DialogClose>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}

export default ExcelForm
