"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { HallSchema } from "@/schemas/hall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

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

export function HallForm() {
  const router = useRouter()
  const departments = trpc.department.getAll.useQuery()
  const utils = trpc.useUtils()
  const create = trpc.hall.create.useMutation({
    onSuccess: () => {
      utils.hall.getAll.invalidate()
      toast.remove()
      toast.success("Hall created")
      router.refresh()
    },
    onError: (error) => {
      toast.remove()
      toast.error(error.message)
    },
  })
  const form = useForm<z.infer<typeof HallSchema>>({
    resolver: zodResolver(HallSchema),
    defaultValues: {
      hallno: 101,
      rows: 6,
      cols: 5,
    },
  })
  const { isValid } = form.formState
  const onSubmit = async (data: z.infer<typeof HallSchema>) => {
    toast.loading("Creating hall")
    console.log(data)
    try {
      await create.mutateAsync(data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-x-2 space-y-8 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dept</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Dept" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.data?.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={department.id.toString()}
                    >
                      {department.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hallno"
          render={({ field }) => (
            <FormItem className="!mt-0">
              <FormLabel>Hall No</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber)
                  }}
                  placeholder="Hallno"
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rows in hall</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber)
                  }}
                  placeholder="Rows"
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cols"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cols in hall</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber)
                  }}
                  placeholder="Cols"
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isValid ? (
          <DialogClose asChild>
            <Button type="submit" className="col-span-2">
              Submit
            </Button>
          </DialogClose>
        ) : (
          <Button type="submit" className="col-span-2">
            Submit
          </Button>
        )}
      </form>
    </Form>
  )
}
