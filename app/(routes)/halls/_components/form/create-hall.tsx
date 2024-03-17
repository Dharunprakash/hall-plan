"use client"

import { useSearchParams } from "next/navigation"
import { HallSchema } from "@/schemas/hall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/app/_trpc/client"

export function HallForm() {
  const searchParams = useSearchParams()
  const departments = trpc.department.getAll.useQuery()
  const utils = trpc.useUtils()
  const create = trpc.hall.create.useMutation({
    onSuccess: (data) => {
      utils.hall.getAll.cancel()
      utils.hall.getAll.setData(data.departmentId, (prev) => {
        if (!prev) return []
        return [...prev, data]
      })
      toast.remove()
      toast.success("Hall created")
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
      capacity: 30,
      departmentId: searchParams.get("departmentId") || "",
    },
  })
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Dept" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem key={`department-1`} value={"all"}>
                    All
                  </SelectItem>
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
            <FormItem>
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
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber)
                  }}
                  placeholder="Capacity"
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
