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

const DateForm = ({ onClose }: { onClose?: () => void }) => {
  const { addDate } = useDurationDetails()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    addDate(values.date)
  }

  return (
    <div>
      <DisplayChosenDates />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2 flex max-w-xl flex-row items-center gap-2"
        >
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"secondary"}>
            Add Exam Date
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default DateForm
