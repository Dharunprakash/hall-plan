"use client"

import React, { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { HallWithSeatsAndDept } from "@/types/hall"
import {
  getCapacity,
  getHallCapacity,
  mapArrayOfPairToMatrix,
} from "@/lib/hall/utils"
import { cn } from "@/lib/utils"
import { useHallStateWithSeat } from "@/hooks/use-hall-state"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import EditHallButton from "../edit-hall-button"

const formSchema = z.object({
  rows: z.number().min(1, {
    message: "row is required",
  }),
  cols: z.number().min(1, {
    message: "col is required",
  }),
  seats: z.array(z.object({ isBlocked: z.boolean() })),
})

const EditHall = ({
  hall,
  className,
  show = false,
}: {
  hall: HallWithSeatsAndDept
  className?: string
  show?: boolean
}) => {
  const toggleEditing = useHallStateWithSeat((s) => s.toggleEditing)
  const seats = useHallStateWithSeat((s) => s.seats)
  const setSeats = useHallStateWithSeat((s) => s.setSeats)
  const toggleSeat = useHallStateWithSeat((s) => s.toggleSeat)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cols: hall.cols,
      rows: hall.rows,
      seats: hall.seats,
    },
  })
  useEffect(() => {
    console.log(mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols))
    setSeats(mapArrayOfPairToMatrix(hall.seats, hall.rows, hall.cols))
  }, [hall, setSeats])
  console.log(seats)
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  const isEditing = useHallStateWithSeat((s) => s.isEditing)
  if (!isEditing) {
    return null
  }
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 rounded-lg border border-slate-100 !bg-slate-100 ",
        className
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          {/* <Button type="submit">Submit</Button> */}
          <div className="flex w-full items-center justify-center gap-2">
            <h1 className="text-xl font-semibold">
              {hall.department.code.substring(0, 2)}
              {hall.hallno}
            </h1>
            <EditHallButton />
            <button
              className="flex cursor-pointer rounded-md p-1 transition-all hover:bg-slate-500 hover:text-white"
              onClick={toggleEditing}
            >
              <Check className="h-4 w-4 text-green-500" />
            </button>
          </div>
          <div className="flex w-full flex-row-reverse items-center justify-between">
            {show && <p>Type: {hall.type}</p>}
            <p>TotalSeats: {getCapacity(seats)}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="rows"
              render={({ field }) => (
                <FormItem className="flex items-center gap-1">
                  <FormLabel>Rows: </FormLabel>
                  <FormControl>
                    <Input
                      className="!-mt-[0.05rem] !h-5"
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
                <FormItem className="flex items-center gap-1">
                  <FormLabel>Cols: </FormLabel>
                  <FormControl>
                    <Input
                      className="!-mt-[0.05rem] !h-5"
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
          </div>
          {/* display  */}
          <div className="mx-auto mt-2 w-full">
            <table className="table-bordered mx-auto table">
              <tbody>
                {seats.map((row, i) => (
                  <tr key={i}>
                    {row.map((seat, j) => (
                      <td key={seat.id}>
                        <div
                          className={cn(
                            "h-6 w-6 rounded-md border bg-white",
                            seat.isBlocked && "bg-red-500"
                          )}
                          onClick={() => {
                            toggleSeat(i, j)
                          }}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditHall
