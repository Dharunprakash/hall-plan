import { useEffect } from "react"
import { TimingDetailsType } from "@/schemas/generate-hall/timing-details"
import { zodResolver } from "@hookform/resolvers/zod"
import { Control, UseFormSetValue, useForm } from "react-hook-form"
import { z } from "zod"

import { useDurationDetails } from "@/hooks/use-duration-details"
import { usegenerateForm } from "@/hooks/use-generate-form"
import { Button } from "@/components/ui/button"rc
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import DisplayChosenDates from "./display-choosen-dates"
import SelectStudents from "./select-student"
import { cn } from "@/lib/utils"

const DateForm = ({ onClose }: { onClose?: () => void }) => {
  const addDate = useDurationDetails((s) => s.addDate)
  const setStep = usegenerateForm((s) => s.setStep)
  const timingDetails = usegenerateForm((s) => s.timingDetails)
  const setTimingDetails = usegenerateForm((s) => s.setTimingDetails)
  const step = usegenerateForm((s) => s.step)
  console.log(timingDetails)
  const form = useForm<z.infer<typeof TimingDetailsType>>({
    resolver: zodResolver(TimingDetailsType),
    mode: "onChange",
    defaultValues: {
      an:
        ((timingDetails?.type === "an" || timingDetails?.type === "both") &&
          timingDetails?.an) ||
        "",
      fn:
        ((timingDetails?.type === "fn" || timingDetails?.type === "both") &&
          timingDetails?.fn) ||
        "",
      departments: timingDetails?.departments || [],
      selectedYears: timingDetails?.selectedYears || [],
      date: timingDetails?.date || "",
    },
  })
  console.log(form.formState.isValid)
  console.log(form.formState.errors)
  console.log(form.getValues())
  function onSubmit(values: z.infer<typeof TimingDetailsType>) {
    console.log(values)
    setStep(step + 1)
    setTimingDetails(values)
  }
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <SelectStudents control={form.control} form={form} />
          <div className="grid w-full grid-cols-2 gap-y-4">
            <Timing control={form.control} setValue={form.setValue} />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        className={"max-w-xs"}
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
            <div className="flex h-full flex-col justify-end ">
              <Button
                type="button"
                className="w-full md:w-[90%]"
                onClick={() => handleAddDate()}
                variant={"secondary"}
              >
                Add Exam Date
              </Button>
            </div>
          </div>
          <DisplayChosenDates />
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
    </div>
  )
}

export const Timing = ({
  control,
  setValue,
  innerClassName
}: {
  control: Control<z.infer<typeof TimingDetailsType>> | undefined
    setValue: UseFormSetValue<z.infer<typeof TimingDetailsType>>
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
                  className={cn("max-w-xs", innerClassName)}
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
                  className={cn("max-w-xs", innerClassName)}
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
                  className={cn("max-w-xs", innerClassName)}
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
                  className={cn("max-w-xs", innerClassName)}
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
                className={cn("max-w-xs", innerClassName)}
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

export default DateForm
