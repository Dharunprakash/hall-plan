import React from "react"
import { redirect } from "next/navigation"

const page = ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  redirect(`/generate/${params.id}/output/hall-plan`)
}

export default page
