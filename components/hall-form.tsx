"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Hall} from "@prisma/client"
import {  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from "./ui/form"
import { Input } from "./ui/input"

import { Button } from "./ui/button"
import { HallSchema } from "@/schemas/hall"
import { useSearchParams } from "next/navigation"
import { trpc } from "@/app/_trpc/client"
import toast from "react-hot-toast"
export function CollegeDetailsForm({hall}:{hall?:Hall}) {
  const searchParams = useSearchParams()
  const create= trpc.hall.create.useMutation({
    onSuccess:(data)=> {
      toast.success("Hall created")
    },
    onError:(error)=> {
      toast.error(error.message)
    }
  })
  const form = useForm<z.infer<typeof HallSchema>>({
    resolver: zodResolver(HallSchema),
    defaultValues: {
      hallno: "",
      rows:6,
      cols:5,
      departmentId:searchParams.get("departmentId") || "",
    },
  })


  const onSubmit = async (data: z.infer<typeof HallSchema>) => {
    await create.mutateAsync(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="hallno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hall Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Hallno" />
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
                <Input {...field} placeholder="Rows" />
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
                <Input {...field} placeholder="Cols" />
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
                <Input {...field} placeholder="Capacity" />
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
