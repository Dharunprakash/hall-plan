import { zodResolver } from "@hookform/resolvers/zod"
import { Control, useForm } from "react-hook-form"
import { z } from "zod"

import { useDurationDetails } from "@/hooks/use-duration-details"
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

import DisplayChosenDates from "./display-choosen-dates"
import SelectStudents from "./select-student"

const formSchema = z.object({
  // date: z.string().min(1, "Date is required"),
  // fn: z.string().min(1, "Time is required"),
  // an: z.string().min(1, "Time is required"),
  date: z.string().min(1, "Date is required"),
  fn: z.string().min(1, "Time is required"),
  an: z.string().min(1, "Time is required"),
  departments: z.array(z.string()).min(1, "Select at least one department"),
  selectedYears: z.array(z.string()).min(1, "Select at least one year"),
})
const DateForm = ({ onClose }: { onClose?: () => void }) => {
  const addDate = useDurationDetails((s) => s.addDate)
  const setStep = usegenerateForm((s) => s.setStep)
  const step = usegenerateForm((s) => s.step)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // addDate(values.date)
    setStep(step + 1)
  }
  async function handleAddDate() {
    const dateValue = form.getValues().date
    if (dateValue) {
      const isValid = await form.trigger("date") // Await the result of the validation
      if (isValid) {
        addDate(dateValue)
        form.setValue("date", "")
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <SelectStudents control={form.control} form={form} />
          <div className="grid w-full grid-cols-2 gap-y-4">
            <Timing control={form.control} />
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
            <div className="h-full flex flex-col justify-end ">
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
}: {
  control:
    | Control<{
        date: string
        fn: string
        an: string
        departments: string[]
        selectedYears: string[]
      }>
    | undefined
}) => {
  const isAnSelected = useDurationDetails((s) => s.isAnSelected)
  const isFnSelected = useDurationDetails((s) => s.isFnSelected)
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
                  className="max-w-xs"
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
                  className="max-w-xs"
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
                  className="max-w-xs"
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
                  className="max-w-xs"
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
                className="max-w-xs"
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
