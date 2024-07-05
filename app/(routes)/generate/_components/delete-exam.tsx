"use client"

import React from "react"
import { DeleteIcon } from "lucide-react"
import toast from "react-hot-toast"

import { trpc } from "@/app/_trpc/client"

const DeleteExam = ({ id }: { id: string }) => {
  const deleteExam = trpc.exam.delete.useMutation()
  return (
    <DeleteIcon
      className="h-6 w-6 text-red-500"
      onClick={async () => {
        await deleteExam.mutateAsync(id)
        toast.success("Exam Deleted")
      }}
    />
  )
}

export default DeleteExam
