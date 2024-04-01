import React from "react"

import { serverClient } from "@/app/_trpc/serverClient"

import Form from "./_components/form"

const page = async ({ params }: { params: { id: string } }) => {
  const examDetails = await serverClient.exam.get(params.id)
  if (!examDetails) return <>Not Found</>
  return <Form exam={examDetails} />
}

export default page
