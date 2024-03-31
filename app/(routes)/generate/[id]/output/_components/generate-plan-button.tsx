"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { trpc } from "@/app/_trpc/client"

const GeneratePlanButton = () => {
  const router = useRouter()
  const params = useParams()
  const gereratePlan = trpc.exam.generate.useMutation({})
  return (
    <Button
      onClick={async () => {
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
