import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useDurationDetails } from "@/hooks/use-duration-details"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import DisplayChosenDates from "./display-choosen-dates"

const formSchema = z.object({
  date: z.string().nonempty("Date is required"),
})

const DurationDetails = () => {
  const { addDate } = useDurationDetails()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    addDate(values.date)
  }

  return (
    <div>
      <DisplayChosenDates />
      <div className="grid grid-cols-2 align-bottom">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
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
              <FormMessage>{form.formState.errors.date?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          onClick={() => form.handleSubmit(handleSubmit)()}
          variant="secondary"
        >
          Add Exam Date
        </Button>
      </div>
    </div>
  )
}

export default DurationDetails
