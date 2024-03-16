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
export function CollegeDetailsForm({hall}:{hall?:Hall}) {
  const HallSchema = z.object({
    hallno: z.string().min(1, {
      message: "department name is required",
    }),
    rows:z.number().min(1, {
      message:"row is required",
    }),
    cols:z.number().min(1, {
      message:"col is required",
    }),
    capacity:z.number().min(1, {
      message:"capacity is required",
    }),
  })
  const form = useForm<z.infer<typeof HallSchema>>({
    resolver: zodResolver(HallSchema),
    defaultValues: {
      hallno: "",
      rows:6,
      cols:5,
    },
  })


  const onSubmit = (data: z.infer<typeof HallSchema>) => {
    console.log(data)
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
