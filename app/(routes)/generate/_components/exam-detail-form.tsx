"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import placeholder from "@/public/images/placeholder.jpg"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { trpc } from "@/app/_trpc/client"

export const VehicleForm = ({ onClose }: { onClose?: () => void }) => {
  const utils = trpc.useUtils()
  const router = useRouter()
  // const createVehicle = trpc.vehicles.create.useMutation({
  //   onSuccess: () => {
  //     utils.vehicles.getAll.invalidate()
  //     toast.success("Vehicle created successfully")
  //   },
  // })
  // const updateVehicle = trpc.vehicles.update.useMutation({
  //   onSuccess: () => {
  //     utils.vehicles.getAll.invalidate()
  //     toast.success("Vehicle edited successfully")
  //   },
  // })
  // const [avatarView, setAvatarView] = useState(true)
  // const [image, setImage] = useState<string | null>(null)
  // const form = useForm<z.infer<typeof VehicleSchema>>({
  //   resolver: zodResolver(VehicleSchema),
  //   defaultValues: {
  //     model: vehicle?.model || "",
  //     image: vehicle?.image || "",
  //     insuranceExpiry: vehicle?.insuranceExpiry
  //       ? format(vehicle?.insuranceExpiry, "yyyy-MM-dd")
  //       : "",
  //     number: vehicle?.number || "",
  //     fitnessExpiry: vehicle?.fitnessExpiry
  //       ? format(vehicle?.fitnessExpiry, "yyyy-MM-dd")
  //       : "",
  //     nationalPermitExpiry: vehicle?.nationalPermitExpiry
  //       ? format(vehicle?.nationalPermitExpiry, "yyyy-MM-dd")
  //       : "",
  //   },
  // })

  // const isPending = form.formState.isSubmitting
  // console.log(form.formState.isValid)
  // console.log(form.getValues())

  // const onSubmit = async (values: z.infer<typeof VehicleSchema>) => {
  //   try {
  //     let res
  //     if (!vehicle) {
  //       res = await createVehicle.mutateAsync({
  //         ...values,
  //       })
  //     } else {
  //       res = await updateVehicle.mutateAsync({
  //         id: vehicle.id,
  //         ...values,
  //       })
  //     }
  //     console.log(res)
  //     form.reset()
  //     if (onClose) onClose()
  //   } catch (err) {
  //     console.log(err)
  //     toast.error("Something went wrong")
  //     console.log(err)
  //   } finally {
  //     if (onClose) onClose()
  //   }
  // }
  const form = useForm({})
  const onSubmit = (values: any) => {
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="examName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SERIAL TEST - I"
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
        </div>
        <div className="flex w-full justify-end gap-x-5">
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
