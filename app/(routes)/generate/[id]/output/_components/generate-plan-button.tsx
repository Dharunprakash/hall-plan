"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { trpc } from "@/app/_trpc/client"

const GeneratePlanButton = () => {
  const router = useRouter()
  const params = useParams()
  const gereratePlan = trpc.exam.plan.generate.useMutation({
    onSuccess: (data) => {
      toast.remove()
      toast.success("Plan generated")
    },
    onError: (error) => {
      toast.remove()
      toast.error(error.message)
    },
  })
  return (
    <Button
      onClick={async () => {
        toast.loading("Generating Plan...")
        await gereratePlan.mutateAsync(params.id as string)
        router.refresh()
      }}
      className="mr-4"
    >
      Generate Plan
    </Button>
  )
}

export default GeneratePlanButton
